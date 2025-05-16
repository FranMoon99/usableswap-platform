
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import MessageInput from '@/components/MessageInput';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isMe: boolean;
}

interface ConversationProps {
  conversationId: string;
}

// Mock conversation data
const mockConversations: Record<string, {
  messages: Message[];
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}> = {
  '1': {
    messages: [
      {
        id: '1',
        text: 'Hola, ¿sigue disponible el iPhone?',
        senderId: 'user123',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 2),
        status: 'read',
        isMe: false,
      },
      {
        id: '2',
        text: 'Sí, todavía está disponible.',
        senderId: 'seller1',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 1.5),
        status: 'read',
        isMe: true,
      },
      {
        id: '3',
        text: '¿Aceptarías 700€?',
        senderId: 'user123',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60),
        status: 'read',
        isMe: false,
      },
      {
        id: '4',
        text: 'Lo siento, el precio mínimo es 750€',
        senderId: 'seller1',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 30),
        status: 'delivered',
        isMe: true,
      },
    ],
    product: {
      id: 'product1',
      title: 'iPhone 13 Pro Max - 256GB',
      price: 750,
      image: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?q=80&w=2874&auto=format&fit=crop',
    },
    user: {
      id: 'user123',
      name: 'Ana García',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    }
  },
  '2': {
    messages: [
      {
        id: '1',
        text: 'Hola, estoy interesado en tu MacBook Pro',
        senderId: 'user123',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 3),
        status: 'read',
        isMe: false,
      },
      {
        id: '2',
        text: '¿Podrías enviarme más fotos del teclado y la pantalla?',
        senderId: 'user123',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 2),
        status: 'read',
        isMe: false,
      }
    ],
    product: {
      id: 'product2',
      title: 'MacBook Pro 2022',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2626&auto=format&fit=crop',
    },
    user: {
      id: 'user456',
      name: 'Carlos Rodríguez',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    }
  },
  '3': {
    messages: [
      {
        id: '1',
        text: 'Hola, me interesa la PlayStation 5',
        senderId: 'user123',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 26),
        status: 'read',
        isMe: false,
      },
      {
        id: '2',
        text: 'Genial, ¿te interesaría por 450€?',
        senderId: 'seller3',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 25),
        status: 'read',
        isMe: true,
      },
      {
        id: '3',
        text: '¿Puedes hacerme un descuento? ¿400€?',
        senderId: 'user123',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 24.5),
        status: 'read',
        isMe: false,
      },
      {
        id: '4',
        text: 'Te la dejo en 430€, incluye 2 mandos',
        senderId: 'seller3',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 24.2),
        status: 'read',
        isMe: true,
      },
      {
        id: '5',
        text: 'Te lo dejo en 400€, es mi última oferta',
        senderId: 'seller3',
        timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
        status: 'read',
        isMe: true,
      },
    ],
    product: {
      id: 'product3',
      title: 'Sony PlayStation 5',
      price: 400,
      image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2564&auto=format&fit=crop',
    },
    user: {
      id: 'user789',
      name: 'Lucía Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    }
  }
};

const Conversation: React.FC<ConversationProps> = ({ conversationId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationData, setConversationData] = useState(mockConversations[conversationId]);
  const [messages, setMessages] = useState<Message[]>(mockConversations[conversationId]?.messages || []);
  const { user } = useAuth();
  
  useEffect(() => {
    // Update messages when conversation changes
    if (mockConversations[conversationId]) {
      setConversationData(mockConversations[conversationId]);
      setMessages(mockConversations[conversationId].messages);
    }
  }, [conversationId]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      senderId: user?.id || '',
      timestamp: new Date(),
      status: 'sent',
      isMe: true,
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate message delivery status update
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentMessages: Message[] = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      const formattedDate = formatMessageDate(messageDate);
      
      if (formattedDate !== currentDate) {
        if (currentMessages.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentMessages,
          });
        }
        currentDate = formattedDate;
        currentMessages = [message];
      } else {
        currentMessages.push(message);
      }
    });
    
    if (currentMessages.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentMessages,
      });
    }
    
    return groups;
  };
  
  if (!conversationData) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p>Conversación no encontrada</p>
      </div>
    );
  }
  
  const messageGroups = groupMessagesByDate();
  const { product, user: otherUser } = conversationData;
  
  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Conversation Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{otherUser.name}</h3>
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <a href={`/product/${product.id}`} className="flex items-center space-x-2">
              <img 
                src={product.image} 
                alt={product.title} 
                className="h-8 w-8 object-cover rounded"
              />
              <div className="text-xs text-left">
                <p className="truncate max-w-[120px]">{product.title}</p>
                <p className="font-semibold">{product.price.toLocaleString('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0 
                  })}</p>
              </div>
            </a>
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex justify-center mb-4">
              <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                {group.date}
              </span>
            </div>
            {group.messages.map((message) => (
              <div 
                key={message.id}
                className={`mb-4 flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] ${
                    message.isMe 
                      ? 'bg-primary text-primary-foreground rounded-tl-xl rounded-bl-xl rounded-tr-xl' 
                      : 'bg-white text-gray-800 rounded-tr-xl rounded-br-xl rounded-tl-xl border border-gray-200'
                  } px-4 py-3 shadow-sm`}
                >
                  <p>{message.text}</p>
                  <div className={`text-xs mt-1 flex items-center ${message.isMe ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.isMe && (
                      <span className="ml-1">
                        {message.status === 'sent' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 10 4 15 9 20"></polyline>
                            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                          </svg>
                        )}
                        {message.status === 'delivered' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 10 4 15 9 20"></polyline>
                            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                          </svg>
                        )}
                        {message.status === 'read' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 7 17l-5-5"></path>
                            <path d="m22 10-7.5 7.5L13 16"></path>
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Conversation;
