const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Endpoint to generate OpenAI Realtime API client secret
app.post('/realtime/client_secret', async (req, res) => {
  try {
    console.log('Generating OpenAI Realtime client secret...');

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        modalities: ['text', 'audio']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Failed to generate client secret',
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Client secret generated successfully');
    console.log('Session data:', JSON.stringify(data, null, 2));
    res.json(data);

  } catch (error) {
    console.error('Error generating client secret:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'OpenAI Realtime Token Server' });
});

// WebSocket server for stream endpoint
const wss = new WebSocket.Server({ 
  server, 
  path: '/stream' 
});

wss.on('connection', (ws) => {
  console.log('📡 Stream WebSocket client connected');
  
  // Send a welcome message
  ws.send(JSON.stringify({
    topic: 'connection',
    ts: Date.now(),
    payload: { status: 'connected' }
  }));

  ws.on('close', () => {
    console.log('📡 Stream WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('📡 Stream WebSocket error:', error);
  });
});

// WebSocket proxy for OpenAI Realtime API
const realtimeProxy = new WebSocket.Server({ 
  server, 
  path: '/realtime-proxy',
  verifyClient: (info) => {
    console.log('🎤 WebSocket connection attempt from:', info.origin);
    return true;
  }
});

realtimeProxy.on('connection', (clientWs, req) => {
  console.log('🎤 Realtime proxy client connected from:', req.url);
  
  // Connect to OpenAI Realtime API with proper headers
  const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview', {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1'
    }
  });

  openaiWs.on('open', () => {
    console.log('✅ Connected to OpenAI Realtime API');
    clientWs.send(JSON.stringify({ type: 'proxy.connected' }));
  });

  openaiWs.on('message', (data) => {
    // Forward messages from OpenAI to client
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data);
    }
  });

  openaiWs.on('error', (error) => {
    console.error('❌ OpenAI WebSocket error:', error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ 
        type: 'error', 
        error: { message: error.message } 
      }));
    }
  });

  openaiWs.on('close', () => {
    console.log('📡 OpenAI WebSocket connection closed');
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close();
    }
  });

  // Forward messages from client to OpenAI
  clientWs.on('message', (data) => {
    if (openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(data);
    }
  });

  clientWs.on('close', () => {
    console.log('📡 Realtime proxy client disconnected');
    if (openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.close();
    }
  });

  clientWs.on('error', (error) => {
    console.error('📡 Realtime proxy error:', error);
    if (openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.close();
    }
  });
});

const PORT = process.env.REALTIME_PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎤 OpenAI Realtime Token Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 WebSocket stream: ws://localhost:${PORT}/stream`);

  if (!process.env.OPENAI_API_KEY) {
    console.error('⚠️ WARNING: OPENAI_API_KEY not found in environment variables!');
  } else {
    console.log('✅ OPENAI_API_KEY configured');
  }
});

module.exports = app;