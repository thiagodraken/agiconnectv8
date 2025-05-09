import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(url = 'http://localhost:3000') {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url, {
      autoConnect: true,
      transports: ['websocket'],
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  return socketRef.current;
}
