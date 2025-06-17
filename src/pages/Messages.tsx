import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: 1,
      user: {
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        online: true
      },
      lastMessage: 'Hey! I saw your e-commerce project. Really impressive work!',
      timestamp: '2m ago',
      unread: 2,
      messages: [
        {
          id: 1,
          sender: 'Sarah Chen',
          content: 'Hi! I came across your e-commerce project on DevConnect.',
          timestamp: '10:30 AM',
          isOwn: false
        },
        {
          id: 2,
          sender: 'You',
          content: 'Hey Sarah! Thanks for checking it out. What did you think?',
          timestamp: '10:32 AM',
          isOwn: true
        },
        {
          id: 3,
          sender: 'Sarah Chen',
          content: 'Really impressive work! The UI is clean and the functionality is solid. I especially loved the payment integration.',
          timestamp: '10:35 AM',
          isOwn: false
        },
        {
          id: 4,
          sender: 'Sarah Chen',
          content: 'Hey! I saw your e-commerce project. Really impressive work!',
          timestamp: '10:38 AM',
          isOwn: false
        }
      ]
    },
    {
      id: 2,
      user: {
        name: 'Alex Rodriguez',
        username: 'alexdev',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400',
        online: false
      },
      lastMessage: 'Would love to collaborate on a React Native project',
      timestamp: '1h ago',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'Alex Rodriguez',
          content: 'Hi! I noticed we have similar interests in mobile development.',
          timestamp: '9:15 AM',
          isOwn: false
        },
        {
          id: 2,
          sender: 'You',
          content: 'Absolutely! I saw your task management app. Great work!',
          timestamp: '9:20 AM',
          isOwn: true
        },
        {
          id: 3,
          sender: 'Alex Rodriguez',
          content: 'Would love to collaborate on a React Native project',
          timestamp: '9:25 AM',
          isOwn: false
        }
      ]
    },
    {
      id: 3,
      user: {
        name: 'Emma Wilson',
        username: 'emmawilson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        online: true
      },
      lastMessage: 'Thanks for the feedback on the design system!',
      timestamp: '3h ago',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'You',
          content: 'Your design system is incredible! Love the attention to detail.',
          timestamp: '7:45 AM',
          isOwn: true
        },
        {
          id: 2,
          sender: 'Emma Wilson',
          content: 'Thanks for the feedback on the design system!',
          timestamp: '8:00 AM',
          isOwn: false
        }
      ]
    },
    {
      id: 4,
      user: {
        name: 'Michael Chang',
        username: 'michaelchang',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        online: false
      },
      lastMessage: 'The AI integration looks amazing',
      timestamp: '1d ago',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'Michael Chang',
          content: 'The AI integration looks amazing',
          timestamp: 'Yesterday 3:30 PM',
          isOwn: false
        }
      ]
    }
  ];

  const currentConversation = conversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // Here you would normally send the message to your backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-slate-700/50 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-slate-700/50">
                <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:bg-slate-800/30 ${
                      selectedChat === conversation.id ? 'bg-slate-800/50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                          className="w-12 h-12 rounded-full border-2 border-purple-500"
                        />
                        {conversation.user.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-white truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={currentConversation.user.avatar}
                          alt={currentConversation.user.name}
                          className="w-10 h-10 rounded-full border-2 border-purple-500"
                        />
                        {currentConversation.user.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-white">{currentConversation.user.name}</h2>
                        <p className="text-xs text-gray-400">
                          {currentConversation.user.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
                        <Video className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {currentConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700/50 text-gray-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isOwn ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-slate-700/50">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                      <button
                        type="button"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-slate-800/50 rounded-full p-8 mb-6 inline-block">
                      <Send className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No conversation selected</h2>
                    <p className="text-gray-400">Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;