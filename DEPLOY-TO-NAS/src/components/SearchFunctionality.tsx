import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  X,
  FileText,
  Users,
  Settings,
  Shield,
  Cloud,
  Zap,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

const SearchFunctionality: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchData: SearchResult[] = useMemo(
    () => [
      {
        id: "1",
        title: "Real-Time Performance Dashboard",
        description:
          "Monitor system metrics with live CPU, memory, and network analytics",
        category: "Dashboard",
        icon: Zap,
        url: "/#performance",
      },
      {
        id: "2",
        title: "Cloud Infrastructure Setup",
        description:
          "Learn how to set up scalable cloud infrastructure with Dolonia",
        category: "Documentation",
        icon: Cloud,
        url: "/docs/infrastructure",
      },
      {
        id: "3",
        title: "Zero-Trust Security",
        description:
          "Implement enterprise-grade security with zero-trust architecture",
        category: "Security",
        icon: Shield,
        url: "/security",
      },
      {
        id: "4",
        title: "AI Optimization Features",
        description:
          "Discover how AI can optimize your cloud performance and costs",
        category: "Features",
        icon: Zap,
        url: "/features/ai",
      },
      {
        id: "5",
        title: "Contact Support Team",
        description: "Get help from our expert support engineers",
        category: "Support",
        icon: Users,
        url: "/contact",
      },
      {
        id: "6",
        title: "Pricing Plans",
        description:
          "View our flexible pricing options for every business size",
        category: "Pricing",
        icon: Settings,
        url: "/pricing",
      },
      {
        id: "7",
        title: "Migration Guide",
        description:
          "Step-by-step guide for migrating your existing infrastructure",
        category: "Documentation",
        icon: FileText,
        url: "/docs/migration",
      },
      {
        id: "8",
        title: "Performance Monitoring",
        description:
          "Real-time monitoring and analytics for your cloud resources",
        category: "Features",
        icon: Zap,
        url: "/features/monitoring",
      },
      {
        id: "9",
        title: "Multi-Cloud Solutions",
        description: "Deploy across multiple cloud providers seamlessly",
        category: "Solutions",
        icon: Cloud,
        url: "/solutions",
      },
    ],
    []
  );

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(-1);
    } else {
      setResults([]);
    }
  }, [query, searchData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        handleResultClick(results[selectedIndex]);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [results, selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the selected result
    window.location.href = result.url;
    setIsOpen(false);
    setQuery("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Dashboard":
        return "text-cyan-bright bg-cyan-bright/20";
      case "Documentation":
        return "text-blue-400 bg-blue-400/20";
      case "Security":
        return "text-red-400 bg-red-400/20";
      case "Features":
        return "text-green-400 bg-green-400/20";
      case "Support":
        return "text-purple-400 bg-purple-400/20";
      case "Pricing":
        return "text-yellow-400 bg-yellow-400/20";
      case "Solutions":
        return "text-cyan-400 bg-cyan-400/20";
      default:
        return "text-cyan-soft bg-cyan-soft/20";
    }
  };

  return (
    <>
      {/* Search Trigger */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="bg-ocean-surface/90 backdrop-blur-sm border-ocean-surface text-cyan-soft hover:text-cyan-bright hover:border-cyan-bright/30 transition-all duration-300 shadow-lg"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
          <kbd className="ml-2 px-2 py-1 text-xs bg-ocean-deep rounded border border-ocean-surface">
            ⌘K
          </kbd>
        </Button>
      </div>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-ocean-deep/80 backdrop-blur-sm flex items-start justify-center pt-16">
          <Card className="w-full max-w-2xl mx-6 bg-ocean-surface/95 backdrop-blur-md border-ocean-surface shadow-2xl animate-scale-in">
            <CardContent className="p-0">
              {/* Search Input */}
              <div className="flex items-center p-4 border-b border-ocean-surface">
                <Search className="w-5 h-5 text-cyan-soft mr-3" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documentation, features, support..."
                  className="flex-1 bg-transparent border-none text-foreground placeholder-cyan-soft/50 focus:ring-0 text-lg"
                  autoFocus
                />
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-cyan-soft hover:text-cyan-bright"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Results */}
              {query && (
                <div className="max-h-96 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => {
                        const IconComponent = result.icon;
                        return (
                          <div
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              index === selectedIndex
                                ? "bg-cyan-bright/20 border border-cyan-bright/30"
                                : "hover:bg-ocean-deep/50"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <IconComponent className="w-5 h-5 text-cyan-bright" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-foreground font-medium truncate">
                                {result.title}
                              </h3>
                              <p className="text-cyan-soft text-sm truncate">
                                {result.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                                  result.category
                                )}`}
                              >
                                {result.category}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search className="w-12 h-12 text-cyan-soft/50 mx-auto mb-4" />
                      <p className="text-cyan-soft">
                        No results found for "{query}"
                      </p>
                      <p className="text-cyan-soft/70 text-sm mt-2">
                        Try searching for documentation, features, or support
                        topics
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              {!query && (
                <div className="p-4">
                  <p className="text-cyan-soft/70 text-sm mb-3">
                    Quick actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuery("security")}
                      className="justify-start text-cyan-soft hover:text-cyan-bright hover:bg-ocean-deep/50"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Security Features
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuery("pricing")}
                      className="justify-start text-cyan-soft hover:text-cyan-bright hover:bg-ocean-deep/50"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Pricing Plans
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuery("migration")}
                      className="justify-start text-cyan-soft hover:text-cyan-bright hover:bg-ocean-deep/50"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Migration Guide
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuery("support")}
                      className="justify-start text-cyan-soft hover:text-cyan-bright hover:bg-ocean-deep/50"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-ocean-surface p-3 flex items-center justify-between text-xs text-cyan-soft/70">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-ocean-deep rounded mr-1">
                      ↑↓
                    </kbd>
                    Navigate
                  </span>
                  <span className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-ocean-deep rounded mr-1">
                      ↵
                    </kbd>
                    Select
                  </span>
                  <span className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-ocean-deep rounded mr-1">
                      esc
                    </kbd>
                    Close
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default SearchFunctionality;
