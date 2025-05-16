
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConversationList from '@/components/ConversationList';
import Conversation from '@/components/Conversation';
import { useAuth } from '@/contexts/AuthContext';

const Conversations: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/conversations');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Acceso no autorizado</h2>
            <p className="mb-6">Debes iniciar sesión para ver tus mensajes.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-8">Mensajes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Conversation List - Left Side */}
          <div className="md:col-span-1">
            <ConversationList activeConversationId={conversationId} />
          </div>
          
          {/* Conversation Detail - Right Side */}
          <div className="md:col-span-2 lg:col-span-3">
            {conversationId ? (
              <Conversation conversationId={conversationId} />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      className="h-8 w-8 text-primary"
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-medium mb-2">Tus mensajes</h2>
                <p className="text-gray-500 mb-6">
                  Selecciona una conversación para ver los mensajes o comienza una nueva conversación con un vendedor
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Conversations;
