"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function PrabhupadaPage() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [positions, setPositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);
  const containerRef = useRef<HTMLDivElement>(null);

  const prabhupadaPhotos = [
    {
      src: "https://vanimedia.org/w/images/thumb/CT01/CT01_001.jpg/800px-CT01_001.jpg",
      alt: "Srila Prabhupada in New York",
      year: "1966"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT02/CT02_001.jpg/800px-CT02_001.jpg",
      alt: "Srila Prabhupada giving lecture",
      year: "1967"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT03/CT03_001.jpg/800px-CT03_001.jpg",
      alt: "Srila Prabhupada with disciples",
      year: "1968"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT04/CT04_001.jpg/800px-CT04_001.jpg",
      alt: "Srila Prabhupada in Vrindavan",
      year: "1969"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT05/CT05_001.jpg/800px-CT05_001.jpg",
      alt: "Srila Prabhupada in London",
      year: "1970"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT06/CT06_001.jpg/800px-CT06_001.jpg",
      alt: "Srila Prabhupada in San Francisco",
      year: "1971"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT07/CT07_001.jpg/800px-CT07_001.jpg",
      alt: "Srila Prabhupada in Mayapur",
      year: "1972"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT08/CT08_001.jpg/800px-CT08_001.jpg",
      alt: "Srila Prabhupada in Bombay",
      year: "1973"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT09/CT09_001.jpg/800px-CT09_001.jpg",
      alt: "Srila Prabhupada in Paris",
      year: "1974"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT10/CT10_001.jpg/800px-CT10_001.jpg",
      alt: "Srila Prabhupada in Tokyo",
      year: "1975"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT11/CT11_001.jpg/800px-CT11_001.jpg",
      alt: "Srila Prabhupada in Moscow",
      year: "1976"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT12/CT12_001.jpg/800px-CT12_001.jpg",
      alt: "Srila Prabhupada in Nairobi",
      year: "1977"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT13/CT13_001.jpg/800px-CT13_001.jpg",
      alt: "Srila Prabhupada in Melbourne",
      year: "1966"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT14/CT14_001.jpg/800px-CT14_001.jpg",
      alt: "Srila Prabhupada in Sydney",
      year: "1967"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT15/CT15_001.jpg/800px-CT15_001.jpg",
      alt: "Srila Prabhupada in Auckland",
      year: "1968"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT16/CT16_001.jpg/800px-CT16_001.jpg",
      alt: "Srila Prabhupada in Johannesburg",
      year: "1969"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT17/CT17_001.jpg/800px-CT17_001.jpg",
      alt: "Srila Prabhupada in Lagos",
      year: "1970"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT18/CT18_001.jpg/800px-CT18_001.jpg",
      alt: "Srila Prabhupada in Cairo",
      year: "1971"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT19/CT19_001.jpg/800px-CT19_001.jpg",
      alt: "Srila Prabhupada in Istanbul",
      year: "1972"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT20/CT20_001.jpg/800px-CT20_001.jpg",
      alt: "Srila Prabhupada in Athens",
      year: "1973"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT21/CT21_001.jpg/800px-CT21_001.jpg",
      alt: "Srila Prabhupada in Rome",
      year: "1974"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT22/CT22_001.jpg/800px-CT22_001.jpg",
      alt: "Srila Prabhupada in Madrid",
      year: "1975"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT23/CT23_001.jpg/800px-CT23_001.jpg",
      alt: "Srila Prabhupada in Lisbon",
      year: "1976"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT24/CT24_001.jpg/800px-CT24_001.jpg",
      alt: "Srila Prabhupada in Amsterdam",
      year: "1977"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT25/CT25_001.jpg/800px-CT25_001.jpg",
      alt: "Srila Prabhupada in Brussels",
      year: "1966"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT26/CT26_001.jpg/800px-CT26_001.jpg",
      alt: "Srila Prabhupada in Stockholm",
      year: "1967"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT27/CT27_001.jpg/800px-CT27_001.jpg",
      alt: "Srila Prabhupada in Oslo",
      year: "1968"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT28/CT28_001.jpg/800px-CT28_001.jpg",
      alt: "Srila Prabhupada in Helsinki",
      year: "1969"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT29/CT29_001.jpg/800px-CT29_001.jpg",
      alt: "Srila Prabhupada in Warsaw",
      year: "1970"
    },
    {
      src: "https://vanimedia.org/w/images/thumb/CT30/CT30_001.jpg/800px-CT30_001.jpg",
      alt: "Srila Prabhupada in Prague",
      year: "1971"
    }
  ];

  const quotes = [
    {
      text: "The material world is a reflection of the spiritual world. The material world is but a shadow of reality. In the shadow there cannot be any substance, but from the shadow we can understand that there is substance and reality.",
      author: "A.C. Bhaktivedanta Swami Prabhupada"
    },
    {
      text: "The living entity in material nature thus follows the ways of life, enjoying the three modes of nature. This is due to his association with that material nature. Thus he meets with good and evil among various species.",
      author: "A.C. Bhaktivedanta Swami Prabhupada"
    },
    {
      text: "The real business of human beings is to solve the problems of life and then to return home, back to Godhead. We are not meant to remain here in this material world, which is full of miseries.",
      author: "A.C. Bhaktivedanta Swami Prabhupada"
    },
    {
      text: "The more we become attached to material possessions, the more we become entangled in the material world. The more we become detached from material possessions, the more we become free from material bondage.",
      author: "A.C. Bhaktivedanta Swami Prabhupada"
    },
    {
      text: "The real purpose of life is to revive our relationship with the Supreme Lord. That is the real purpose of life. We are not meant to remain here in this material world, which is full of miseries.",
      author: "A.C. Bhaktivedanta Swami Prabhupada"
    },
    {
      text: "The living entity is eternal, and the material body is temporary. The living entity is the same in quality as the Supreme Lord, but in quantity, the living entity is very small, whereas the Supreme Lord is very great.",
      author: "A.C. Bhaktivedanta Swami Prabhupada"
    },
    {
      text: "The process of devotional service is the only means to achieve the highest perfection of life. There is no other way. This is the verdict of all the great sages and saints.",
      author: "A.C. Bhaktivedanta Swami Prabhupada"
    }
  ];

  // Function to fetch image URL from API
  const fetchImageUrl = async (apiUrl: string) => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      return pages[pageId].imageinfo[0].url;
    } catch (error) {
      console.error('Error fetching image URL:', error);
      return null;
    }
  };

  // State to store actual image URLs
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

  // Fetch image URLs on component mount
  useEffect(() => {
    const fetchAllImageUrls = async () => {
      const urls: {[key: string]: string} = {};
      for (const photo of prabhupadaPhotos) {
        const url = await fetchImageUrl(photo.src);
        if (url) {
          urls[photo.src] = url;
        }
      }
      setImageUrls(urls);
    };
    fetchAllImageUrls();
  }, []);

  // Function to shuffle array
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Shuffle photos on component mount
  useEffect(() => {
    shuffleArray(prabhupadaPhotos);
  }, []);

  useEffect(() => {
    const animate = () => {
      setPositions(prev => prev.map((pos, index) => {
        const newY = pos.y + (Math.random() - 0.5) * 2; // Random movement
        const maxY = 100; // Maximum vertical movement
        
        // Keep within bounds and avoid collisions
        if (Math.abs(newY) > maxY || checkCollision(index, newY)) {
          return pos;
        }
        
        return { ...pos, y: newY };
      }));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  // Function to check for collisions
  const checkCollision = (index: number, newY: number) => {
    const imageHeight = [500, 450, 400, 350][index];
    const minSpacing = 50; // Minimum spacing between images

    for (let i = 0; i < positions.length; i++) {
      if (i === index) continue;
      
      const otherHeight = [500, 450, 400, 350][i];
      const otherY = positions[i].y;
      
      // Check if images would overlap
      if (Math.abs(newY - otherY) < (imageHeight + otherHeight) / 2 + minSpacing) {
        return true;
      }
    }
    return false;
  };

  const prabhupadaQuotes = [
    {
      text: "The material world is a place of misery, and the spiritual world is a place of happiness. We should try to go back to the spiritual world.",
      source: "Bhagavad-gita As It Is"
    },
    {
      text: "The living entity is eternal, and the material body is temporary. We should not identify with the temporary body but with the eternal soul.",
      source: "Srimad-Bhagavatam"
    },
    {
      text: "Krishna consciousness is not an artificial imposition on the mind; it is the original energy of the living entity.",
      source: "The Nectar of Devotion"
    }
  ];

  const prabhupadaFacts = [
    {
      title: "Journey to the West",
      fact: "In 1965, at the age of 69, Srila Prabhupada traveled to America with just $7 and a trunk of books, beginning his mission to spread Krishna consciousness worldwide. His determination and faith in his spiritual master's order led to the establishment of a global spiritual movement.",
      image: "https://drive.google.com/uc?export=view&id=1RUzKSBTwtch8SwBb-RWoVn3hNsNcfiZv"
    },
    {
      title: "Literary Legacy",
      fact: "Srila Prabhupada translated and wrote commentaries for over 80 volumes of ancient Vedic texts, including the Bhagavad-gita and Srimad-Bhagavatam. His translations are considered the most authentic and widely read versions of these sacred texts in the world today.",
      image: "https://drive.google.com/uc?export=view&id=1soO8ToR9_FWY48N06PujB_PFYQCSDbng"
    },
    {
      title: "Global Impact",
      fact: "Under Srila Prabhupada's guidance, 108 temples were established worldwide, creating centers for spiritual education and cultural preservation. His vision of a worldwide spiritual movement continues to inspire millions of people across all continents.",
      image: "https://drive.google.com/uc?export=view&id=1xcEQrrZJUr_DpWUSUm4gowva_FsmkF6v"
    },
    {
      title: "Early Life",
      fact: "Born in 1896 in Calcutta, Srila Prabhupada dedicated his life to sharing the timeless wisdom of Krishna consciousness with people around the world. His early life was marked by deep spiritual study and devotion to his spiritual master.",
      image: "https://drive.google.com/uc?export=view&id=1t0TnBeQhhGgC6vhWGn_k3C10tjqasAUQ"
    }
  ];

  const [selectedBook, setSelectedBook] = useState<{ title: string; image: string; description: string; vedabaseLink: string } | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          />
          <div className="relative z-10 max-w-4xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative h-[60vh]">
              <Image
                src={prabhupadaFacts[selectedImage].image}
                alt="Srila Prabhupada"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {prabhupadaFacts[selectedImage].title}
              </h3>
              <p className="text-gray-700 text-lg">
                {prabhupadaFacts[selectedImage].fact}
              </p>
              <button
                className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative h-[60vh] bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              His Divine Grace<br />
              A.C. Bhaktivedanta Swami Prabhupada
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Founder-Acharya of the International Society for Krishna Consciousness
            </p>
          </div>
          <div className="hidden md:block relative h-full w-1/2">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-transparent" />
            <Image
              src="https://drive.google.com/uc?export=view&id=1h6ND8u6CVU4L82Ui7Lbb7JbDzzjEVORB"
              alt="Srila Prabhupada"
              fill
              priority
              className="object-contain object-right"
            />
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Biography</h2>
            <p className="text-gray-600 mb-4">
              Born in 1896 in Calcutta, Abhay Charan De (later known as A.C. Bhaktivedanta Swami Prabhupada) was a pure devotee of Lord Krishna who dedicated his life to spreading the message of Krishna consciousness throughout the world.
            </p>
            <p className="text-gray-600 mb-4">
              In 1965, at the age of 69, he traveled to America with just $7 and a trunk of books. Through his tireless efforts, he established 108 temples worldwide and translated over 80 volumes of ancient Vedic texts into English.
            </p>
            <p className="text-gray-600">
              His legacy continues to inspire millions of people around the world to follow the path of devotional service to Lord Krishna.
            </p>
          </div>
          <div className="relative h-[600px] w-full" ref={containerRef}>
            {/* Floating Images Container */}
            <div className="relative w-full h-full flex justify-between items-center px-4">
              {/* First Image - Largest */}
              <motion.div
                className="w-[500px] h-[500px] overflow-hidden rounded-lg border-4 border-white shadow-xl cursor-pointer"
                style={{
                  transform: `translateY(${positions[0].y}px)`,
                }}
                onClick={() => setSelectedImage(0)}
              >
                <Image
                  src={prabhupadaFacts[0].image}
                  alt="Srila Prabhupada"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Second Image */}
              <motion.div
                className="w-[450px] h-[450px] overflow-hidden rounded-lg border-4 border-white shadow-xl cursor-pointer"
                style={{
                  transform: `translateY(${positions[1].y}px)`,
                }}
                onClick={() => setSelectedImage(1)}
              >
                <Image
                  src={prabhupadaFacts[1].image}
                  alt="Srila Prabhupada"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Third Image */}
              <motion.div
                className="w-[400px] h-[400px] overflow-hidden rounded-lg border-4 border-white shadow-xl cursor-pointer"
                style={{
                  transform: `translateY(${positions[2].y}px)`,
                }}
                onClick={() => setSelectedImage(2)}
              >
                <Image
                  src={prabhupadaFacts[2].image}
                  alt="Srila Prabhupada"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Fourth Image - Smallest */}
              <motion.div
                className="w-[350px] h-[350px] overflow-hidden rounded-lg border-4 border-white shadow-xl cursor-pointer"
                style={{
                  transform: `translateY(${positions[3].y}px)`,
                }}
                onClick={() => setSelectedImage(3)}
              >
                <Image
                  src={prabhupadaFacts[3].image}
                  alt="Srila Prabhupada"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Books by His Divine Grace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* The Science of Self-Realization Card */}
            <motion.div
              className="bg-[#f3d4a5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelectedBook({
                title: "The Science of Self-Realization",
                image: "https://drive.google.com/uc?export=view&id=1sEcTl1CTex97Q_bqrOo582FOAoUQoX9C",
                description: "Articles from Back to Godhead magazine",
                vedabaseLink: "https://vedabase.io/en/library/bg/"
              })}
            >
              <div className="relative aspect-[3/4] rounded-t-2xl overflow-hidden">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1sEcTl1CTex97Q_bqrOo582FOAoUQoX9C"
                  alt="The Science of Self-Realization"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">The Science of Self-Realization</h3>
                <p className="text-gray-600 line-clamp-2">
                  Articles from Back to Godhead magazine
                </p>
              </div>
            </motion.div>

            {/* Kṛṣṇa, the Supreme Personality of Godhead Card */}
            <motion.div
              className="bg-[#f3d4a5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedBook({
                title: "Kṛṣṇa, the Supreme Personality of Godhead",
                image: "https://drive.google.com/uc?export=view&id=1wCuixhz1NLoIC-EyF4iDQvBNzuWh8siJ",
                description: "A summary study of Srila Rupa Gosvami's Bhakti-rasamrta-sindhu, explaining the science of devotional service. This book provides a comprehensive understanding of the principles and practices of bhakti-yoga.",
                vedabaseLink: "https://vedabase.io/en/library/nod/"
              })}
            >
              <div className="relative aspect-[3/4] rounded-t-2xl overflow-hidden">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1wCuixhz1NLoIC-EyF4iDQvBNzuWh8siJ"
                  alt="Kṛṣṇa, the Supreme Personality of Godhead"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Kṛṣṇa, the Supreme Personality of Godhead</h3>
                <p className="text-gray-600 line-clamp-2">
                  A summary study of Srila Rupa Gosvami's Bhakti-rasamrta-sindhu, explaining the science of devotional service.
                </p>
              </div>
            </motion.div>

            {/* Śrīmad-Bhāgavatam */}
            <motion.div
              className="bg-[#f3d4a5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => setSelectedBook({
                title: "Śrīmad-Bhāgavatam",
                image: "https://drive.google.com/uc?export=view&id=1qbeXkBttmyeKXQoOV3HeOtJAvqCRlrEA",
                description: "Śrīmad-Bhāgavatam",
                vedabaseLink: "https://vedabase.io/en/library/noi/"
              })}
            >
              <div className="relative aspect-[3/4] rounded-t-2xl overflow-hidden">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1qbeXkBttmyeKXQoOV3HeOtJAvqCRlrEA"
                  alt="Śrīmad-Bhāgavatam"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Śrīmad-Bhāgavatam</h3>
                <p className="text-gray-600 line-clamp-2">
                  Eleven instructions on the process of devotional service, given by Srila Rupa Gosvami.
                </p>
              </div>
            </motion.div>

            {/* Teachings of Lord Caitanya Card */}
            <motion.div
              className="bg-[#f3d4a5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => setSelectedBook({
                title: "Bhagavad-gītā As It Is",
                image: "https://drive.google.com/uc?export=view&id=1mYUrdLwQe96x-BDe5N4Zto_Fwuui_WP9",
                description: "Bhagavad-gītā As It Is",
                vedabaseLink: "https://vedabase.io/en/library/tlc/"
              })}
            >
              <div className="relative aspect-[3/4] rounded-t-2xl overflow-hidden">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1mYUrdLwQe96x-BDe5N4Zto_Fwuui_WP9"
                  alt="Bhagavad-gītā As It Is"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Bhagavad-gītā As It Is</h3>
                <p className="text-gray-600 line-clamp-2">
                Bhagavad-gītā As It Is
                </p>
              </div>
            </motion.div>

            {/* Discover More Card */}
            <motion.div
              className="bg-[#f3d4a5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onClick={() => window.open('https://vedabase.io/en/', '_blank')}
            >
              <div className="relative aspect-[3/4] rounded-t-2xl overflow-hidden">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1pSyIapo38U98HI8vQdvvPc60WRC-gMUk"
                  alt="Discover More"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Discover More</h3>
                <p className="text-gray-600 line-clamp-2">
                  Explore the complete collection of Srila Prabhupada's books and translations on Vedabase.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Book Modal */}
      {selectedBook && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBook(null)}
        >
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Page - Book Cover */}
              <motion.div 
                className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gray-50"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              >
                <div className="relative aspect-[3/4] w-full max-w-md">
                  <Image
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
              
              {/* Right Page - Content */}
              <motion.div 
                className="w-full md:w-1/2 p-8 flex flex-col bg-[#f3d4a5]"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              >
                <h2 className="text-3xl font-bold mb-6">{selectedBook.title}</h2>
                <p className="text-gray-600 mb-8 flex-grow">{selectedBook.description}</p>
                <div className="flex justify-end">
                  <a
                    href={selectedBook.vedabaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-[#da9d5b] text-white rounded-lg hover:bg-[#c88d4b] transition-colors duration-300"
                  >
                    Read on Vedabase
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Quotes */}
      <div className="bg-[#f3d4a5] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Inspiring Quotes</h2>
          <div className="relative bg-white rounded-2xl shadow-xl p-8 min-h-[300px]">
            {/* Navigation Arrows */}
            <button
              onClick={prevQuote}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-[#da9d5b] text-white hover:bg-[#c88d4b] transition-colors duration-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextQuote}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-[#da9d5b] text-white hover:bg-[#c88d4b] transition-colors duration-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Quote Content */}
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="text-center px-12"
            >
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-6">
                "{quotes[currentQuoteIndex].text}"
              </blockquote>
              <p className="text-lg font-semibold text-[#da9d5b]">
                — {quotes[currentQuoteIndex].author}
              </p>
            </motion.div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuoteIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentQuoteIndex ? 'bg-[#da9d5b]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
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