import { createContext, useCallback, useContext, useState } from 'react';

const ChatContext = createContext(null);



export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openChat = useCallback((on) => setOpen(on), []);

  return <ChatContext.Provider value={{ open, openChat }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  return useContext(ChatContext);
}
