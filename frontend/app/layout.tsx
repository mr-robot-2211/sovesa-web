"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Trips", path: "/trips" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
  ];

  const renderMenuItems = (mobile: boolean = false) => (
    <>
      {menuItems.map((item) => (
        <Link href={item.path} key={item.path}>
          <motion.span
            className={`relative px-4 py-2 text-${mobile ? 'lg' : 'sm'} cursor-pointer
              ${pathname === item.path ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.name}
            {pathname === item.path && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                initial={false}
              />
            )}
          </motion.span>
        </Link>
      ))}
    </>
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <motion.header
          className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
              {/* Logo */}
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/">
                  <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent 
                    bg-gradient-to-r from-blue-600 to-purple-600">
                    Sovesa
                  </span>
                </Link>
              </motion.div>

              {/* Desktop Menu */}
              <div className="hidden sm:flex items-center space-x-4">
                {renderMenuItems()}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-full font-medium
                    hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="sm:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <motion.div
                    animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                    className="w-full h-0.5 bg-gray-600 origin-left"
                  />
                  <motion.div
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-full h-0.5 bg-gray-600"
                  />
                  <motion.div
                    animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                    className="w-full h-0.5 bg-gray-600 origin-left"
                  />
                </div>
              </motion.button>
            </div>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden bg-white border-t"
              >
                <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                  {renderMenuItems(true)}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-medium
                      hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Main Content with padding for fixed header */}
        <main className="pt-16 sm:pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
