const WebSocket = require('ws');
const http = require('http');
const url = require('url');
require('dotenv').config();

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

// Map to store client-to-OpenAI WebSocket connections
const connections = new Map();

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/realtime-proxy') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (clientWs) => {
  console.log('🔌 Client connected to proxy');

  // Create connection to OpenAI Realtime API
  // Using the specific model version
  const openAIUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';

  const openAIWs = new WebSocket(openAIUrl, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1'
    }
  });

  connections.set(clientWs, openAIWs);

  openAIWs.on('open', () => {
    console.log('✅ Connected to OpenAI Realtime API');

    // Send minimal session configuration
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        voice: 'alloy'
      }
    };

    openAIWs.send(JSON.stringify(sessionConfig));
    console.log('📤 Sent session configuration');
  });

  openAIWs.on('message', (data) => {
    // Log the message type for debugging
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'error') {
        console.error('❌ OpenAI API Error:', msg.error);
      } else if (msg.type === 'session.created') {
        console.log('✅ Session created with OpenAI');
        // NOW notify client that connection is ready
        clientWs.send(JSON.stringify({
          type: 'proxy.connected',
          message: 'Connected to OpenAI Realtime API'
        }));
      } else if (msg.type === 'response.audio.delta') {
        console.log('🔊 Sending audio chunk to client');
      }
    } catch (e) {
      // Binary data, ignore parsing
    }

    // Forward OpenAI messages to client
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data);
    }
  });

  openAIWs.on('error', (error) => {
    console.error('❌ OpenAI WebSocket error:', error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({
        type: 'error',
        error: {
          type: 'proxy_error',
          message: error.message
        }
      }));
    }
  });

  openAIWs.on('close', () => {
    console.log('📡 OpenAI connection closed');
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close();
    }
    connections.delete(clientWs);
  });

  // Forward client messages to OpenAI
  clientWs.on('message', (data) => {
    if (openAIWs.readyState === WebSocket.OPEN) {
      openAIWs.send(data);
    }
  });

  clientWs.on('close', () => {
    console.log('🔌 Client disconnected from proxy');
    if (openAIWs.readyState === WebSocket.OPEN) {
      openAIWs.close();
    }
    connections.delete(clientWs);
  });

  clientWs.on('error', (error) => {
    console.error('❌ Client WebSocket error:', error);
    if (openAIWs.readyState === WebSocket.OPEN) {
      openAIWs.close();
    }
    connections.delete(clientWs);
  });
});

const PORT = process.env.REALTIME_PROXY_PORT || 3002;
server.listen(PORT, () => {
  console.log(`🎤 OpenAI Realtime Proxy Server running on port ${PORT}`);
  console.log(`📡 WebSocket proxy: ws://localhost:${PORT}/realtime-proxy`);

  if (!process.env.OPENAI_API_KEY) {
    console.error('⚠️ WARNING: OPENAI_API_KEY not found in environment variables!');
  } else {
    console.log('✅ OPENAI_API_KEY configured');
  }
});

module.exports = server;