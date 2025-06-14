"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Gallery() {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});

  const images = [
    {
      src: "https://lh3.googleusercontent.com/d/1MBV-HDs64wbNotiLFdUXWPK34IINWSxY",
      alt: "Gallery Image 1"
    },
    {
      src: "https://lh3.googleusercontent.com/d/1fJt2gFMddAb74rndTE3Wu4CX19YM95-V",
      alt: "Gallery Image 2"
    },
    {
      src: "https://lh3.googleusercontent.com/d/1jCrYU3YrYgqTV5Um9gWUNTufHjwOc2R_",
      alt: "Gallery Image 3"
    },
    {
      src: "https://lh3.googleusercontent.com/d/1gLLqhMVx4lfi2fHo4UvfYasqOgsR6n6a",
      alt: "Gallery Image 4"
    },
    {
      src: "https://lh3.googleusercontent.com/d/1IogjR3sP_LbsVEuo2CEBQ_9Ez8ms-ZnL",
      alt: "Gallery Image 5"
    },
    {
      src: "https://lh3.googleusercontent.com/d/1h_5gWcQjroNETZhj9VaLLknSvVeyTj_1",
      alt: "Gallery Image 6"
    },
    {
      src: "https://lh3.googleusercontent.com/d/1r0F2-QFBnormVXJJDKkqRKACb9E9GEV5",
      alt: "Gallery Image 7"
    },
    {
      src: "https://lh3.googleusercontent.com/d/1_lThiA7PDmdlpwwOssmVaCVKEhIMJ5Ij",
      alt: "Gallery Image 8"
    }
  ];

  const handleImageError = (index: number) => {
    setImageError(prev => ({...prev, [index]: true}));
    setImageLoading(prev => ({...prev, [index]: false}));
  };

  const handleImageLoad = (index: number) => {
    setImageLoading(prev => ({...prev, [index]: false}));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative h-[40vh] bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Our Gallery
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Capturing moments of spiritual journey and community
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group bg-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {imageLoading[index] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}
              
              {!imageError[index] ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                  unoptimized
                  priority={index < 4}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Image not available</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <Link href="/">
          <motion.button
            className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium
              hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </Link>
      </div>
    </div>
  );
} 