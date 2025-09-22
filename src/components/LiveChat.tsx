import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your Dolonia assistant. How can I help you with our cloud solutions today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Scroll detection for chat button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight * 0.8; // Show after scrolling 80% of viewport height
      
      setIsVisible(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickReplies = [
    "Website development",
    "AI automation",
    "Security services",
    "Pricing information"
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputMessage;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('pricing') || message.includes('cost')) {
      return "Our services range from $1,500 for starter websites to $10,000+ for enterprise solutions. We also offer monthly retainers starting at $1,000. Would you like specific pricing for your project?";
    } else if (message.includes('demo') || message.includes('schedule')) {
      return "I'd be happy to schedule a consultation! Our team can show you our automation solutions and discuss your specific needs. What type of project are you interested in?";
    } else if (message.includes('security')) {
      return "We provide comprehensive security audits, zero-trust implementation, and business protection systems. Our security packages range from $750-$7,500. What's your current security setup?";
    } else if (message.includes('migration')) {
      return "We offer complete migration support for websites, data, and business systems. Our team handles everything from planning to execution. What are you looking to migrate?";
    } else if (message.includes('website') || message.includes('web')) {
      return "We create custom websites from $1,500-$7,500+ with modern design, responsive layouts, and performance optimization. What type of website do you need?";
    } else if (message.includes('ai') || message.includes('automation')) {
      return "Our AI and automation services help streamline business processes, from $1,000 for basic workflows to $12,000+ for advanced systems. What tasks would you like to automate?";
    } else if (message.includes('hosting')) {
      return "We provide secure hosting starting at $50/month, with full-service packages including updates and security for $250-$500/month. What are your hosting requirements?";
    } else {
      return "I'm here to help with web development, AI automation, security, hosting, and business consulting. What specific service can I assist you with today?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Only show when scrolled */}
      {isVisible && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full bg-gradient-cyber hover:shadow-glow text-ocean-deep shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-cyan-bright/30 animate-fade-in"
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-32 right-8 z-50 w-96 h-[500px] bg-ocean-surface/95 backdrop-blur-md border-ocean-surface shadow-2xl animate-scale-in">
          <CardHeader className="bg-gradient-cyber text-ocean-deep p-4">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Dolonia Assistant</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-cyan-bright text-ocean-deep'
                        : 'bg-ocean-deep text-cyan-soft border border-ocean-surface'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      {message.sender === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      <span className="text-sm">{message.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-ocean-surface">
                <p className="text-xs text-cyan-soft/70 mb-2">Quick replies:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(reply)}
                      className="text-xs bg-transparent border-ocean-surface text-cyan-soft hover:text-cyan-bright hover:border-cyan-bright/30 transition-colors"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-ocean-surface">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-ocean-deep border-ocean-surface text-foreground placeholder-cyan-soft/50 focus:border-cyan-bright"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-cyber hover:shadow-glow text-ocean-deep transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default LiveChat;