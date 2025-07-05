"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface Feature {
  title: string;
  description: string;
  link: string;
  image: string;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features: Feature[] = [
    {
      title: "Soul Walks",
      description: "Discover handpicked destinations and expertly crafted itineraries.",
      link: "/trips",
      image: "https://drive.google.com/uc?export=view&id=1V0ZwOCNLowaRH-67b7auCl8S-8nNmkPg"
    },
    {
      title: "Divya Vidya",
      description: "Learn from industry professionals and enhance your skills.",
      link: "/courses",
      image: "https://drive.google.com/uc?export=view&id=1eGZ0PnofzPf-sevyTUESzHGDIKOCiFG3"
    }
  ];

  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const userEmail = session?.user?.email || "";
  const [userPhone, setUserPhone] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'options' | 'form'>('options');
  const [form, setForm] = useState({
    name: '',
    email: userEmail,
    phone: userPhone,
    skill: "",
    description: "",
  });

  const skills = [
    "Photography",
    "Music",
    "Design",
    "Writing",
    "Social Media",
    "Other",
  ];

  const handleSignUpClick = () => {
    setForm(f => ({
      ...f,
      name: session?.user?.name || '',
      email: userEmail,
      phone: userPhone
    }));
    setModalStep('options');
    setShowModal(true);
  };

  const handleOptionClick = (option: string) => {
    if (option === 'whatsapp') {
      window.open('https://wa.me/919999999999', '_blank');
      setShowModal(false);
    } else if (option === 'email') {
      setModalStep('form');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Add toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastBarWidth, setToastBarWidth] = useState(100);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false); // Close modal immediately
    let toastMsg = '';
    let toastType: 'success' | 'error' = 'success';
    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          skill: form.skill,
          description: form.description,
        }),
      });
      if (response.ok) {
        toastMsg = 'Volunteer form sent!';
        toastType = 'success';
      } else {
        let errorMsg = 'Unknown error';
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch {
          try {
            errorMsg = await response.text();
          } catch {}
        }
        toastMsg = 'Failed to send: ' + errorMsg;
        toastType = 'error';
        console.error('Failed to submit volunteer form', errorMsg);
      }
    } catch (error) {
      toastMsg = 'An error occurred while submitting the form.';
      toastType = 'error';
      console.error('An error occurred:', error);
    }
    setToast({ message: toastMsg, type: toastType });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  // Testimonials data
  const testimonials = [
    {
      quote: "Volunteering here has been a life-changing experience. The community is so welcoming and the events are truly inspiring!",
      name: "Aditi Sharma",
      role: "Photographer",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "I found a sense of purpose and belonging. The skills I've learned and the friends I've made are priceless.",
      name: "Rahul Verma",
      role: "Musician",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "The workshops and trips are so well organized. I always feel uplifted and motivated after every event.",
      name: "Priya Nair",
      role: "Event Volunteer",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-change testimonials every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Add refs and inView for both hero images
  const heroImgRef1 = useRef(null);
  const heroImgInView1 = useInView(heroImgRef1, { once: false, amount: 0.3 });
  const heroImgRef2 = useRef(null);
  const heroImgInView2 = useInView(heroImgRef2, { once: false, amount: 0.3 });

  // Gallery images for carousels
  const soulWalksImages = [
    {
      src: "https://drive.google.com/uc?export=view&id=1h5cTFq63rRMtrptxPpWKH7XPUty35geS",
      alt: "Spiritual Gathering"
    },
    {
      src: "https://drive.google.com/uc?export=view&id=1CeCcEI1Avgrsl3gqT4jVL9gXlsphFFex",
      alt: "Meditation"
    },
    {
      src: "https://drive.google.com/uc?export=view&id=1noVzgop2JkG5x_2r-Vk7S88johb1Epjl",
      alt: "Devotee Association"
    }
  ];
  const divyaVidyaImages = [
    {
      src: "https://drive.google.com/uc?export=view&id=1lr9GJ9b1F-Ngl5roTDw7eWmcAxHyL8EE",
      alt: "Spiritual Practice"
    },
    {
      src: "https://drive.google.com/uc?export=view&id=1V0ZwOCNLowaRH-67b7auCl8S-8nNmkPg",
      alt: "Soul Walks Landscape"
    },
    {
      src: "https://drive.google.com/uc?export=view&id=1eGZ0PnofzPf-sevyTUESzHGDIKOCiFG3",
      alt: "Divya Vidya Landscape"
    }
  ];

  // Add carousel state
  const [soulWalksIndex, setSoulWalksIndex] = useState(0);
  const [divyaVidyaIndex, setDivyaVidyaIndex] = useState(0);

  // Auto-advance carousels
  useEffect(() => {
    const soulWalksInterval = setInterval(() => {
      setSoulWalksIndex((prev) => (prev + 1) % soulWalksImages.length);
    }, 3000);
    return () => clearInterval(soulWalksInterval);
  }, [soulWalksImages.length]);

  useEffect(() => {
    const divyaVidyaInterval = setInterval(() => {
      setDivyaVidyaIndex((prev) => (prev + 1) % divyaVidyaImages.length);
    }, 3000);
    return () => clearInterval(divyaVidyaInterval);
  }, [divyaVidyaImages.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (toastVisible) {
      setToastBarWidth(100);
      const duration = 3200;
      const steps = 32;
      let current = 100;
      interval = setInterval(() => {
        current -= 100 / steps;
        setToastBarWidth(Math.max(current, 0));
      }, duration / steps);
      setTimeout(() => setToastVisible(false), duration + 200);
    }
    return () => interval && clearInterval(interval);
  }, [toastVisible]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-black flex items-center pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-y-12 gap-x-8 items-center text-center lg:text-left">
            {/* Text, details, and buttons column */}
            <div className="flex flex-col w-full lg:col-span-1">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 lg:mb-8 leading-tight"
                style={{ y }}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  The Inner Algorithm
                </span>
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 lg:mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                AI is brilliant. But what about the intelligence within?
                <br className="hidden sm:block" />
                What if your thoughts, actions and destiny are governed by an Inner Algorithm, invisible yet precise?
                <br className="hidden sm:block" />
                Every algorithm has its architect. Who shaped yours?
              </motion.p>
              <motion.p
                className="text-sm sm:text-base lg:text-lg text-gray-400 mb-6 lg:mb-8 italic"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                This is not your typical summer program!
                <br className="hidden sm:block" />
                This is an invitation for those who feel there's more to life than just data, degrees, and deadlines.
              </motion.p>
              {/* Details and Buttons (always column) */}
              <div className="flex flex-col gap-4 w-full items-center justify-center space-y-4">
                <motion.div
                  className="bg-gray-900/50 p-4 sm:p-6 rounded-xl max-w-md w-full mb-4"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 justify-center lg:justify-start text-center">
                      <span className="text-blue-500 text-lg sm:text-xl">📅</span>
                      <span className="text-gray-300 text-xs sm:text-sm">21 Days</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 justify-center lg:justify-start text-center">
                      <span className="text-blue-500 text-lg sm:text-xl">🌐</span>
                      <span className="text-gray-300 text-xs sm:text-sm">Online</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 justify-center lg:justify-start text-center">
                      <span className="text-blue-500 text-lg sm:text-xl">⬆️</span>
                      <span className="text-gray-300 text-xs sm:text-sm">Upgrade</span>
                    </div>
                  </div>
                </motion.div>
                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col lg:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Link href="/courses">
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 text-white rounded-full font-medium
                        hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl
                        transform hover:scale-105 text-lg flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span role="img" aria-label="video">🎥</span>
                      Join Now
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
            {/* Image column (first hero) */}
            <motion.div
              ref={heroImgRef1}
              className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] w-full p-4 md:p-0 mx-auto"
              style={{ margin: '40px auto' }}
              initial={{ opacity: 0, x: -40 }}
              animate={heroImgInView1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://drive.google.com/uc?export=view&id=1N-ox_Fixr8tvIYpIcyNniUwm9-kk5Lcq"
                alt="Inner Algorithm"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gradient Divider */}
      <div className="w-full h-1 my-0" style={{background: 'linear-gradient(90deg, #2563eb 0%, #9333ea 100%)', height: '5px'}} />

      {/* Duplicated Hero Section for Upcoming Course */}
      <div className="relative min-h-screen bg-black flex items-center pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-y-12 gap-x-8 items-center text-center lg:text-left">
            {/* Text, details, and buttons column */}
            <div className="flex flex-col w-full lg:col-span-1">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 lg:mb-8 leading-tight"
                style={{ y }}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Beyond Illusion and Doubt
                </span>
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 lg:mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                AI is brilliant. But what about the intelligence within?
                <br className="hidden sm:block" />
                What if your thoughts, actions and destiny are governed by an Inner Algorithm, invisible yet precise?
                <br className="hidden sm:block" />
                Every algorithm has its architect. Who shaped yours?
              </motion.p>
              <motion.p
                className="text-sm sm:text-base lg:text-lg text-gray-400 mb-6 lg:mb-8 italic"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                This is not your typical summer program!
                <br className="hidden sm:block" />
                This is an invitation for those who feel there's more to life than just data, degrees, and deadlines.
              </motion.p>
              {/* Details and Buttons (always column) */}
              <div className="flex flex-col gap-4 w-full items-center justify-center space-y-4">
                <motion.div
                  className="bg-gray-900/50 p-4 sm:p-6 rounded-xl max-w-md w-full mb-4"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 justify-center lg:justify-start text-center">
                      <span className="text-blue-500 text-lg sm:text-xl">📅</span>
                      <span className="text-gray-300 text-xs sm:text-sm">21 Days</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 justify-center lg:justify-start text-center">
                      <span className="text-blue-500 text-lg sm:text-xl">🌐</span>
                      <span className="text-gray-300 text-xs sm:text-sm">Online</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 justify-center lg:justify-start text-center">
                      <span className="text-blue-500 text-lg sm:text-xl">⬆️</span>
                      <span className="text-gray-300 text-xs sm:text-sm">Upgrade</span>
                    </div>
                  </div>
                </motion.div>
                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col lg:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Link href="/courses">
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 text-white rounded-full font-medium
                        hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl
                        transform hover:scale-105 text-lg flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span role="img" aria-label="video">🎥</span>
                      Register
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
            {/* Image column (second hero) */}
            <motion.div
              ref={heroImgRef2}
              className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] w-full p-4 md:p-0 mx-auto"
              style={{ margin: '40px auto' }}
              initial={{ opacity: 0, x: -40 }}
              animate={heroImgInView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://drive.google.com/uc?export=view&id=187k5_ILmgHPX86u9lNnjyNjqRRIW6dKP"
                alt="Beyond Illusion and Doubt"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features and Volunteer Container */}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        {/* Upcoming Events Section */}
        <section className="relative py-16 sm:py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
          >
            Upcoming Events
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Janamashtami Card */}
            <motion.div
              className="bg-white rounded-2xl p-0 flex flex-col sm:flex-row items-stretch shadow-lg border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Janamashtami
                </h3>
                <div className="text-black mb-2 text-sm sm:text-base"><span className="font-semibold">Date:</span> 26 August 2024</div>
                <div className="text-black mb-2 text-sm sm:text-base"><span className="font-semibold">Time:</span> 6:00 PM onwards</div>
                <div className="text-black mb-4 sm:mb-6 text-sm sm:text-base"><span className="font-semibold">Venue:</span> ISKCON Temple, New Delhi</div>
                <Link href="/choose">
                  <motion.button
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
              <div className="w-full sm:w-64 h-48 sm:h-auto min-h-[12rem] relative flex-shrink-0">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1IrRsPdch3uEZAD6yXhVGtxVMXqEL8IY-"
                  alt="Janamashtami Event"
                  fill
                  className="object-cover rounded-r-2xl"
                  style={{objectPosition: 'center'}}
                  priority={false}
                />
              </div>
            </motion.div>
            {/* Jagannath Rath Yatra Card */}
            <motion.div
              className="bg-white rounded-2xl p-0 flex flex-col sm:flex-row items-stretch shadow-lg border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Jagannath Rath Yatra
                </h3>
                <div className="text-black mb-2 text-sm sm:text-base"><span className="font-semibold">Date:</span> 7 July 2024</div>
                <div className="text-black mb-2 text-sm sm:text-base"><span className="font-semibold">Time:</span> 3:00 PM onwards</div>
                <div className="text-black mb-4 sm:mb-6 text-sm sm:text-base"><span className="font-semibold">Venue:</span> Connaught Place, New Delhi</div>
                <Link href="/register-rathyatra">
                  <motion.button
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
              <div className="w-full sm:w-64 h-48 sm:h-auto min-h-[12rem] relative flex-shrink-0">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1Rlw9vIAso86WY19eHsZBRbMZM-1MLG6f"
                  alt="Jagannath Rath Yatra Event"
                  fill
                  className="object-cover rounded-r-2xl"
                  style={{objectPosition: 'center'}}
                  priority={false}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <div className="py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Athāto brahma jijñāsā
                </span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto italic">
                Now is the time to inquire about the <span className="underline font-bold">Absolute Truth</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="relative group"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={feature.link}>
                    <div className="relative h-[300px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl
                      transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
                      {/* Carousel for Soul Walks */}
                      {feature.title === 'Soul Walks' && (
                        <div className="relative w-full h-full flex flex-col justify-center items-center">
                          <motion.div
                            key={soulWalksIndex}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={soulWalksImages[soulWalksIndex].src}
                              alt={soulWalksImages[soulWalksIndex].alt}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                            />
                          </motion.div>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {soulWalksImages.map((_, i) => (
                              <span key={i} className={`w-2 h-2 rounded-full ${i === soulWalksIndex ? 'bg-white' : 'bg-white/40'}`}></span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Carousel for Divya Vidya */}
                      {feature.title === 'Divya Vidya' && (
                        <div className="relative w-full h-full flex flex-col justify-center items-center">
                          <motion.div
                            key={divyaVidyaIndex}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={divyaVidyaImages[divyaVidyaIndex].src}
                              alt={divyaVidyaImages[divyaVidyaIndex].alt}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                            />
                          </motion.div>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {divyaVidyaImages.map((_, i) => (
                              <span key={i} className={`w-2 h-2 rounded-full ${i === divyaVidyaIndex ? 'bg-white' : 'bg-white/40'}`}></span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Default image for other features */}
                      {feature.title !== 'Soul Walks' && feature.title !== 'Divya Vidya' && (
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="transition-transform duration-500 group-hover:scale-110 object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {feature.title === 'Soul Walks' || feature.title === 'Divya Vidya' ? (
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {feature.title}
                            </span>
                          ) : (
                            feature.title
                          )}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Volunteer Section */}
        <div className="py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left Content - Image */}
              <motion.div
                className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl aspect-square rounded-2xl overflow-hidden mx-auto"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
              >
                <Image
                  src="https://drive.google.com/uc?export=view&id=1LCKUH9RXlJ83gX-NBVbNU812HW3m4vpv"
                  alt="Volunteer"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Right Content - Text */}
              <motion.div
                className="text-center lg:text-left"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
                  Want to <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">volunteer</span>?
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mb-8 sm:mb-12">
                  Passionate about photography, music, or creativity? Join us in serving the Spiritual Club through your talents!
                </p>
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium
                    hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-500 hover:to-purple-600 hover:border-transparent
                    transition-all duration-300 shadow-lg hover:shadow-xl text-lg flex items-center gap-2 lg:inline-flex"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignUpClick}
                >
                  <span role="img" aria-label="volunteer">🤝</span>
                  Sign Up
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Testimonials
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">Hear from our amazing volunteers and participants</p>
            </div>
            
            {/* Single Testimonial Card */}
            <motion.div
              className="bg-white/10 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-lg max-w-4xl mx-auto"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
                {/* Image and Name Section */}
                <div className="flex flex-col items-center lg:items-start min-w-[100px] sm:min-w-[120px]">
                  <motion.img 
                    key={currentTestimonial}
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-600 mb-4" 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div 
                    key={`name-${currentTestimonial}`}
                    className="text-center lg:text-left"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="font-bold text-white text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-blue-300 text-sm">{testimonials[currentTestimonial].role}</div>
                  </motion.div>
                </div>

                {/* Quote Section */}
                <div className="flex-1">
                  <motion.blockquote 
                    key={`quote-${currentTestimonial}`}
                    className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-gray-100 italic leading-relaxed"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    "{testimonials[currentTestimonial].quote}"
                  </motion.blockquote>
                </div>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                        : 'bg-white/30'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal for Volunteer Sign Up */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className={`bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-md mx-auto transition-all duration-300 ${modalStep === 'form' ? 'max-w-lg' : 'max-w-md'}`} onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-4 text-xl sm:text-2xl text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>&times;</button>
            {modalStep === 'options' && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-bold mb-2">Volunteer Sign Up</h2>
                <p className="text-gray-600 mb-4">Choose how you'd like to connect:</p>
                <div className="flex flex-col gap-4 w-full">
                  <button onClick={() => handleOptionClick('whatsapp')} className="w-full px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition">WhatsApp</button>
                  <button onClick={() => handleOptionClick('email')} className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">Email</button>
                </div>
              </div>
            )}
            {modalStep === 'form' && (
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <h2 className="text-2xl font-bold mb-2">Volunteer via Email</h2>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="Your Phone Number"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  name="skill"
                  value={form.skill}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">Select your skill</option>
                  {skills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast/modal at bottom right */}
      {toast && toastVisible && (
        <div className={`fixed bottom-6 right-6 z-50 min-w-[220px] max-w-xs bg-white shadow-lg rounded-lg px-6 py-4 flex flex-col items-start border ${toast.type === 'success' ? 'border-green-400' : 'border-red-400'}`}>
          <span className={`font-semibold mb-2 ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{toast.type === 'success' ? 'Sent!' : 'Failed'}</span>
          <span className="text-gray-800 text-sm mb-2">{toast.message}</span>
          <div className="w-full h-1 rounded bg-gray-200 overflow-hidden">
            <div className={`h-full ${toast.type === 'success' ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${toastBarWidth}%`, transition: 'width 0.1s linear' }} />
          </div>
        </div>
      )}
    </div>
  );
}