import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest updates and insights.",
      });
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-ocean-deep">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-ocean-surface/50 backdrop-blur-sm border border-ocean-surface rounded-2xl p-8 md:p-12 cyber-glow">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-cyber rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-ocean-deep" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Stay in the Loop
              </span>
            </h2>
            
            <p className="text-xl text-cyan-soft mb-8 max-w-2xl mx-auto">
              Get the latest insights on cloud infrastructure, security updates, and industry trends delivered to your inbox.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-ocean-surface border-ocean-surface text-foreground placeholder-cyan-soft/50 focus:border-cyan-bright transition-colors"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold px-8 transition-all duration-300"
                >
                  Subscribe
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-cyan-bright">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-medium">Thank you for subscribing!</span>
              </div>
            )}

            <p className="text-sm text-cyan-soft/70 mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;