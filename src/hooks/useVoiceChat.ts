import { useState, useCallback, useRef, useEffect } from 'react';
import { createRealtimeSession, RealtimeSession } from '../services/realtime.service';

export interface VoiceChatState {
  isConnecting: boolean;
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  error: string | null;
  transcript: string;
  partialTranscript: string;
}

export interface VoiceChatActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  mute: () => void;
  unmute: () => void;
  sendText: (text: string) => void;
}

export interface UseVoiceChatOptions {
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  serverUrl?: string;
}

export function useVoiceChat(options: UseVoiceChatOptions = {}): [VoiceChatState, VoiceChatActions] {
  const [state, setState] = useState<VoiceChatState>({
    isConnecting: false,
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    isMuted: false,
    error: null,
    transcript: '',
    partialTranscript: ''
  });

  const sessionRef = useRef<RealtimeSession | null>(null);

  // Handle transcript updates
  const handleTranscript = useCallback((transcript: string, isFinal: boolean) => {
    setState(prev => ({
      ...prev,
      ...(isFinal 
        ? { transcript: transcript, partialTranscript: '' }
        : { partialTranscript: transcript }
      )
    }));
    options.onTranscript?.(transcript, isFinal);
  }, [options.onTranscript]);

  // Handle connection events
  const handleConnect = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isConnecting: false, 
      isConnected: true, 
      error: null 
    }));
    options.onConnect?.();
  }, [options.onConnect]);

  const handleDisconnect = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isConnecting: false,
      isConnected: false, 
      isListening: false,
      isSpeaking: false,
      transcript: '',
      partialTranscript: ''
    }));
    options.onDisconnect?.();
  }, [options.onDisconnect]);

  const handleError = useCallback((error: Error) => {
    setState(prev => ({ 
      ...prev, 
      isConnecting: false,
      error: error.message 
    }));
    options.onError?.(error);
  }, [options.onError]);

  const handleAudioStart = useCallback(() => {
    setState(prev => ({ ...prev, isSpeaking: true }));
  }, []);

  const handleAudioEnd = useCallback(() => {
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  // Connect to voice chat
  const connect = useCallback(async () => {
    if (sessionRef.current?.isConnected) return;

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Check for browser support and microphone permission
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support voice chat. Please use Chrome, Firefox, or Edge, and ensure you are using HTTPS or localhost.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Just checking permission

      // Create session
      sessionRef.current = createRealtimeSession({
        serverUrl: options.serverUrl,
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
        onError: handleError,
        onTranscript: handleTranscript,
        onAudioStart: handleAudioStart,
        onAudioEnd: handleAudioEnd,
        onToolCall: (toolCall) => {
          console.log('🔧 Tool call received:', toolCall);
          // Handle tool calls here if needed
        }
      });

      await sessionRef.current.connect();
      
    } catch (error) {
      console.error('Failed to connect voice chat:', error);
      handleError(error as Error);
    }
  }, [options.serverUrl, handleConnect, handleDisconnect, handleError, handleTranscript, handleAudioStart, handleAudioEnd]);

  // Disconnect from voice chat
  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
  }, []);

  // Mute/unmute microphone
  const mute = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.mute();
      setState(prev => ({ ...prev, isMuted: true }));
    }
  }, []);

  const unmute = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.unmute();
      setState(prev => ({ ...prev, isMuted: false }));
    }
  }, []);

  // Send text message
  const sendText = useCallback((text: string) => {
    if (sessionRef.current?.isConnected) {
      sessionRef.current.sendText(text);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Update listening state based on connection and mute status
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isListening: prev.isConnected && !prev.isMuted
    }));
  }, [state.isConnected, state.isMuted]);

  const actions: VoiceChatActions = {
    connect,
    disconnect,
    mute,
    unmute,
    sendText
  };

  return [state, actions];
}
