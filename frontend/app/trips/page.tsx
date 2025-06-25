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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => onFormDataChange('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input
                                type="text"
                                required
                                value={formData.id}
                                onChange={(e) => onFormDataChange('id', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => onFormDataChange('phone', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg
                        hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {formStep === 1 ? "Next" : "Submit"}
                </button>
            </form>
        </motion.div>
    </motion.div>
);

export default function SoulWalks() {
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
    const [paymentFile, setPaymentFile] = useState<File | null>(null);
    
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
        setFormData({
            email: "",
            name: "",
            id: "",
            phone: "",
        });
    };

    const handleFormDataChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formStep === 1) {
            setFormStep(2);
        } else {
            setSubmissionStatus({ loading: true, error: null, success: false });
            try {
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    student_id: formData.id,
                    tripId: selectedTrip && selectedTrip.fields && selectedTrip.fields["trip-title"] ? selectedTrip.fields["trip-title"] : undefined
                };
                const response = await fetch('http://localhost:8000/api/trips-registration/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Submission failed');
                }
                setSubmissionStatus({ loading: false, error: null, success: true });
                setShowSuccessDialog(true);
                setShowPaymentModal(false);
            } catch (err: any) {
                setSubmissionStatus({ loading: false, error: err.message, success: false });
            }
        }
    };

    const handleCloseModal = () => {
        setShowPaymentModal(false);
        setFormStep(1);
        setFormData({
            email: "",
            name: "",
            id: "",
            phone: "",
        });
    };

    // Render functions
    const renderLoading = () => (
        <div className="h-screen w-screen flex items-center justify-center bg-[#f7f6f2] relative overflow-hidden">
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
                        className="w-16 h-16 rounded-full border-2 border-gray-200 border-t-green-600"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    
                    {/* Inner pulsing dot */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-600 rounded-full -translate-x-1/2 -translate-y-1/2"
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
                    <span className="text-green-700 text-sm font-light tracking-[0.2em]">PREPARING</span>
                    <span className="text-gray-500 text-xs font-light tracking-wider">YOUR SOUL WALK</span>
                </div>
            </motion.div>
        </div>
    );

    const renderError = () => (
        <div className="h-screen w-screen flex items-center justify-center bg-[#f7f6f2] text-gray-800 p-4">
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
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 
                    text-green-600 text-sm mb-6 w-fit font-medium`}>
                    {trip.fields["Date"]}
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent 
                    bg-gradient-to-r from-green-600 to-emerald-600">
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
                    className="px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-full 
                        hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-fit"
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
        <div className="bg-[#f7f6f2] min-h-screen overflow-x-hidden relative">
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
                    className="fixed top-20 left-0 right-0 h-[20vh] sm:h-[25vh] flex items-center justify-center z-[5]"
                    style={{ opacity: headerOpacity }}
                >
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent 
                            bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                            Soul Walks
                        </h1>
                        <p className="text-gray-600 text-lg sm:text-xl">
                            Embark on spiritual journeys that transform your soul
                        </p>
                    </div>
                </motion.div>

                <div className="space-y-16 sm:space-y-20 lg:space-y-24 pt-[25vh] sm:pt-[30vh] pb-16">
                    {trips.map((trip, index) => renderTrip(trip, index))}
                </div>
            </motion.div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <PaymentModal
                        formStep={formStep}
                        formData={formData}
                        selectedTrip={selectedTrip}
                        onClose={handleCloseModal}
                        onSubmit={handleSubmit}
                        onFormDataChange={handleFormDataChange}
                        onFileChange={handleFileChange}
                    />
                )}
            </AnimatePresence>

            {/* Success Dialog */}
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
                            className="bg-white rounded-xl p-8 max-w-md text-center"
                        >
                            <div className="text-green-500 text-6xl mb-4">✅</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h3>
                            <p className="text-gray-600 mb-6">
                                Your soul walk booking has been confirmed. We'll contact you soon with further details.
                            </p>
                            <button
                                onClick={() => setShowSuccessDialog(false)}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
