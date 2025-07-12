import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333]">
      <main>
        {children}
      </main>
    </div>
  );
}