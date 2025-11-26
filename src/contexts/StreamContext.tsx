import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultRealtime, RealtimeClient, StreamMessage } from '../services/realtime';

interface StreamContextType {
  client: RealtimeClient;
  status: 'disconnected' | 'connecting' | 'connected';
  subscribe: (topic: string, fn: (msg: StreamMessage) => void) => () => void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const useStream = () => {
  const ctx = useContext(StreamContext);
  if (!ctx) throw new Error('useStream must be used within StreamProvider');
  return ctx;
};

export const StreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const client = useMemo(() => defaultRealtime, []);

  useEffect(() => {
    client.connect();
    const id = setInterval(() => setStatus(client.status), 300);
    return () => {
      clearInterval(id);
      client.disconnect();
    };
  }, [client]);

  const value: StreamContextType = {
    client,
    status,
    subscribe: (topic, fn) => client.subscribe(topic, fn)
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};


