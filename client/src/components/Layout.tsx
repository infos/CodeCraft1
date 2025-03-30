import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333]">
      <header className="bg-[#333] text-white py-4">
        <nav className="container mx-auto px-4">
          <ul className="flex justify-center flex-wrap">
            <li className="mx-4">
              <Link href="/">
                <a className={cn(
                  "px-4 py-2 rounded-md transition-colors hover:bg-[#555]",
                  location === "/" ? "bg-[#555]" : ""
                )}>
                  Eras and Ages
                </a>
              </Link>
            </li>
            <li className="mx-4">
              <Link href="/tours">
                <a className={cn(
                  "px-4 py-2 rounded-md transition-colors hover:bg-[#555]",
                  location === "/tours" ? "bg-[#555]" : ""
                )}>
                  Tours
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}