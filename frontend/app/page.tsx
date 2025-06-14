"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface Feature {
  title: ReactNode;
  description: string;
  link: string;
  image: string;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      title: "Curated Trips",
      description: "Discover handpicked destinations and expertly crafted itineraries.",
      link: "/trips",
      image: "https://drive.google.com/uc?export=view&id=1V0ZwOCNLowaRH-67b7auCl8S-8nNmkPg"
    },
    {
      title: "Expert Courses",
      description: "Learn from industry professionals and enhance your skills.",
      link: "/courses",
      image: "https://drive.google.com/uc?export=view&id=1eGZ0PnofzPf-sevyTUESzHGDIKOCiFG3"
    },
    {
      title: "Devotee Association",
      description: "Join a global community of passionate travelers and learners.",
      link: "/about",
      image: "https://drive.google.com/uc?export=view&id=1x6dtupmI2UdW1FV_RP-_rQHUOineohgf"
    }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <Image
              src="https://drive.google.com/uc?export=view&id=1N5rNJHZK_mJhBpyBLBKiBN2nNs25qcLZ"
              alt="Hero background"
              fill
              priority
              className="object-cover transition-transform duration-1000 scale-105"
            />
          </motion.div>
        </div>
        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{ y }}
          >
            Begin Your Journey
          </motion.h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover amazing destinations and learn from the best. Your adventure starts here.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Link href="/trips">
              <motion.button
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium
                  hover:bg-transparent hover:border-2 hover:border-white transition-all duration-300 shadow-lg hover:shadow-xl
                  transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Trips
              </motion.button>
            </Link>
            <Link href="/courses">
              <motion.button
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium
                  hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all duration-300 shadow-lg hover:shadow-xl
                  transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Courses
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">SOVESA</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer unique experiences and expert-led courses to help you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={feature.link}>
                  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl
                    transition-all duration-300 transform hover:-translate-y-1">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                        {feature.title.split(' ').map((word, i) => 
                          word === 'Trips' || word === 'Courses' || word === 'Association' ? (
                            <span key={i} className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                              {word}{' '}
                            </span>
                          ) : (
                            <span key={i}>{word}{' '}</span>
                          )
                        )}
                      </h3>
                      <p className="text-gray-800 mb-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                        {feature.description}
                      </p>
                      {feature.title === "Spiritual Journey" && (
                        <motion.button
                          className="px-6 py-2 bg-white text-gray-900 rounded-full font-medium
                            hover:bg-gray-100 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Know More
                        </motion.button>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Prabhupada Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative h-[700px] w-full rounded-2xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/prabhupada">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1g-wyj5fu4GE9t6mo5mx5pI8C4PtOtDI3"
                  alt="Srila Prabhupada"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl transition-transform duration-500 hover:scale-105"
                  priority
                />
              </Link>
            </motion.div>
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Srila Prabhupada's Vision
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                "The material world is a place of misery, and the spiritual world is a place of happiness. The living entity is part and parcel of the Supreme Lord, and therefore he is meant to be in the spiritual world, where there is eternal happiness."
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Through his teachings and guidance, Srila Prabhupada established a worldwide movement dedicated to spiritual enlightenment and the practice of bhakti-yoga.
              </p>
              <Link href="/prabhupada">
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium
                    hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More About Our Heritage
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/gallery">
                <div className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer">
                  <Image
                    src="https://drive.google.com/uc?export=view&id=1h5cTFq63rRMtrptxPpWKH7XPUty35geS"
                    alt="Spiritual Gathering"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Link>
              <Link href="/gallery">
                <div className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer">
                  <Image
                    src="https://drive.google.com/uc?export=view&id=1CeCcEI1Avgrsl3gqT4jVL9gXlsphFFex"
                    alt="Meditation"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Link>
              <Link href="/gallery">
                <div className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer">
                  <Image
                    src="https://drive.google.com/uc?export=view&id=1noVzgop2JkG5x_2r-Vk7S88johb1Epjl"
                    alt="Devotee Association"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Link>
              <Link href="/gallery">
                <div className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer">
                  <Image
                    src="https://drive.google.com/uc?export=view&id=1lr9GJ9b1F-Ngl5roTDw7eWmcAxHyL8EE"
                    alt="Spiritual Practice"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Link>
            </motion.div>
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Our Spiritual Gallery
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                "Through these captured moments, we share the beauty of our spiritual journey, the joy of community gatherings, and the peace found in meditation and devotion."
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Each image tells a story of transformation, connection, and the eternal quest for spiritual enlightenment. Join us in preserving these precious memories of our shared spiritual path.
              </p>
              <Link href="/gallery">
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium
                    hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Full Gallery
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers and learners in their journey of discovery.
            </p>
            <motion.button
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium
                hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
