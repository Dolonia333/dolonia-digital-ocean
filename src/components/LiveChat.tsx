import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Volume2,
  VolumeX,
  Clock,
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
}

interface ConversationContext {
  topic?: string;
  userInfo?: {
    name?: string;
    email?: string;
    company?: string;
  };
  lastService?: string;
  conversationStage?:
    | "greeting"
    | "discovery"
    | "inquiry"
    | "qualification"
    | "proposal"
    | "closing";
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(2);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages from localStorage or use default
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("dolonia-chat-messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[];
        return parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } catch (e) {
        console.warn("Failed to load chat history:", e);
      }
    }
    return [
      {
        id: 1,
        text: "👋 Hi! I'm your Dolonia assistant. I can help you with:\n\n• 🌐 Website development & design\n• 🤖 AI automation solutions\n• 🔒 Cybersecurity services\n• 💰 Pricing information\n• 📅 Consultation scheduling\n\nWhat brings you here today?",
        sender: "bot" as const,
        timestamp: new Date(),
        status: "read" as const,
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [conversationContext, setConversationContext] =
    useState<ConversationContext>({
      conversationStage: "greeting",
    });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dolonia-chat-messages", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll detection for chat button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight * 0.5; // Show after scrolling 50% of viewport height

      setIsVisible(scrollPosition > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    if (soundEnabled) {
      // Create a subtle notification sound
      const audioContext = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const quickReplies = [
    "Website development",
    "AI automation",
    "Security services",
    "Pricing information",
    "Schedule consultation",
    "Contact information",
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputMessage;
    if (!messageText.trim() || isTyping) return;

    const userMessage: Message = {
      id: messageIdCounter,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setMessageIdCounter((prev) => prev + 1);

    // Update status to sent after a brief delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" as const } : msg
        )
      );
    }, 500);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messageIdCounter + 1,
        text: getBotResponse(messageText),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
      setMessageIdCounter((prev) => prev + 2);

      // Play notification sound for bot response
      playNotificationSound();

      // Mark user message as read after bot responds
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, status: "read" as const }
              : msg
          )
        );
      }, 1000);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Update conversation context based on user input
    setConversationContext((prev) => {
      const newContext = { ...prev };

      // Detect conversation topics
      if (
        lowerMessage.includes("website") ||
        lowerMessage.includes("web") ||
        lowerMessage.includes("design")
      ) {
        newContext.topic = "website";
        newContext.conversationStage = "inquiry";
      } else if (
        lowerMessage.includes("ai") ||
        lowerMessage.includes("automation") ||
        lowerMessage.includes("bot")
      ) {
        newContext.topic = "ai";
        newContext.conversationStage = "inquiry";
      } else if (
        lowerMessage.includes("security") ||
        lowerMessage.includes("cyber") ||
        lowerMessage.includes("protect")
      ) {
        newContext.topic = "security";
        newContext.conversationStage = "inquiry";
      } else if (
        lowerMessage.includes("price") ||
        lowerMessage.includes("cost") ||
        lowerMessage.includes("pricing")
      ) {
        newContext.topic = "pricing";
        newContext.conversationStage = "inquiry";
      } else if (
        lowerMessage.includes("consult") ||
        lowerMessage.includes("meeting") ||
        lowerMessage.includes("schedule")
      ) {
        newContext.topic = "consultation";
        newContext.conversationStage = "inquiry";
      } else if (
        lowerMessage.includes("hello") ||
        lowerMessage.includes("hi") ||
        lowerMessage.includes("hey")
      ) {
        newContext.conversationStage = "greeting";
      }

      return newContext;
    });

    // Generate contextual responses
    if (conversationContext.topic === "website") {
      if (lowerMessage.includes("cost") || lowerMessage.includes("price")) {
        return "💰 For website development, our pricing starts at $2,500 for a basic business website, $5,000-$8,000 for e-commerce sites, and $10,000+ for custom web applications. The exact cost depends on your specific requirements, design complexity, and features needed.\n\nWould you like me to help you outline your project requirements for a more accurate quote?";
      } else if (
        lowerMessage.includes("time") ||
        lowerMessage.includes("how long")
      ) {
        return "⏱️ Our typical website development timeline is:\n\n• Basic websites: 2-4 weeks\n• E-commerce sites: 4-8 weeks\n• Custom applications: 8-16 weeks\n\nThis includes design, development, testing, and deployment. We can often expedite projects for urgent needs.\n\nWhat's your timeline preference?";
      } else {
        return "🌐 I'd love to help you with your website project! We specialize in:\n\n• Modern, responsive web design\n• E-commerce platforms\n• Custom web applications\n• SEO optimization\n• Performance optimization\n\nCould you tell me more about what you're looking for? For example:\n- What type of website do you need?\n- Do you have existing branding?\n- What's your target audience?\n- Any specific features required?";
      }
    }

    if (conversationContext.topic === "ai") {
      if (lowerMessage.includes("cost") || lowerMessage.includes("price")) {
        return "🤖 AI automation pricing varies based on complexity:\n\n• Simple chatbots/workflows: $1,000-$3,000\n• Advanced AI integrations: $5,000-$15,000\n• Custom AI solutions: $15,000+\n\nWe offer both one-time development and subscription-based maintenance plans.\n\nWhat type of AI automation are you interested in?";
      } else {
        return "🚀 We can help automate your business processes with AI! Our services include:\n\n• Intelligent chatbots & virtual assistants\n• Document processing & analysis\n• Workflow automation\n• Predictive analytics\n• Custom AI model development\n\nWhat business processes would you like to automate?";
      }
    }

    if (conversationContext.topic === "security") {
      return "🔒 Cybersecurity is crucial for modern businesses. We provide:\n\n• Security audits & assessments\n• Penetration testing\n• Compliance consulting (GDPR, HIPAA, etc.)\n• Security training\n• Incident response planning\n• Secure infrastructure setup\n\nWhat security concerns are you facing?";
    }

    if (conversationContext.topic === "pricing") {
      return "💰 Our pricing is designed to be transparent and competitive:\n\n• Website Development: $2,500 - $25,000+\n• AI Automation: $1,000 - $50,000+\n• Cybersecurity Services: $500 - $10,000+\n• Consulting: $150/hour\n\nAll projects include:\n✅ Free initial consultation\n✅ Detailed project proposal\n✅ Transparent pricing\n✅ Ongoing support\n\nWould you like a personalized quote for your specific needs?";
    }

    if (conversationContext.topic === "consultation") {
      return "📅 I'd be happy to schedule a consultation! Here's how it works:\n\n1. Free 30-minute discovery call\n2. We'll discuss your goals and challenges\n3. I'll provide initial recommendations\n4. If interested, we'll create a detailed proposal\n\nWhat's the best time for you this week? We have availability Monday-Friday, 9 AM - 6 PM EST.";
    }

    // Default responses based on conversation stage
    if (conversationContext.conversationStage === "greeting") {
      return "👋 Great! I'm here to help you with:\n\n🌐 **Website Development** - Modern, responsive websites\n🤖 **AI Automation** - Streamline your business processes\n🔒 **Cybersecurity** - Protect your digital assets\n💰 **Pricing Information** - Transparent, competitive rates\n📅 **Consultation** - Free discovery calls\n\nWhat would you like to know more about?";
    }

    // Fallback responses
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("what can you do")
    ) {
      return "🤝 I'm here to help with:\n\n• 🌐 Website design and development\n• 🤖 AI automation solutions\n• 🔒 Cybersecurity consulting\n• 💰 Pricing and project estimates\n• 📅 Scheduling consultations\n• 📧 General inquiries\n\nWhat specific service interests you most?";
    }

    if (
      lowerMessage.includes("contact") ||
      lowerMessage.includes("email") ||
      lowerMessage.includes("phone")
    ) {
      return "📞 You can reach us through:\n\n• 📧 Email: hello@dolonia.com\n• 📱 Phone: (555) 123-DOLO\n• 💬 This chat (available 24/7)\n• 📅 Schedule a call: Available Mon-Fri 9AM-6PM EST\n\nWhat's the best way to connect with you?";
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "🙏 You're welcome! I'm glad I could help. Feel free to ask if you have any other questions about our services. Have a great day! 🌟";
    }

    // Generic helpful response
    return "💡 That's interesting! I'd love to help you with that. Could you tell me more about what you're looking for? For example:\n\n• What specific service interests you?\n• What's your timeline?\n• Do you have a budget in mind?\n• Any particular challenges you're facing?\n\nThis will help me provide more targeted assistance!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
          {isOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <MessageCircle className="w-8 h-8" />
          )}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-32 right-4 z-50 w-96 max-w-[calc(100vw-1rem)] h-[500px] max-h-[70vh] bg-ocean-surface/95 backdrop-blur-md border-ocean-surface shadow-2xl animate-scale-in">
          <CardHeader className="bg-gradient-cyber text-ocean-deep p-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <Bot className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Dolonia Assistant</span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  size="sm"
                  variant="ghost"
                  className="text-ocean-deep hover:bg-ocean-deep/20 h-7 w-7 p-0"
                  title={
                    soundEnabled
                      ? "Disable sound notifications"
                      : "Enable sound notifications"
                  }
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  variant="ghost"
                  className="text-ocean-deep hover:bg-ocean-deep/20 h-7 w-7 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-cyan-bright text-ocean-deep"
                        : "bg-ocean-deep text-cyan-soft border border-ocean-surface"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "bot" && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === "user" && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm block">{message.text}</span>
                        <div
                          className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                            message.sender === "user"
                              ? "text-ocean-deep/70"
                              : "text-cyan-soft/50"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {message.sender === "user" && message.status && (
                            <span className="ml-1">
                              {message.status === "sending" && "⏳"}
                              {message.status === "sent" && "✓"}
                              {message.status === "delivered" && "✓✓"}
                              {message.status === "read" && "✓✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-ocean-deep text-cyan-soft border border-ocean-surface p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 flex-shrink-0" />
                      <div className="flex items-center space-x-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
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
                      disabled={isTyping}
                      className="text-xs bg-transparent border-ocean-surface text-cyan-soft hover:text-cyan-bright hover:border-cyan-bright/30 transition-colors disabled:opacity-50"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-ocean-surface">
              <div className="flex space-x-2 items-end">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isTyping}
                  className="flex-1 bg-ocean-deep border-ocean-surface text-foreground placeholder-cyan-soft/50 focus:border-cyan-bright disabled:opacity-50"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-cyber hover:shadow-glow text-ocean-deep transition-all duration-300 disabled:opacity-50 flex-shrink-0 h-10 w-10 p-0"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
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
