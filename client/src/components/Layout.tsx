import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333]">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
                Heritage Tours
              </Link>
              
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/" className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-600",
                  location === "/" ? "text-gray-900" : "text-gray-500"
                )}>
                  Tour Builder
                </Link>
                
                <Link href="/timeline-tours" className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-600",
                  location === "/timeline-tours" ? "text-gray-900" : "text-gray-500"
                )}>
                  Timeline Tours
                </Link>
                
                <Link href="/historical-tours" className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-600",
                  location === "/historical-tours" ? "text-gray-900" : "text-gray-500"
                )}>
                  Historical Tours
                </Link>

                {/* Explore Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsExploreOpen(!isExploreOpen)}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-600 transition-colors"
                  >
                    Explore
                    <ChevronDown className={cn(
                      "ml-1 h-4 w-4 transition-transform",
                      isExploreOpen ? "rotate-180" : ""
                    )} />
                  </button>
                  
                  {isExploreOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                      <Link
                        href="/historical-periods"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        onClick={() => setIsExploreOpen(false)}
                      >
                        Historical Periods
                      </Link>
                      <Link
                        href="/rulers"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        onClick={() => setIsExploreOpen(false)}
                      >
                        Rulers
                      </Link>
                      <Link
                        href="/locations"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        onClick={() => setIsExploreOpen(false)}
                      >
                        Locations
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Sign In
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        {children}
      </main>
    </div>
  );
}