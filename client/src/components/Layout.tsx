import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

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
                
                <Link href="/eras" className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-600",
                  location === "/eras" ? "text-gray-900" : "text-gray-500"
                )}>
                  Eras & Emperors
                </Link>
                
                <Link href="/emperors" className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-600",
                  location === "/emperors" ? "text-gray-900" : "text-gray-500"
                )}>
                  Emperors
                </Link>
                
                <Link href="/timeline" className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-600",
                  location === "/timeline" ? "text-gray-900" : "text-gray-500"
                )}>
                  Timeline
                </Link>
                
                <Link href="/tours" className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-600",
                  location === "/tours" ? "text-gray-900" : "text-gray-500"
                )}>
                  All Tours
                </Link>
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