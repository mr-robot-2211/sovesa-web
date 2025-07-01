"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  originalPrice?: number;
  discount?: number;
  quantity: number;
}

const CATEGORIES = [
  { key: "all", name: "All Items", icon: "🛍️" },
  { key: "clothing", name: "Clothing", icon: "👘" },
  { key: "beads", name: "Chanting Beads", icon: "📿" },
  { key: "books", name: "Sacred Books", icon: "📚" },
  { key: "decor", name: "Home Decor", icon: "🏺" },
  { key: "incense", name: "Incense & Oils", icon: "🕉️" },
];

// Comment out or remove the static PRODUCTS array
// const PRODUCTS: Product[] = [ ... ];

const testimonials = [
  {
    quote: "The products here are so unique and high quality! I love shopping at Divine Bazaar.",
    name: "Aditi Sharma",
    role: "Student",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "Fast delivery and beautiful packaging. The mug is my new favorite!",
    name: "Rahul Verma",
    role: "Designer",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "I always find something special here. The notebook is perfect for my notes.",
    name: "Priya Nair",
    role: "Writer",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

export default function DivineBazaar() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [cart, setCart] = useState<Record<number, { product: Product; quantity: number }>>({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState<null | { mode: "cart" | "buy"; product?: Product; quantity?: number }>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "thankyou">("form");
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", phone: "" });
  const { data: session } = useSession();
  const [paymentType, setPaymentType] = useState<'cod' | 'online'>('cod');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [address, setAddress] = useState('');
  const [bitsDelivery, setBitsDelivery] = useState(false);
  const [bawanName, setBawanName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const CARDS_PER_PAGE_MOBILE = 2;

  // Fetch products from API
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        // Teable returns { records: [...] }
        const records = data.records || [];
        // Map Teable fields to Product interface
        const mappedProducts = records.map((rec: any) => ({
          id: rec.id,
          name: rec.fields['Item '] || "Unnamed Product",
          description: '', // No description field in provided columns
          price: Number(rec.fields['Price'] || 0),
          image: "🛍️", // Default icon, as no image field is provided
          category: "other", // No category field provided
          rating: 0, // No rating field provided
          reviews: 0, // No reviews field provided
          inStock: true, // Assume in stock
          originalPrice: undefined, // No original price field
          discount: rec.fields['Discount'] ? Number(rec.fields['Discount']) : undefined,
          quantity: rec.fields['Quantity'] ? Number(rec.fields['Quantity']) : 1,
        }));
        setProducts(mappedProducts);
        // Set default quantities for each product
        setQuantities(mappedProducts.reduce((acc: Record<number, number>, p: Product) => ({ ...acc, [p.id]: 1 }), {}));
      });
  }, []);

  // Replace all references to PRODUCTS with products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popular":
      default:
        return b.reviews - a.reviews;
    }
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const paginatedProducts = isMobile
    ? sortedProducts.slice(page * CARDS_PER_PAGE_MOBILE, (page + 1) * CARDS_PER_PAGE_MOBILE)
    : sortedProducts;

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const prevQty = prev[product.id]?.quantity || 0;
      const addQty = quantities[product.id];
      return {
        ...prev,
        [product.id]: { product, quantity: Math.min(product.quantity, prevQty + addQty) }
      };
    });
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleCartQuantityChange = (productId: number, value: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Number(value)
      }
    }));
  };

  const handleBuyNow = (product: Product) => {
    setShowCheckout({ mode: "buy", product, quantity: quantities[product.id] });
    setCheckoutStep("form");
    setCheckoutForm({ name: "", email: "", phone: "" });
  };

  const handleCheckout = () => {
    setShowCheckout({ mode: "cart" });
    setCheckoutStep("form");
    setCheckoutForm({ name: "", email: "", phone: "" });
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("thankyou");
    if (showCheckout?.mode === "cart") setCart({});
  };

  const cartTotal = Object.values(cart).reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pb-16 overflow-hidden">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
          >
            <motion.div
              className="bg-gray-100 rounded-3xl shadow-2xl max-w-lg w-full relative z-50 flex flex-col"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-3xl px-8 py-5 flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                <button className="text-white text-2xl font-bold hover:opacity-80" onClick={() => setShowCart(false)}>&times;</button>
              </div>
              {Object.keys(cart).length === 0 ? (
                <p className="text-gray-500 text-center py-12">Your cart is empty.</p>
              ) : (
                <div className="flex-1 overflow-y-auto px-6 py-2">
                  {Object.values(cart).map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between gap-4 py-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <span className="text-7xl mb-6 flex items-center justify-center w-48 h-48 rounded-2xl border border-gray-700 bg-[#101c3c]">
                          {product.image}
                        </span>
                        <div>
                          <div className="font-semibold text-lg text-gray-900 mb-1">{product.name}</div>
                          <div className="text-gray-500 text-sm">{formatPrice(product.price)}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[100px]">
                        <select
                          className="border rounded px-2 py-1"
                          value={quantity}
                          onChange={e => handleCartQuantityChange(product.id, e.target.value)}
                        >
                          {Array.from({ length: product.quantity }, (_, i) => i + 1).map(qty => (
                            <option key={qty} value={qty}>{qty}</option>
                          ))}
                        </select>
                        <button
                          className="text-red-500 hover:bg-red-100 hover:text-red-700 px-3 py-1 rounded transition text-xs font-semibold"
                          onClick={() => handleRemoveFromCart(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Sticky Footer */}
              <div className="sticky bottom-0 left-0 right-0 bg-gray-50 rounded-b-3xl px-8 py-5 mt-4 shadow-inner border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg text-gray-900">Total:</span>
                  <span className="font-bold text-lg text-blue-700">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex gap-4">
                  <button
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold transition text-lg"
                    onClick={() => { setShowCart(false); handleCheckout(); }}
                    disabled={Object.keys(cart).length === 0}
                  >
                    Checkout
                  </button>
                  <button
                    className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold transition text-lg"
                    onClick={() => setShowCart(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCheckout(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-[#0a1833] via-[#13294b] to-[#223a63] rounded-xl shadow-2xl max-w-2xl w-full relative z-50 flex flex-col p-0"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ boxShadow: '0 8px 32px 0 rgba(12,33,86,0.18)' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0a1833] to-[#13294b] rounded-t-xl px-8 py-6 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🛍️</span>
                  <h2 className="text-2xl font-extrabold text-white tracking-wide">Checkout</h2>
                </div>
                <button className="text-white text-2xl font-bold hover:opacity-80" onClick={() => setShowCheckout(null)}>&times;</button>
              </div>
              {checkoutStep === "form" ? (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6 px-6 pb-6 pt-2 text-white">
                  {/* Order Summary */}
                  <div className="bg-[#13294b] rounded-xl shadow p-4 mb-4">
                    <div className="font-semibold mb-3 text-blue-200">Order Summary</div>
                    {(showCheckout.mode === 'cart' ? Object.values(cart) : [{ product: showCheckout.product, quantity: showCheckout.quantity }]).map(({ product, quantity }) => (
                      <div key={product?.id ?? 'unknown'} className="flex items-center justify-between text-blue-100 text-sm mb-3">
                        <div className="flex items-center gap-3">
                          <span>{product?.name ?? 'Unknown'} × {quantity ?? 1}</span>
                        </div>
                        <span>{formatPrice((product?.price ?? 0) * (quantity ?? 1))}</span>
                      </div>
                    ))}
                    {/* Delivery Fee */}
                    <div className="flex justify-between items-center text-blue-200 text-sm mb-1">
                      <span>Delivery Fee</span>
                      <span>{bitsDelivery ? 'Free' : formatPrice(50)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-base mt-4 border-t pt-3 border-blue-900">
                      <span className="text-blue-200">Total</span>
                      <span className="text-blue-400 text-lg">
                        {showCheckout.mode === 'cart'
                          ? formatPrice(cartTotal + (bitsDelivery ? 0 : 50))
                          : formatPrice((showCheckout.product?.price ?? 0) * (showCheckout.quantity ?? 1) + (bitsDelivery ? 0 : 50))}
                      </span>
                    </div>
                  </div>
                  {/* Two-column layout for form fields on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column: User info and BITS/Address */}
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        className="w-full border rounded-lg pl-4 pr-4 py-2 bg-[#13294b] text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        value={session?.user?.name || checkoutForm.name}
                        onChange={e => setCheckoutForm(f => ({ ...f, name: e.target.value }))}
                        required
                        disabled={!!session?.user?.name}
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        className="w-full border rounded-lg pl-4 pr-4 py-2 bg-[#13294b] text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        value={checkoutForm.phone}
                        onChange={e => setCheckoutForm(f => ({ ...f, phone: e.target.value }))}
                        required
                      />
                      {!session?.user && (
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full border rounded-lg pl-4 pr-4 py-2 bg-[#13294b] text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                          value={checkoutForm.email}
                          onChange={e => setCheckoutForm(f => ({ ...f, email: e.target.value }))}
                          required
                        />
                      )}
                      {/* BITS Pilani Campus Delivery Checkbox */}
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="bitsDelivery"
                          checked={bitsDelivery}
                          onChange={e => setBitsDelivery(e.target.checked)}
                          className="accent-blue-500"
                        />
                        <label htmlFor="bitsDelivery" className="text-blue-100 font-medium">BITS Pilani Campus Delivery (Free)</label>
                      </div>
                      {/* Bawan/Room or Address */}
                      {bitsDelivery ? (
                        <>
                          <input
                            type="text"
                            placeholder="Bawan Name (e.g. Vishwakarma)"
                            className="w-full border rounded-lg pl-4 pr-4 py-2 bg-[#13294b] text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            value={bawanName}
                            onChange={e => setBawanName(e.target.value)}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Room Number"
                            className="w-full border rounded-lg pl-4 pr-4 py-2 bg-[#13294b] text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            value={roomNumber}
                            onChange={e => setRoomNumber(e.target.value)}
                            required
                          />
                        </>
                      ) : (
                        <div>
                          <label className="font-semibold text-blue-200 mb-1 block">Delivery Address</label>
                          <textarea
                            className="w-full border rounded-lg px-4 py-2 bg-[#13294b] text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                            rows={2}
                            placeholder="Enter your full address"
                          />
                        </div>
                      )}
                    </div>
                    {/* Right column: Payment type and QR/upload */}
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold text-blue-200 mb-2">Payment Type</div>
                      <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentType"
                            value="cod"
                            checked={paymentType === 'cod'}
                            onChange={() => setPaymentType('cod')}
                            className="accent-blue-500"
                          />
                          <span className="text-blue-100">Cash on Delivery</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentType"
                            value="online"
                            checked={paymentType === 'online'}
                            onChange={() => setPaymentType('online')}
                            className="accent-blue-500"
                          />
                          <span className="text-blue-100">Online Payment</span>
                        </label>
                      </div>
                      {paymentType === 'online' && (
                        <div className="bg-[#223a63] rounded-lg border border-blue-900 flex flex-col items-center mb-2 p-4 shadow-sm">
                          <div className="font-semibold text-blue-200 mb-1">Scan QR to Pay</div>
                          <img src="/public/images/qr-placeholder.png" alt="QR Code" className="w-40 h-40 rounded-lg border mb-2 bg-white" />
                          <label className="block text-sm text-blue-100 mb-1 mt-2">Upload Payment Screenshot</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setPaymentScreenshot(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-blue-200 bg-[#13294b] border border-blue-900 rounded"
                          />
                          {paymentScreenshot && (
                            <img
                              src={URL.createObjectURL(paymentScreenshot)}
                              alt="Payment Screenshot"
                              className="w-32 h-32 mt-2 rounded-lg border"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold transition text-lg shadow-lg hover:opacity-90 hover:scale-105"
                    >
                      Place Order
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-3 rounded-lg bg-blue-900 text-blue-100 font-semibold transition text-lg shadow hover:bg-blue-800"
                      onClick={() => setShowCheckout(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎉</div>
                  <div className="text-2xl font-bold mb-2 text-blue-200">Thank you for your order!</div>
                  <div className="text-blue-100 mb-6">We have received your details and will contact you soon.</div>
                  <button
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold transition text-lg"
                    onClick={() => setShowCheckout(null)}
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-14 text-center flex flex-col items-center">
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-10 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Divine Bazaar
        </motion.h1>
        {/* Cart and Checkout Buttons */}
        <div className="flex gap-6">
          <button
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium
              hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl
              transform hover:scale-105 text-lg flex items-center gap-2"
            onClick={() => setShowCart(true)}
          >
            <span role="img" aria-label="cart">🛒</span>
            Cart
          </button>
          <button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-medium
              hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl
              transform hover:scale-105 text-lg flex items-center gap-2"
            onClick={handleCheckout}
          >
            <span role="img" aria-label="checkout">💳</span>
            Checkout
          </button>
        </div>
      </section>
      {/* Gradient Divider */}
      <div className="w-full h-1 my-0" style={{background: 'linear-gradient(90deg, #2563eb 0%, #9333ea 100%)', height: '5px'}} />
      {/* Product Grid */}
      <section id="products" className="max-w-6xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {paginatedProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              className="bg-[#0a183d] border border-blue-900 rounded-2xl shadow-xl p-6 min-h-[420px] flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="flex flex-col items-center w-full flex-1">
                <span className="text-7xl mb-6 flex items-center justify-center w-48 h-48 rounded-2xl border border-gray-700 bg-[#101c3c]">
                  {product.image}
                </span>
                <h2 className="text-2xl font-semibold mb-4 text-center text-blue-100">{product.name}</h2>
              </div>
              {/* Action Buttons at the bottom, always at constant height */}
              <div className="flex w-full mt-2 items-center gap-2 min-h-[60px]">
                {cart[product.id] ? (
                  <>
                    <button
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-pink-500 text-white hover:opacity-90 font-semibold transition text-lg shadow-md"
                      onClick={() => handleRemoveFromCart(product.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-500 text-white hover:opacity-90 font-semibold transition text-lg shadow-md"
                      onClick={() => setCart({})}
                    >
                      Discard All
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 text-white hover:opacity-90 font-semibold transition text-lg shadow-md"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                    </button>
                    <button
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 text-white hover:opacity-90 font-semibold transition text-lg shadow-md"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </>
                )}
                <select
                  className="w-16 py-2 px-2 rounded-lg bg-gradient-to-r from-[#13294b] to-[#223a63] text-blue-100 border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2 font-semibold shadow-md"
                  value={quantities[product.id]}
                  onChange={e => setQuantities(q => ({ ...q, [product.id]: Number(e.target.value) }))}
                >
                  {[1,2,3,4,5].map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Pagination for mobile */}
        {isMobile && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 rounded bg-blue-900 text-white font-semibold disabled:opacity-50"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-900 text-white font-semibold disabled:opacity-50"
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * CARDS_PER_PAGE_MOBILE >= sortedProducts.length}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function formatPrice(price: number) {
  return `₹${price}`;
} 