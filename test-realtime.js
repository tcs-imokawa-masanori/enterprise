const WebSocket = require('ws');
require('dotenv').config({ path: './server/.env' });

console.log('Testing OpenAI Realtime API directly...');
console.log('API Key:', process.env.OPENAI_API_KEY ? 'Found' : 'Missing');

const url = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview';
const ws = new WebSocket(url, {
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'OpenAI-Beta': 'realtime=v1'
  }
});

ws.on('open', () => {
  console.log('✅ Connected to OpenAI Realtime API');

  // Just wait and see what happens
  setTimeout(() => {
    console.log('Closing connection...');
    ws.close();
  }, 5000);
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  console.log('📨 Message:', msg.type);
  if (msg.type === 'error') {
    console.error('Error details:', msg.error);
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});

ws.on('close', () => {
  console.log('Connection closed');
});