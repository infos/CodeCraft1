import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333]">
      <header className="bg-[#333] text-white py-4">
        <nav className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Historical Tourism</h1>
          </div>
        </nav>
      </header>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}