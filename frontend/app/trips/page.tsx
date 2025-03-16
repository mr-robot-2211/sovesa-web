"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Trips() {
    // All hooks must be called before any conditional returns
    const [trips, setTrips] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    
    // Refs and scroll hooks
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    
    // Transform values for animations
    const headerOpacity = useTransform(
        scrollY,
        [0, 200],
        [1, 0]
    );

    useEffect(() => {
        fetch("http://localhost:8000/api/trips/")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setTrips(data.records || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Render functions
    const renderLoading = () => (
        <div className="h-screen w-screen flex items-center justify-center bg-white relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-5">
                <Image
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828"
                    alt="Travel background"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
            </div>
            
            <motion.div 
                className="flex flex-col items-center gap-6 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="relative">
                    {/* Outer rotating circle */}
                    <motion.div
                        className="w-16 h-16 rounded-full border-2 border-gray-200 border-t-gray-800"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    
                    {/* Inner pulsing dot */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
                
                <div className="flex flex-col items-center gap-1">
                    <span className="text-gray-800 text-sm font-light tracking-[0.2em]">PREPARING</span>
                    <span className="text-gray-500 text-xs font-light tracking-wider">YOUR JOURNEY</span>
                </div>
            </motion.div>
        </div>
    );

    const renderError = () => (
        <div className="h-screen w-screen flex items-center justify-center bg-white text-gray-800 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md text-center"
            >
                <div className="text-red-500 text-6xl mb-6">!</div>
                <h2 className="text-2xl font-light mb-4">Something went wrong</h2>
                <p className="text-gray-600">{error}</p>
            </motion.div>
        </div>
    );

    const renderTrip = (trip: any, index: number) => (
        <motion.div
            key={trip.id}
            className={`relative h-auto sm:h-[60vh] w-full sm:w-[75vw] group bg-white rounded-xl shadow-lg 
                flex flex-col sm:flex-row overflow-hidden mx-auto
                ${index % 2 === 0 ? 'sm:mr-auto' : 'sm:ml-auto'}`}
            initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
        >
            <div className={`relative w-full sm:w-1/2 aspect-video sm:aspect-auto ${index % 2 === 0 ? 'sm:order-first' : 'sm:order-last'}`}>
                <Image
                    src={trip.fields["image-url"] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
                    alt={trip.fields["trip-title"]}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-1000 group-hover:scale-105"
                    priority={index < 2}
                />
            </div>

            <motion.div 
                className={`w-full sm:w-1/2 p-8 sm:p-10 flex flex-col justify-center 
                    ${index % 2 === 0 ? 'sm:pl-12' : 'sm:pr-12'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 
                    text-indigo-600 text-sm mb-6 w-fit font-medium`}>
                    {trip.fields["Date"]}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent 
                    bg-gradient-to-r from-blue-600 to-purple-600">
                    {trip.fields["trip-title"]}
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-4">
                    {trip.fields["trip-sub-title"]}
                </p>
                <p className="text-gray-600 mb-8 line-clamp-3">
                    {trip.fields["trip-description"]}
                </p>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full 
                        hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-fit"
                >
                    Begin Journey
                </motion.button>
            </motion.div>
        </motion.div>
    );

    // Main render
    if (loading) return renderLoading();
    if (error) return renderError();

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 min-h-screen overflow-x-hidden relative">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
                {/* Gaur Nitai Pattern */}
                <div className="absolute top-[15vh] left-[5vw] w-32 h-40 opacity-30">
                    <Image
                        src="https://static.wixstatic.com/media/3a7614_6984eec9dbe44d1d8da18afde0189405~mv2.png/v1/fill/w_232,h_289,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/GAUR%20NITAI%20Png.png"
                        alt="Gaur Nitai"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[45vh] right-[10vw] w-40 h-48 opacity-30">
                    <Image
                        src="https://static.wixstatic.com/media/3a7614_6984eec9dbe44d1d8da18afde0189405~mv2.png/v1/fill/w_232,h_289,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/GAUR%20NITAI%20Png.png"
                        alt="Gaur Nitai"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[75vh] left-[15vw] w-36 h-44 opacity-30">
                    <Image
                        src="https://static.wixstatic.com/media/3a7614_6984eec9dbe44d1d8da18afde0189405~mv2.png/v1/fill/w_232,h_289,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/GAUR%20NITAI%20Png.png"
                        alt="Gaur Nitai"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[30vh] left-[20vw] w-28 h-36 opacity-30">
                    <Image
                        src="https://static.wixstatic.com/media/3a7614_6984eec9dbe44d1d8da18afde0189405~mv2.png/v1/fill/w_232,h_289,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/GAUR%20NITAI%20Png.png"
                        alt="Gaur Nitai"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[60vh] right-[15vw] w-44 h-52 opacity-30">
                    <Image
                        src="https://static.wixstatic.com/media/3a7614_6984eec9dbe44d1d8da18afde0189405~mv2.png/v1/fill/w_232,h_289,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/GAUR%20NITAI%20Png.png"
                        alt="Gaur Nitai"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[90vh] right-[25vw] w-36 h-44 opacity-30">
                    <Image
                        src="https://static.wixstatic.com/media/3a7614_6984eec9dbe44d1d8da18afde0189405~mv2.png/v1/fill/w_232,h_289,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/GAUR%20NITAI%20Png.png"
                        alt="Gaur Nitai"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </div>
            <motion.div 
                ref={containerRef}
                className="relative w-full pt-[5rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.div 
                    className="fixed top-20 left-0 right-0 h-[20vh] sm:h-[25vh] flex items-center justify-center bg-white z-[5]"
                    style={{
                        opacity: headerOpacity
                    }}
                >
                    <h1 
                        className="text-4xl sm:text-6xl font-bold text-center px-4 pb-1 max-w-4xl leading-relaxed
                            bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        Discover Amazing Journeys
                    </h1>
                </motion.div>

                <div className="relative py-8 sm:py-16 px-4 sm:px-8 max-w-[90rem] mx-auto mt-[20vh] sm:mt-[25vh]">
                    <div className="flex flex-col gap-12 sm:gap-24">
                        {trips.map((trip, index) => renderTrip(trip, index))}
                    </div>

                    {trips.length === 0 && (
                        <div className="h-[50vh] flex items-center justify-center">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <h2 className="text-2xl sm:text-3xl font-light mb-4 bg-clip-text text-transparent 
                                    bg-gradient-to-r from-blue-600 to-purple-600">
                                    No Journeys Available
                                </h2>
                                <p className="text-gray-600">Check back soon for new adventures</p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
