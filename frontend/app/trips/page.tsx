"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

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
    selectedTrip,
    onClose,
    onSubmit,
    onFormDataChange,
    onFileChange
}: {
    formStep: number;
    formData: PaymentFormData;
    selectedTrip: any;
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
                            <p className="text-gray-600 mb-4">Please scan the QR code below and make the payment of {selectedTrip?.fields["price"] || "specified amount"}</p>
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

export default function Trips() {
    // All hooks must be called before any conditional returns
    const [trips, setTrips] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [selectedTrip, setSelectedTrip] = useState<any>(null);
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

    const handleCardExpand = (tripId: string) => {
        setExpandedCard(expandedCard === tripId ? null : tripId);
    };

    const handleJoinNow = (trip: any) => {
        setSelectedTrip(trip);
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
            if (!selectedTrip) {
                console.error('No trip selected');
                setSubmissionStatus(prev => ({
                    ...prev,
                    error: "No trip selected. Please try again."
                }));
                return;
            }

            console.log('Selected Trip Full Object:', selectedTrip);
            console.log('Selected Trip ID:', selectedTrip.id);
            console.log('Selected Trip Fields:', selectedTrip.fields);

            const jsonData = {
                email: formData.email,
                name: formData.name,
                student_id: formData.id,
                phone: formData.phone,
                tripId: selectedTrip.fields.id || selectedTrip.id
            };

            console.log('Form Data:', formData);
            console.log('JSON Data being sent:', jsonData);

            setSubmissionStatus(prev => ({ ...prev, loading: true, error: null }));

            // Send the form data to the backend
            fetch('http://127.0.0.1:8000/api/trips-registration/', {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            })
            .then(async response => {
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    console.error('API Error Response:', errorData);
                    throw new Error(errorData?.detail || `HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                setShowPaymentModal(false);
                setFormStep(1);
                // Reset form data
                setFormData({
                    email: "",
                    name: "",
                    id: "",
                    phone: "",
                });
                // Show success dialog
                setShowSuccessDialog(true);
                // Hide success dialog after 5 seconds
                setTimeout(() => {
                    setShowSuccessDialog(false);
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                setSubmissionStatus(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message || "Failed to submit form. Please try again."
                }));
            });
        }
    }, [formStep, formData, selectedTrip]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setFormData(prev => ({ ...prev, paymentScreenshot: files[0] }));
    }, []);

    const closeModal = useCallback(() => {
        setShowPaymentModal(false);
        setFormStep(1);
        setFormData({
            email: "",
            name: "",
            id: "",
            phone: "",
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
            className={`relative w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-lg 
                flex flex-col lg:flex-row overflow-hidden
                ${index % 2 === 0 ? 'lg:mr-auto' : 'lg:ml-auto'}`}
            initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
        >
            <div className={`relative w-full lg:w-1/2 aspect-video lg:aspect-auto min-h-[300px] ${index % 2 === 0 ? 'lg:order-first' : 'lg:order-last'}`}>
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
                className={`w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center 
                    ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 
                    text-indigo-600 text-sm mb-6 w-fit font-medium`}>
                    {trip.fields["Date"]}
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent 
                    bg-gradient-to-r from-blue-600 to-purple-600">
                    {trip.fields["trip-title"]}
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4">
                    {trip.fields["trip-sub-title"]}
                </p>
                <p className={`text-gray-600 mb-8 ${expandedCard === trip.id ? '' : 'line-clamp-3'}`}>
                    {trip.fields["trip-description"]}
                </p>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => expandedCard === trip.id ? handleJoinNow(trip) : handleCardExpand(trip.id)}
                    className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full 
                        hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-fit"
                >
                    {expandedCard === trip.id ? "Join Now!" : "View More"}
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
                    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24">
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

            {/* Success Dialog */}
            {showSuccessDialog && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                            <p className="text-gray-600 mb-6">
                                Thank you for registering. We will contact you soon with further details about your trip.
                            </p>
                            <button
                                onClick={() => setShowSuccessDialog(false)}
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium 
                                    hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {formStep === 1 ? "Personal Details" : "Registration Confirmation"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setFormStep(1);
                                    setFormData({
                                        email: "",
                                        name: "",
                                        id: "",
                                        phone: "",
                                    });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {formStep === 1 ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData((prev: FormData) => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                            disabled={submissionStatus.loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData((prev: FormData) => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                            disabled={submissionStatus.loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">ID Number</label>
                                        <input
                                            type="text"
                                            value={formData.id}
                                            onChange={(e) => setFormData((prev: FormData) => ({ ...prev, id: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                            disabled={submissionStatus.loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData((prev: FormData) => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                            disabled={submissionStatus.loading}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium 
                                                hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={submissionStatus.loading}
                                        >
                                            {submissionStatus.loading ? "Processing..." : "Next"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Summary</h3>
                                        <div className="space-y-2">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Email:</span> {formData.email}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Name:</span> {formData.name}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">ID Number:</span> {formData.id}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Phone:</span> {formData.phone}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Trip:</span> {selectedTrip.fields["trip-title"]}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setFormStep(1)}
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium 
                                                hover:bg-gray-50 transition-all duration-300"
                                            disabled={submissionStatus.loading}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium 
                                                hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={submissionStatus.loading}
                                        >
                                            {submissionStatus.loading ? "Submitting..." : "Confirm Registration"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        {submissionStatus.error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 text-center text-red-500 text-sm"
                            >
                                {submissionStatus.error}
                            </motion.p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
