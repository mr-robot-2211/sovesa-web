"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

export default function About() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const containerRef = useRef<HTMLDivElement>(null);
  const joinUsRef = useRef<HTMLDivElement>(null);
  const whatWeDoRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const sections = [
    {
      title: "Workshops",
      content: "We conduct regular interactive workshops on mantra meditation, chanting, and mindful living. These sessions are designed to help students develop practical tools for inner peace, self-discipline, and mental clarity in their day-to-day lives.",
      color: "from-blue-900 to-blue-800",
      image: "https://drive.google.com/file/d/1EWMsG_dr0t7dbWGQavg6pLT_9mPAW3gr/view?usp=drive_link"
    },
    {
      title: "Events",
      content: "The club organizes vibrant cultural celebrations, spiritual discourses, and community gatherings that bring people together to experience a sense of connection, joy, and higher purpose beyond academics.",
      color: "from-blue-800 to-blue-700",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
    },
    {
      title: "Teachings",
      content: "Through focused study sessions, members explore timeless philosophical texts like the Bhagavad Gītā and other Vedic scriptures. These discussions offer deep insights into ancient wisdom and how it can be applied to modern student life for personal and ethical growth.",
      color: "from-blue-700 to-blue-600",
      image: "https://drive.google.com/file/d/1D4zhahE_ScJQ2GtuiiDb-K-N5LPrSPYh/view?usp=drive_link"
    },
    {
      title: "Leadership",
      content: "Members are encouraged to take initiative, organize activities, and mentor peers — developing essential leadership qualities such as compassion, humility, teamwork, and responsibility, all grounded in a values-driven lifestyle.",
      color: "from-blue-600 to-blue-500",
      image: "https://drive.google.com/file/d/1puiWvuYO4vx0XcjZnn_4AMfSjU-QL3nd/view?usp=drive_link"
    }
  ];

  const team = [
    {
      name: "Aditya Choudhary",
      role: "President",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      quote: "Leading the spiritual reawakening movement at BITS Pilani"
    },
    {
      name: "Faculty Mentor",
      role: "Spiritual Guide",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      quote: "Providing wisdom and guidance in Vedic studies"
    },
    {
      name: "Vice President",
      role: "Event Coordinator",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      quote: "Organizing transformative spiritual events and workshops"
    },
    {
      name: "Secretary",
      role: "Content & Outreach",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
      quote: "Managing communications and community engagement"
    },
    {
      name: "Treasurer",
      role: "Resource Management",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      quote: "Ensuring sustainable growth and resource allocation"
    },
    {
      name: "Core Team",
      role: "Event Organizers",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
      quote: "Dedicated volunteers making our vision a reality"
    }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-y-auto">
      <style jsx global>{`
        html, body {
          height: 100%;
          overflow-y: auto;
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden snap-start">
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://drive.google.com/file/d/1Yt7aJ6OpqU9x9K4NQb3YyLPLWqKt7MZl/preview?autoplay=1&loop=1&playlist=1Yt7aJ6OpqU9x9K4NQb3YyLPLWqKt7MZl&mute=1"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ pointerEvents: 'none' }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
  className="text-6xl sm:text-8xl md:text-9xl font-bold text-white mb-8 font-funnel-display"
  style={{
    y,
    textShadow: "4px 4px 40px rgba(0, 0, 0, 0.7)"
  }}
>
  SOVESA
</motion.h1>

<motion.p
  className="text-2xl sm:text-3xl text-gray-200 max-w-3xl mx-auto mb-12"
  style={{
    opacity,
    textShadow: "2px 2px 10px rgba(0, 0, 0, 0.7)"
  }}
>
  BITS Pilani's Spirituality Club
</motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="px-12 py-5 bg-white text-blue-900 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(joinUsRef)}
            >
              Join Our Journey
            </motion.button>
            <motion.button
              className="px-12 py-5 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg shadow-lg hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(whatWeDoRef)}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* What We Do Section */}
      <div ref={whatWeDoRef} className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.h2
            className="text-5xl sm:text-6xl font-bold text-white text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Do
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-[400px] rounded-3xl overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-3xl font-bold text-white mb-4">{section.title}</h3>
                    <p className="text-blue-100 text-lg">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quotes Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-white text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Voices from Our Community
          </motion.h2>

          <div className="space-y-16">
            {[
              {
                quote: "Joining this community has been transformative. The workshops and teachings have helped me find inner peace and purpose in my academic journey.",
                author: "Tushar Gurung",
                role: "Club President",
                image: "",
                imagePosition: "left"
              },
              {
                quote: "The spiritual discussions and cultural events have created a space where I can explore my identity and connect with like-minded individuals.",
                author: "Other",
                role: "none",
                image: "",
                imagePosition: "right"
              }
            ].map((quote, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row items-center gap-8 bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                {quote.imagePosition === 'left' && (
                  <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                    <Image
                      src={quote.image}
                      alt={quote.author}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl text-white mb-4">
                    "{quote.quote}"
                  </blockquote>
                  <div className="text-blue-300 font-semibold">
                    {quote.author}
                  </div>
                  <div className="text-gray-400">
                    {quote.role}
                  </div>
                </div>
                {quote.imagePosition === 'right' && (
                  <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                    <Image
                      src={quote.image}
                      alt={quote.author}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={joinUsRef} className="relative py-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60" />
          <Image
            src="https://images.unsplash.com/photo-1528164344705-47542687000d"
            alt="Spiritual Community"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Join Us on This Transcendental Journey!
          </motion.h2>
          <motion.p
            className="text-lg text-indigo-400 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Align with kindred souls, awaken higher truths, and walk the path of inner light.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 px-4 sm:px-0">
            <motion.a
              href="#"
              className="flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-12 sm:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                setModalContent({
                  title: 'WhatsApp',
                  message: 'Join our WhatsApp group to connect with fellow seekers and stay updated with our activities.'
                });
                setIsModalOpen(true);
              }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </motion.a>

            <motion.a
              href="#"
              className="flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-12 sm:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                setModalContent({
                  title: 'Instagram',
                  message: 'Follow us on Instagram to see our spiritual journey through photos and stories.'
                });
                setIsModalOpen(true);
              }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </motion.a>

            <motion.a
              href="#"
              className="flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-12 sm:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                setModalContent({
                  title: 'Gmail',
                  message: 'Send us an email to get more information about our spiritual activities and events.'
                });
                setIsModalOpen(true);
              }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
              </svg>
              Gmail
            </motion.a>

            <motion.a
              href="#"
              className="flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-12 sm:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                setModalContent({
                  title: 'Phone',
                  message: 'Call us to speak directly with our team members about joining our spiritual community.'
                });
                setIsModalOpen(true);
              }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2c0-4.9-4-8.9-9-8.9v2c3.9 0 7 3.1 7 6.9zm-4 0h2c0-2.8-2.2-5-5-5v2c1.7 0 3 1.3 3 3z"/>
              </svg>
              Phone
            </motion.a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{modalContent.title}</h3>
            <p className="text-gray-600 mb-6">{modalContent.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}