"use client"
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Courses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    
    const headerOpacity = useTransform(
        scrollY,
        [0, 200],
        [1, 0]
    );
    const headerY = useTransform(scrollY, [0, 0.1], [0, -50]);

    useEffect(() => {
        fetch("http://localhost:8000/api/courses/")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setCourses(data.records || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const renderLoading = () => (
        <div className="h-screen w-screen flex items-center justify-center bg-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <Image
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8"
                    alt="Education background"
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
                    <motion.div
                        className="w-16 h-16 rounded-full border-2 border-gray-200 border-t-gray-800"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    
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
                    <span className="text-gray-500 text-xs font-light tracking-wider">YOUR LEARNING PATH</span>
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

    const renderCourse = (course: any, index: number) => {
        const isSelected = selectedCourse === index;
        
        return (
            <motion.div
                key={course.id}
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
                        src={course.fields["image-url"] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                        alt={`Course visual for ${course.fields["course-title"]}`}
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
                        {course.fields["duration"] || "8 weeks"}
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent 
                        bg-gradient-to-r from-indigo-600 to-purple-600">
                        {course.fields["course-title"]}
                    </h2>
                    
                    <p className="text-lg sm:text-xl text-gray-700 mb-4">
                        {course.fields["course-subtitle"]}
                    </p>
                    
                    <motion.div
                        initial={false}
                        animate={{ height: isSelected ? "auto" : "0px" }}
                        className="overflow-hidden"
                    >
                        <p className="text-gray-600 mb-8 line-clamp-3">
                            {course.fields["course-description"]}
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <span className="text-gray-600">
                            {course.fields["enrolled-count"] || "1,234"} enrolled
                        </span>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourse(isSelected ? null : index);
                            }}
                            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full 
                                hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-fit"
                        >
                            {isSelected ? "Show Less" : "Learn More"}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    if (loading) return renderLoading();
    if (error) return renderError();

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 min-h-screen overflow-x-hidden relative">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
                {/* Educational Symbols Pattern */}
                <div className="absolute top-[10vh] left-[5vw] w-32 h-32 opacity-30 transform rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
                        <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                        <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                        <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                    </svg>
                </div>
                <div className="absolute top-[30vh] right-[10vw] w-48 h-48 opacity-30 transform -rotate-45">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
                        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                    </svg>
                </div>
                <div className="absolute top-[50vh] left-[15vw] w-40 h-40 opacity-30 transform rotate-90">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
                        <path fillRule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm3.97.97a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06zm4.28 4.28a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="absolute top-[70vh] right-[20vw] w-36 h-36 opacity-30 transform -rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
                        <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.75 6.75 0 01-.937-.171.75.75 0 11.374-1.453 5.25 5.25 0 002.626 0 .75.75 0 11.374 1.452 6.75 6.75 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
                        <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="absolute top-[90vh] left-[25vw] w-52 h-52 opacity-30 transform rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
                        <path d="M16.5 3.75a1.5 1.5 0 01-3 0V2.25a.75.75 0 011.5 0v1.5zm0 16.5a1.5 1.5 0 01-3 0V15a.75.75 0 011.5 0v5.25zm9-16.5a1.5 1.5 0 01-3 0V2.25a.75.75 0 011.5 0v1.5zm0 16.5a1.5 1.5 0 01-3 0V15a.75.75 0 011.5 0v5.25zM3.75 16.5a1.5 1.5 0 01-3 0V15a.75.75 0 011.5 0v1.5zm0-12.75a1.5 1.5 0 01-3 0V2.25a.75.75 0 011.5 0v1.5zm9 5.25a.75.75 0 00-1.5 0v5.25a.75.75 0 001.5 0V9zm1.5-1.5A.75.75 0 0112 6.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 011.5 0zm3 3a.75.75 0 00-1.5 0v5.25a.75.75 0 001.5 0V10.5zm1.5-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V9z" />
                    </svg>
                </div>
                <div className="absolute top-[20vh] left-[30vw] w-28 h-28 opacity-30 transform rotate-45">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
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
                            bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                        Discover Our Courses
                    </h1>
                </motion.div>

                <div className="relative py-8 sm:py-16 px-4 sm:px-8 max-w-[90rem] mx-auto mt-[20vh] sm:mt-[25vh]">
                    <div className="flex flex-col gap-12 sm:gap-24">
                        {courses.map((course, index) => renderCourse(course, index))}
                    </div>

                    {courses.length === 0 && (
                        <div className="h-[50vh] flex items-center justify-center">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <h2 className="text-2xl sm:text-3xl font-light mb-4 bg-clip-text text-transparent 
                                    bg-gradient-to-r from-indigo-600 to-purple-600">
                                    No Courses Available
                                </h2>
                                <p className="text-gray-600">Check back soon for new learning opportunities</p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}