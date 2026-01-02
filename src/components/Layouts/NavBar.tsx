'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavBar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClass = (path: string) => {
    const baseClass = "transition-colors px-3 py-2 rounded block";
    const activeClass = "bg-gray-600 text-white";
    const inactiveClass = "hover:text-gray-400";

    return `${baseClass} ${pathname === path ? activeClass : inactiveClass}`;
  };

  const navLinks = [
    { href: "/", label: "🏠 Home" },
    { href: "/inventory", label: "📦 Inventory" },
    { href: "/recipes", label: "🍽️ Recipes" },
    { href: "/shoppinglist", label: "🛒 Shopping List" },
    { href: "/preferences", label: "⚙️ Preferences" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shrink-0 shadow-lg">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex justify-between items-center">
        <span className="font-bold text-lg">🍳 Pantry Chef</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex gap-8 justify-center">
        {navLinks.map((link: { href: string; label: string }) => (
          <li key={link.href}>
            <Link href={link.href} className={getLinkClass(link.href)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-2">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link: { href: string; label: string }) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={getLinkClass(link.href)}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
