import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

dotenv.config();

const app = express();
const PORT = process.env.REALTIME_SERVER_PORT || 3001;

// Create HTTP server
const server = createServer(app);

// Create WebSocket server for /stream endpoint
const streamWss = new WebSocketServer({ noServer: true });

// Create WebSocket server for /realtime-proxy endpoint
const realtimeProxyWss = new WebSocketServer({ noServer: true });

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Voice chat backend server is running' });
});

// OpenAI Realtime API client secret endpoint
app.post('/realtime/client_secret', async (req, res) => {
  try {
    console.log('🎤 Generating client secret for OpenAI Realtime API...');

    const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.error('❌ No OpenAI API key found in environment variables');
      return res.status(500).json({
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY or VITE_OPENAI_API_KEY in your .env file.'
      });
    }

    // For OpenAI Realtime API, we can use the API key directly as client secret
    // In production, you might want to create ephemeral tokens
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      return res.status(response.status).json({
        error: `OpenAI API error: ${response.statusText}`,
        details: errorText
      });
    }

    const session = await response.json();
    console.log('✅ Client secret generated successfully');

    res.json({
      client_secret: session.client_secret.value,
      expires_at: session.client_secret.expires_at
    });

  } catch (error) {
    console.error('❌ Error generating client secret:', error);
    res.status(500).json({
      error: 'Failed to generate client secret',
      message: error.message
    });
  }
});

// Analytics endpoint (referenced in .env)
app.post('/analytics', (req, res) => {
  console.log('📊 Analytics data received:', req.body);
  res.json({ status: 'received' });
});

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (pathname === '/stream') {
    streamWss.handleUpgrade(request, socket, head, (ws) => {
      streamWss.emit('connection', ws, request);
    });
  } else if (pathname === '/realtime-proxy') {
    realtimeProxyWss.handleUpgrade(request, socket, head, (ws) => {
      realtimeProxyWss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Handle /stream WebSocket connections
streamWss.on('connection', (ws) => {
  console.log('📡 Client connected to /stream');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Stream message received:', data);

      // Echo back for now (you can implement your logic here)
      ws.send(JSON.stringify({
        topic: data.topic,
        ts: Date.now(),
        payload: { received: true, ...data.payload }
      }));
    } catch (error) {
      console.error('Error processing stream message:', error);
    }
  });

  ws.on('close', () => {
    console.log('📡 Client disconnected from /stream');
  });

  ws.on('error', (error) => {
    console.error('Stream WebSocket error:', error);
  });
});

// Handle /realtime-proxy WebSocket connections
realtimeProxyWss.on('connection', async (ws) => {
  console.log('🎤 Client connected to /realtime-proxy');

  let openAIWs = null;

  try {
    // Get API key
    const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      ws.send(JSON.stringify({ type: 'error', error: { message: 'OpenAI API key not configured' } }));
      ws.close();
      return;
    }

    // Connect to OpenAI Realtime API
    const { WebSocket } = await import('ws');
    openAIWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    // Forward messages from OpenAI to client
    openAIWs.on('message', (data) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data.toString());
      }
    });

    // Forward messages from client to OpenAI
    ws.on('message', (data) => {
      if (openAIWs && openAIWs.readyState === openAIWs.OPEN) {
        openAIWs.send(data.toString());
      }
    });

    openAIWs.on('open', () => {
      console.log('✅ Connected to OpenAI Realtime API');
      ws.send(JSON.stringify({ type: 'session.created' }));
    });

    openAIWs.on('error', (error) => {
      console.error('❌ OpenAI WebSocket error:', error);
      ws.send(JSON.stringify({ type: 'error', error: { message: error.message } }));
    });

    openAIWs.on('close', () => {
      console.log('📡 OpenAI connection closed');
      ws.close();
    });

  } catch (error) {
    console.error('❌ Error setting up realtime proxy:', error);
    ws.send(JSON.stringify({ type: 'error', error: { message: error.message } }));
    ws.close();
  }

  ws.on('close', () => {
    console.log('🎤 Client disconnected from /realtime-proxy');
    if (openAIWs) {
      openAIWs.close();
    }
  });

  ws.on('error', (error) => {
    console.error('Realtime proxy WebSocket error:', error);
    if (openAIWs) {
      openAIWs.close();
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Voice chat backend server running on http://localhost:${PORT}`);
  console.log(`📡 HTTP endpoint: http://localhost:${PORT}/realtime/client_secret`);
  console.log(`🔌 WebSocket endpoints:`);
  console.log(`   - ws://localhost:${PORT}/stream (for general streaming)`);
  console.log(`   - ws://localhost:${PORT}/realtime-proxy (for OpenAI Realtime API)`);
  console.log(`💡 Make sure OPENAI_API_KEY is set in your .env file`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down voice chat backend server...');
  streamWss.clients.forEach(ws => ws.close());
  realtimeProxyWss.clients.forEach(ws => ws.close());
  server.close(() => {
    process.exit(0);
  });
});