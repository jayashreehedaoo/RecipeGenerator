import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const baseClass = "transition-colors px-3 py-2 rounded";
    const activeClass = "bg-gray-600 text-white";
    const inactiveClass = "hover:text-gray-400";

    return `${baseClass} ${pathname === path ? activeClass : inactiveClass}`;
  };

  const navLinks = [
    { href: "/", label: "🏠 Home" },
    { href: "/inventory", label: "📦 Inventory" },
    { href: "/recipes", label: "🍽️ Recipes" },
    { href: "/shoppinglist", label: "🛒 Shopping List" },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4 shrink-0 shadow-lg">
      <ul className="flex gap-20 justify-center">
        {navLinks.map((link: { href: string; label: string }) => (
          <li key={link.href}>
            <Link href={link.href} className={getLinkClass(link.href)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
