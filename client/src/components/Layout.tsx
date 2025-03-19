import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Imperial Tours</h1>
            <div className="space-x-6">
              <Link href="/">
                <a className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === "/" ? "text-primary" : "text-muted-foreground"
                )}>
                  Timeline
                </a>
              </Link>
              <Link href="/tours">
                <a className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === "/tours" ? "text-primary" : "text-muted-foreground"
                )}>
                  Tours
                </a>
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
