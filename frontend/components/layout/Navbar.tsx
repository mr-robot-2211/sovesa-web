"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo & Name */}
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="Sovesa Logo" width={40} height={40} />
        <h1 className="text-xl font-bold text-gray-800">Sovesa</h1>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6">
        <li><Link href="/" className="hover:text-indigo-500">Home</Link></li>
        <li><Link href="/courses" className="hover:text-indigo-500">Courses</Link></li>
        <li><Link href="/trips" className="hover:text-indigo-500">Trips</Link></li>
        <li><Link href="/about" className="hover:text-indigo-500">About</Link></li>
      </ul>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-3 md:hidden">
          <li><Link href="/" className="hover:text-indigo-500" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link href="/courses" className="hover:text-indigo-500" onClick={() => setMenuOpen(false)}>Courses</Link></li>
          <li><Link href="/trips" className="hover:text-indigo-500" onClick={() => setMenuOpen(false)}>Trips</Link></li>
          <li><Link href="/about" className="hover:text-indigo-500" onClick={() => setMenuOpen(false)}>About</Link></li>
        </ul>
      )}
    </nav>
  );
}
