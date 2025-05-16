
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    user: {
      id: 'seller1',
      name: 'Ana García',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    product: {
      id: 'product1',
      title: 'iPhone 13 Pro Max',
      image: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?q=80&w=2874&auto=format&fit=crop',
    },
    lastMessage: {
      text: 'Hola, ¿sigue disponible?',
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 30),
      isRead: true,
    }
  },
  {
    id: '2',
    user: {
      id: 'seller2',
      name: 'Carlos Rodríguez',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    product: {
      id: 'product2',
      title: 'MacBook Pro 2022',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2626&auto=format&fit=crop',
    },
    lastMessage: {
      text: '¿Podrías enviar más fotos?',
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 2),
      isRead: false,
    }
  },
  {
    id: '3',
    user: {
      id: 'seller3',
      name: 'Lucía Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    product: {
      id: 'product3',
      title: 'Sony PlayStation 5',
      image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2564&auto=format&fit=crop',
    },
    lastMessage: {
      text: 'Te lo dejo en 400€, es mi última oferta',
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
      isRead: true,
    }
  }
];

interface ConversationListProps {
  activeConversationId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ activeConversationId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
      return date.toLocaleDateString('es-ES', options);
    } else {
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
      return date.toLocaleDateString('es-ES', options);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-[calc(100vh-220px)]">
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar mensajes"
            className="w-full pl-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100%-57px)]">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No se encontraron conversaciones
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Link
              key={conversation.id}
              to={`/conversations/${conversation.id}`}
              className={`flex items-start p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                activeConversationId === conversation.id ? 'bg-primary/5' : ''
              }`}
            >
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium truncate">{conversation.user.name}</p>
                  <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.text}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {conversation.product.title}
                </p>
              </div>
              {!conversation.lastMessage.isRead && (
                <div className="h-2 w-2 bg-primary rounded-full mt-2 ml-1"></div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
