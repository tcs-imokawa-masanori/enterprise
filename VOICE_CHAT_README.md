# 🎤 OpenAI Realtime Voice Chat Integration

This document explains how to set up and use the OpenAI Realtime API voice chat feature in your Enterprise Architecture Assistant.

## 🚀 Quick Start

### 1. Run Setup Script
```bash
# On Windows
setup-voice-chat.bat

# On Mac/Linux  
chmod +x setup-voice-chat.sh
./setup-voice-chat.sh
```

### 2. Configure OpenAI API Key
Edit `server/.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
REALTIME_PORT=3001
```

### 3. Start Services
```bash
# Terminal 1: Start voice chat server
cd server
npm start

# Terminal 2: Start main application
npm run dev
```

## 🎯 Features

### Voice Chat Modes
- **🎤 Realtime Voice Chat**: Full duplex voice conversation with OpenAI
- **📝 Voice to Text**: Traditional speech recognition for text input

### Voice Controls
- **📞 Phone Icon**: Start/stop realtime voice chat
- **🎤 Mic Icon**: Voice to text input
- **🔇 Mute/Unmute**: Control microphone during voice chat
- **📊 Status Indicators**: Visual feedback for connection status

### Language Support
- **English**: Full voice chat support
- **Japanese**: Voice input with text response (configurable)

## 🔧 Technical Architecture

### Backend (Node.js/Express)
```
server/
├── realtime-token.js     # OpenAI client secret endpoint
├── package.json          # Server dependencies
└── .env                  # Configuration
```

### Frontend (React/TypeScript)
```
src/
├── services/
│   └── realtime.service.ts    # WebRTC connection service
├── hooks/
│   └── useVoiceChat.ts        # React hook for voice chat
└── components/
    └── GlobalAIAssistant.tsx  # Enhanced with voice UI
```

### Connection Flow
1. **Client Secret**: Frontend requests token from backend
2. **WebRTC Setup**: Browser establishes peer connection
3. **Audio Stream**: Microphone → OpenAI → Speaker
4. **Data Channel**: Text events and function calls

## 🎨 UI Components

### Voice Status Indicators
- **🟢 Voice Active**: Connected to OpenAI Realtime API
- **🔇 Muted**: Microphone is muted
- **👂 Listening**: AI is actively listening
- **🔊 Speaking**: AI is generating audio response

### Chat Integration
- Voice transcripts appear as user messages
- AI responses work with existing text chat
- Seamless switching between voice and text
- Follow-up actions and quick suggestions

## ⚙️ Configuration

### Voice Settings
```typescript
// Customize voice model and settings
const voiceConfig = {
  model: 'gpt-realtime-preview-2025-08-28',
  voice: 'marin',  // Options: marin, cedar, etc.
  language: 'en',  // or 'ja' for Japanese
  instructions: 'Custom system prompt...'
};
```

### Audio Settings
```typescript
// Microphone configuration
const audioConfig = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 24000
};
```

## 🛡️ Security & Best Practices

### API Key Security
- ✅ **Backend Only**: API keys never exposed to browser
- ✅ **Client Secrets**: Short-lived tokens for WebRTC
- ✅ **HTTPS Required**: Secure connections for production

### Privacy
- ✅ **Local Processing**: Audio streams directly to OpenAI
- ✅ **No Recording**: No persistent audio storage
- ✅ **User Control**: Easy mute/disconnect options

## 🔍 Troubleshooting

### Common Issues

#### "Failed to connect to Realtime API"
- Verify OpenAI API key has Realtime API access
- Check server is running on port 3001
- Ensure CORS is properly configured

#### "Microphone access denied"
- Grant microphone permissions in browser
- Check browser security settings
- Try HTTPS instead of HTTP (required for some browsers)

#### "No audio from AI"
- Check browser audio settings
- Verify speakers/headphones are working
- Look for WebRTC connection errors in console

#### "Voice transcription not working"
- Ensure microphone is not muted
- Check audio levels in browser
- Verify WebRTC data channel is open

### Debug Mode
Enable detailed logging:
```typescript
// Add to console for debugging
localStorage.setItem('voice-debug', 'true');
```

### Browser Compatibility
- ✅ **Chrome 88+**: Full support
- ✅ **Firefox 84+**: Full support  
- ✅ **Safari 14+**: Full support
- ✅ **Edge 88+**: Full support

## 📊 Performance

### Latency Targets
- **Voice Input**: < 100ms processing
- **AI Response**: < 500ms generation
- **Audio Output**: < 100ms playback
- **Total Round Trip**: < 1 second

### Bandwidth Usage
- **Audio Upload**: ~24 kbps (mono, 24kHz)
- **Audio Download**: ~24 kbps (mono, 24kHz)
- **Control Data**: < 1 kbps (JSON messages)

## 🔮 Advanced Features

### Function Calling
The voice AI can call functions during conversation:
- Add architecture capabilities
- Generate diagrams
- Create reports
- Update project data

### Multimodal Input
Future enhancement: Send screenshots alongside voice for context-aware responses.

### SIP Integration
For enterprise phone systems, the Realtime API supports SIP endpoints.

## 📞 Support

### Getting Help
1. Check browser console for error messages
2. Verify all setup steps were completed
3. Test with a simple "Hello" voice message
4. Check OpenAI API usage dashboard

### Known Limitations
- Requires OpenAI API key with Realtime API access
- WebRTC may need TURN servers for restrictive networks
- Audio quality depends on microphone and network

---

**Ready to start voice chatting with your Enterprise Architecture AI? 🚀**

Run the setup script and start building the future of voice-enabled architecture assistance!
