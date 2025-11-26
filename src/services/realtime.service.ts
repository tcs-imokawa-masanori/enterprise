// OpenAI Realtime API WebRTC Service
// Handles voice-to-voice communication with OpenAI's Realtime API

export interface RealtimeConfig {
  serverUrl?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onToolCall?: (toolCall: any) => void;
}

export interface RealtimeSession {
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  sendText: (text: string) => void;
  mute: () => void;
  unmute: () => void;
  isMuted: boolean;
}

class RealtimeService {
  private localStream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private config: RealtimeConfig;
  private isConnected = false;
  private isMuted = false;
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private audioQueue: Int16Array[] = [];
  private isPlaying = false;

  constructor(config: RealtimeConfig) {
    // Determine the API URL based on current location
    const getApiUrl = () => {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001';
      } else {
        // For production, use HTTPS with the same domain
        // Nginx should proxy /api to port 3001
        return 'https://enterprise.sae-g.com/api';
      }
    };

    this.config = {
      serverUrl: getApiUrl(),
      ...config
    };
  }

  async connect(): Promise<void> {
    try {
      console.log('🎤 Connecting to OpenAI Realtime API...');

      // First, get microphone access
      console.log('🎙️ Requesting microphone access...');
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000 // OpenAI Realtime API expects 24kHz
        }
      });
      console.log('✅ Microphone access granted');

      // Use the backend server as a proxy to handle authentication
      const hostname = window.location.hostname;
      const proxyUrl = hostname === 'localhost' || hostname === '127.0.0.1'
        ? 'ws://localhost:3001/realtime-proxy'
        : 'wss://enterprise.sae-g.com/realtime-proxy';

      console.log('🔗 Connecting to proxy:', proxyUrl);

      const ws = new WebSocket(proxyUrl);

      return new Promise((resolve, reject) => {
        ws.onopen = async () => {
          console.log('🚀 WebSocket connection established with OpenAI');
          this.isConnected = true;

          // Configure the session after connection
          const sessionConfig = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions: 'You are a helpful AI assistant. Please provide clear, concise responses.',
              voice: 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: {
                model: 'whisper-1'
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500
              },
              temperature: 0.8,
              max_response_output_tokens: 4096
            }
          };

          ws.send(JSON.stringify(sessionConfig));
          console.log('📋 Session configuration sent');

          // Start audio streaming
          this.startAudioStreaming(ws);

          this.config.onConnect?.();
          resolve();
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket connection error:', error);
          this.config.onError?.(new Error('WebSocket connection failed'));
          reject(error);
        };

        ws.onclose = () => {
          console.log('📡 WebSocket connection closed');
          this.isConnected = false;
          this.stopAudioStreaming();
          this.config.onDisconnect?.();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        // Store WebSocket for later use
        this.websocket = ws;
      });

    } catch (error) {
      console.error('❌ Failed to connect to Realtime API:', error);
      this.cleanup();
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  disconnect(): void {
    console.log('🔌 Disconnecting from Realtime API');
    this.cleanup();
    this.config.onDisconnect?.();
  }

  sendText(text: string): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text }]
        }
      };
      this.websocket.send(JSON.stringify(message));
      console.log('📤 Sent text message:', text);
    }
  }

  mute(): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      this.isMuted = true;
      console.log('🔇 Microphone muted');
    }
  }

  unmute(): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
      this.isMuted = false;
      console.log('🎤 Microphone unmuted');
    }
  }

  get connected(): boolean {
    return this.isConnected;
  }

  get muted(): boolean {
    return this.isMuted;
  }

  private handleWebSocketMessage(data: any): void {
    console.log('📨 Received event:', data.type);

    switch (data.type) {
      case 'conversation.item.input_audio_transcription.completed':
        if (data.transcript) {
          console.log('🗣️ User said:', data.transcript);
          // Mark as user transcript
          this.config.onTranscript?.(`[USER] ${data.transcript}`, true);
        }
        break;

      case 'conversation.item.input_audio_transcription.partial':
        if (data.transcript) {
          // Mark as user transcript (partial)
          this.config.onTranscript?.(`[USER] ${data.transcript}`, false);
        }
        break;

      case 'response.audio.delta':
        // Handle audio chunks from OpenAI
        if (data.delta) {
          this.playAudioDelta(data.delta);
        }
        break;

      case 'response.audio_transcript.delta':
        // Handle transcript updates
        if (data.delta) {
          console.log('🤖 Assistant saying:', data.delta);
          // Mark as assistant transcript (partial)
          this.config.onTranscript?.(`[ASSISTANT] ${data.delta}`, false);
        }
        break;

      case 'response.audio_transcript.done':
        if (data.transcript) {
          console.log('🤖 Assistant said:', data.transcript);
          // Mark as assistant transcript (complete)
          this.config.onTranscript?.(`[ASSISTANT] ${data.transcript}`, true);
        }
        break;

      case 'response.audio.done':
        this.config.onAudioEnd?.();
        break;

      case 'response.function_call_arguments.done':
        this.config.onToolCall?.(data);
        break;

      case 'error':
        console.error('Realtime API error:', data.error);
        this.config.onError?.(new Error(data.error.message));
        break;

      case 'session.updated':
        console.log('✅ Session configuration updated');
        break;

      case 'input_audio_buffer.speech_started':
        console.log('🎤 Speech detected');
        this.config.onAudioStart?.();
        break;

      case 'input_audio_buffer.speech_stopped':
        console.log('🔇 Speech ended');
        break;

      case 'response.done':
        console.log('✅ Response completed');
        break;

      default:
        // Log other events for debugging
        if (data.type) {
          console.log(`📋 Event: ${data.type}`, data);
        }
    }
  }


  private startAudioStreaming(ws: WebSocket): void {
    if (!this.localStream) return;

    this.audioContext = new AudioContext({ sampleRate: 24000 });
    this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.localStream);

    // Create a script processor for capturing audio
    this.processor = this.audioContext.createScriptProcessor(2048, 1, 1);

    this.processor.onaudioprocess = (e) => {
      if (!this.isConnected || this.isMuted) return;

      const inputData = e.inputBuffer.getChannelData(0);

      // Convert Float32Array to Int16Array (PCM16)
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Convert to base64 and send to OpenAI
      const base64Audio = this.arrayBufferToBase64(pcm16.buffer);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64Audio
        }));
      }
    };

    this.mediaStreamSource.connect(this.processor);
    this.processor.connect(this.audioContext.destination);

    console.log('🎙️ Audio streaming started');
  }

  private stopAudioStreaming(): void {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    console.log('🎙️ Audio streaming stopped');
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private playAudioDelta(base64Audio: string): void {
    if (!base64Audio) return;

    const arrayBuffer = this.base64ToArrayBuffer(base64Audio);
    const int16Array = new Int16Array(arrayBuffer);

    // Add to queue
    this.audioQueue.push(int16Array);

    // Start playing if not already playing
    if (!this.isPlaying) {
      this.playNextAudioChunk();
    }
  }

  private async playNextAudioChunk(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.audioQueue.shift()!;

    // Create audio context if not exists
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: 24000 });
    }

    // Convert Int16Array to Float32Array
    const float32Array = new Float32Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      float32Array[i] = audioData[i] / 32768.0;
    }

    // Create audio buffer
    const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    // Play the audio
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    source.onended = () => {
      this.playNextAudioChunk();
    };

    source.start();
  }

  private cleanup(): void {
    // Stop audio streaming
    this.stopAudioStreaming();

    // Close WebSocket connection
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Remove audio element
    if (this.audioElement) {
      this.audioElement.remove();
      this.audioElement = null;
    }

    // Clear audio queue
    this.audioQueue = [];
    this.isPlaying = false;

    this.isConnected = false;
    this.isMuted = false;
  }
}

// Factory function to create a realtime session
export function createRealtimeSession(config: RealtimeConfig): RealtimeSession {
  const service = new RealtimeService(config);

  return {
    connect: () => service.connect(),
    disconnect: () => service.disconnect(),
    get isConnected() { return service.connected; },
    sendText: (text: string) => service.sendText(text),
    mute: () => service.mute(),
    unmute: () => service.unmute(),
    get isMuted() { return service.muted; }
  };
}

export default RealtimeService;
