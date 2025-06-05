"use client"
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatePresence } from "framer-motion";

interface PaymentFormData {
    email: string;
    name: string;
    id: string;
    phone: string;
}

interface SubmissionStatus {
    loading: boolean;
    error: string | null;
    success: boolean;
}

interface FormData {
    email: string;
    name: string;
    id: string;
    phone: string;
}

// Move PaymentModal outside the main component to prevent re-renders
const PaymentModal = ({
    formStep,
    formData,
    selectedCourse,
    onClose,
    onSubmit,
    onFormDataChange,
    onFileChange
}: {
    formStep: number;
    formData: PaymentFormData;
    selectedCourse: any;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onFormDataChange: (field: keyof PaymentFormData, value: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md my-8"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                    {formStep === 1 ? "Personal Details" : "Payment Details"}
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    type="button"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                {formStep === 1 ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => onFormDataChange('email', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => onFormDataChange('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input
                                type="text"
                                required
                                value={formData.id}
                                onChange={(e) => onFormDataChange('id', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => onFormDataChange('phone', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">Payment Instructions</h4>
                            <p className="text-gray-600 mb-4">Please scan the QR code below and make the payment of {selectedCourse?.fields["price"] || "specified amount"}</p>
                            <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
                                <Image
                                    src="/qr-code.png"
                                    alt="Payment QR Code"
                                    width={200}
                                    height={200}
                                    className="max-w-full h-auto"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Payment Screenshot</label>
                            <input
                                type="file"
                                required
                                accept="image/*"
                                onChange={onFileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg
                        hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {formStep === 1 ? "Next" : "Submit"}
                </button>
            </form>
        </motion.div>
    </motion.div>
);

export default function Courses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        name: "",
        id: "",
        phone: "",
    });
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
        loading: false,
        error: null,
        success: false
    });
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    
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

    const handleCardExpand = (courseId: string) => {
        setExpandedCard(expandedCard === courseId ? null : courseId);
    };

    const handleJoinNow = (course: any) => {
        setSelectedCourse(course);
        setShowPaymentModal(true);
        setFormStep(1);
    };

    const handleFormDataChange = useCallback((field: keyof PaymentFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (formStep === 1) {
            setFormStep(2);
        } else {
            if (!selectedCourse) {
                console.error('No course selected');
                setSubmissionStatus(prev => ({
                    ...prev,
                    error: "No course selected. Please try again."
                }));
                return;
            }

            const jsonData = {
                email: formData.email,
                name: formData.name,
                student_id: formData.id,
                phone: formData.phone,
                courseId: selectedCourse.fields["course-title"]
            };

            setSubmissionStatus(prev => ({ ...prev, loading: true, error: null }));

            // Send the form data to the backend
            fetch('http://127.0.0.1:8000/api/courses-registration/', {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSubmissionStatus(prev => ({ ...prev, loading: false, success: true }));
                setShowSuccessDialog(true);
                setShowPaymentModal(false);
                setFormData({ email: "", name: "", id: "", phone: "" });
                setFormStep(1);
            })
            .catch(error => {
                setSubmissionStatus(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message
                }));
            });
        }
    }, [formStep, formData, selectedCourse]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle file upload if needed
        console.log('File selected:', e.target.files?.[0]);
    };

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
        const isExpanded = expandedCard === course.id;
        
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
                        animate={{ height: isExpanded ? "auto" : "0px" }}
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
                        
                        <div className="flex gap-4 w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCardExpand(course.id)}
                                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full 
                                    hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex-1 sm:flex-none"
                            >
                                {isExpanded ? "Show Less" : "Learn More"}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleJoinNow(course)}
                                className="px-6 sm:px-8 py-3 bg-white text-indigo-600 font-medium rounded-full border-2 border-indigo-600
                                    hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg flex-1 sm:flex-none"
                            >
                                Join Now
                            </motion.button>
                        </div>
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
                {/* Child Reading Pattern */}
                <div className="absolute top-[15vh] left-[5vw] w-32 h-40 opacity-60 brightness-200">
                    <Image
                        src="https://thumbs.dreamstime.com/b/child-reading-under-tree-illustration-332188223.jpg"
                        alt="Child Reading"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[45vh] right-[10vw] w-40 h-48 opacity-60 brightness-200">
                    <Image
                        src="https://thumbs.dreamstime.com/b/child-reading-under-tree-illustration-332188223.jpg"
                        alt="Child Reading"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[75vh] left-[15vw] w-36 h-44 opacity-60 brightness-200">
                    <Image
                        src="https://thumbs.dreamstime.com/b/child-reading-under-tree-illustration-332188223.jpg"
                        alt="Child Reading"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[30vh] left-[20vw] w-28 h-36 opacity-60 brightness-200">
                    <Image
                        src="https://thumbs.dreamstime.com/b/child-reading-under-tree-illustration-332188223.jpg"
                        alt="Child Reading"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[60vh] right-[15vw] w-44 h-52 opacity-60 brightness-200">
                    <Image
                        src="https://thumbs.dreamstime.com/b/child-reading-under-tree-illustration-332188223.jpg"
                        alt="Child Reading"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute top-[90vh] right-[25vw] w-36 h-44 opacity-60 brightness-200">
                    <Image
                        src="https://thumbs.dreamstime.com/b/child-reading-under-tree-illustration-332188223.jpg"
                        alt="Child Reading"
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

            <AnimatePresence>
                {showPaymentModal && (
                    <PaymentModal
                        formStep={formStep}
                        formData={formData}
                        selectedCourse={selectedCourse}
                        onClose={() => {
                            setShowPaymentModal(false);
                            setFormStep(1);
                            setFormData({ email: "", name: "", id: "", phone: "" });
                        }}
                        onSubmit={handleFormSubmit}
                        onFormDataChange={handleFormDataChange}
                        onFileChange={handleFileChange}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSuccessDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 w-full max-w-md"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h3>
                                <p className="text-gray-600 mb-6">Thank you for registering for the course. We'll contact you shortly with more details.</p>
                                <button
                                    onClick={() => setShowSuccessDialog(false)}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg
                                        hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}