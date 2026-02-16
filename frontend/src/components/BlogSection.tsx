import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      title: "The Future of Zero-Trust Architecture",
      excerpt: "Explore how zero-trust security models are reshaping enterprise infrastructure and protecting against evolving threats.",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Security",
      image: "🛡️"
    },
    {
      title: "AI-Driven Cloud Optimization Strategies",
      excerpt: "Learn how artificial intelligence is revolutionizing cloud resource management and cost optimization.",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "AI & Cloud",
      image: "🤖"
    },
    {
      title: "Multi-Cloud Migration Best Practices",
      excerpt: "A comprehensive guide to successfully migrating your infrastructure across multiple cloud providers.",
      date: "2024-01-05",
      readTime: "10 min read",
      category: "Migration",
      image: "☁️"
    }
  ];

  return (
    <section className="py-20 bg-gradient-ocean">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Latest Insights
            </span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            Stay ahead with expert insights on cloud infrastructure, security, and digital transformation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card 
              key={index} 
              className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface hover:border-cyan-bright/30 transition-all duration-300 hover:scale-105 hover:shadow-glow group cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="text-6xl mb-4 text-center">{post.image}</div>
                <div className="flex items-center justify-between text-sm text-cyan-soft/70 mb-2">
                  <span className="bg-cyan-bright/20 text-cyan-bright px-2 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-cyan-bright transition-colors">
                  {post.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-soft leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-cyan-soft/70">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-bright group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            className="bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep cyber-glow transition-all duration-300"
          >
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;