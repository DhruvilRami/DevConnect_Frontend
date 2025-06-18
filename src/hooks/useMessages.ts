import { useState, useEffect } from 'react';
import { apiService, Conversation, Message } from '../services/api';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getConversations();
      setConversations(response.conversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations
  };
};

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMessages(conversationId);
      setMessages(response.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!conversationId) return;
    
    try {
      const response = await apiService.sendMessage(conversationId, content);
      setMessages(prev => [...prev, response.messageData]);
      return response.messageData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages
  };
};