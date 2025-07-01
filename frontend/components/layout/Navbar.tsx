"use client";

import "@/app/globals.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

const Navbar = ()=>{
  const { data: session } = useSession();
  const isLoggedIn=!!session;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Announcements", path: "/" },
    { name: "Soul Walks", path: "/trips" },
    { name: "DivyaVidya", path: "/courses" },
    { name: "Divine Bazaar", path: "/bazaar" },
  ];

  const renderMenuItems = (mobile: boolean = false) => (
    <div className={`relative flex ${mobile ? 'flex-col items-center' : 'flex-row items-center'} gap-2 md:gap-4`}>
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        const isGradient = item.name === "Soul Walks" || item.name === "DivyaVidya";
        return (
          <Link href={item.path} key={item.path} className="relative">
            <motion.span
              className={`relative flex flex-col items-center px-2 sm:px-4 py-2 text-${mobile ? 'lg' : 'sm'} cursor-pointer whitespace-nowrap
                ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'} ${isGradient ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : ''}`}
              whileHover={{ scale: 1.08, opacity: 0.85 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <span className="whitespace-nowrap">{item.name}</span>
              {isActive && !mobile && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-1 h-0.5 rounded bg-green-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.span>
          </Link>
        );
      })}
    </div>
  );

  const handleSignIn = async () => {
    try {
      console.log('Attempting to sign in with Google...');
      const result = await signIn('google', { 
        callbackUrl: window.location.href,
        redirect: true 
      });
      console.log('Sign in result:', result);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
        <motion.header
          className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-between items-center h-16 sm:h-20">
              {/* Hamburger (left, mobile only) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 md:static md:translate-y-0">
                <motion.button
                  className="md:hidden p-2"
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

              {/* Logo (center on mobile, left on desktop) */}
              <div
                className="flex-shrink-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 flex items-center justify-center"
              >
                <Link href="/home">
                  <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                    Sovesa
                  </span>
                </Link>
              </div>

              {/* Desktop Menu (centered between logo and login) */}
              <div className="hidden md:flex items-center space-x-4 mx-auto">
                {renderMenuItems()}

                {/* For condition dashboard button */}
                {isLoggedIn && isSadhaka &&
                  (<Link href="/dashboard">
                  <motion.span
                    className={`relative px-4 py-2 text-${false ? 'lg' : 'sm'} cursor-pointer
                      ${pathname === "/dashboard" ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    BhaktiMeter
                    {pathname === "/dashboard" && (
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"
                        initial={false}
                      />
                    )}
                  </motion.span>
                </Link>
                  )
                }

                {!isLoggedIn && 
                  (<Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-4 px-6 py-2 bg-green-600 text-white rounded-full font-medium
                      hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Login
                  </motion.button>
                  </Link>
                  )
                }
                {isLoggedIn && 
                  (<motion.button
                    onClick={()=>signOut({ callbackUrl: "/" })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-4 px-6 py-2 bg-green-600 text-white rounded-full font-medium
                      hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Login with Google
                  </motion.button>
                  )
                }
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t"
              >
                <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                  {renderMenuItems(true)}

                  {/* for conditional dashboard */}
                  {isLoggedIn && isSadhaka &&
                    (<Link href="/dashboard">
                    <motion.span
                      className={`relative px-4 py-2 text-${true ? 'lg' : 'sm'} cursor-pointer
                        ${pathname === "/dashboard" ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      BhaktiMeter
                      {pathname === "/dashboard" && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"
                          initial={false}
                        />
                      )}
                    </motion.span>
                  </Link>
                  )
                }

                {!isLoggedIn && (
                  <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-full font-medium
                      hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Login
                  </motion.button>
                  </Link>
                )}
                {isLoggedIn && (
                  <motion.button
                    onClick={()=>signOut({ callbackUrl: "/" })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-full font-medium
                      hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Logout
                  </motion.button>
                )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
  );
};

export default Navbar;