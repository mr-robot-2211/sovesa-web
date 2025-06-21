"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}

const CATEGORIES = [
  { key: "all", name: "All Items", icon: "🛍️" },
  { key: "clothing", name: "Clothing", icon: "👘" },
  { key: "beads", name: "Chanting Beads", icon: "📿" },
  { key: "books", name: "Sacred Books", icon: "📚" },
  { key: "decor", name: "Home Decor", icon: "🏺" },
  { key: "incense", name: "Incense & Oils", icon: "🕉️" },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Pure Cotton Dhoti",
    description: "Traditional handwoven cotton dhoti for daily wear and ceremonies",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    image: "👘",
    category: "clothing",
    rating: 4.8,
    reviews: 127,
    inStock: true,
  },
  {
    id: 2,
    name: "Tulasi Mala (108 beads)",
    description: "Sacred tulasi wood chanting beads, handcrafted with devotion",
    price: 1499,
    image: "📿",
    category: "beads",
    rating: 4.9,
    reviews: 89,
    inStock: true,
  },
  {
    id: 3,
    name: "Bhagavad Gita Hardcover",
    description: "Beautifully bound Bhagavad Gita with Sanskrit and English text",
    price: 599,
    originalPrice: 799,
    discount: 25,
    image: "📚",
    category: "books",
    rating: 4.7,
    reviews: 203,
    inStock: true,
  },
  {
    id: 4,
    name: "Brass Diya Set",
    description: "Traditional brass oil lamps for aarti and home decoration",
    price: 399,
    image: "🏺",
    category: "decor",
    rating: 4.6,
    reviews: 156,
    inStock: true,
  },
  {
    id: 5,
    name: "Sandalwood Incense Sticks",
    description: "Pure sandalwood incense sticks, pack of 50",
    price: 299,
    image: "🕉️",
    category: "incense",
    rating: 4.5,
    reviews: 342,
    inStock: true,
  },
  {
    id: 6,
    name: "Silk Kurta Set",
    description: "Elegant silk kurta with matching dhoti for special occasions",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    image: "👘",
    category: "clothing",
    rating: 4.8,
    reviews: 67,
    inStock: true,
  },
  {
    id: 7,
    name: "Rudraksha Mala",
    description: "Authentic 5-mukhi rudraksha beads for meditation",
    price: 899,
    image: "📿",
    category: "beads",
    rating: 4.9,
    reviews: 134,
    inStock: true,
  },
  {
    id: 8,
    name: "Srimad Bhagavatam",
    description: "Complete 12-volume set of Srimad Bhagavatam",
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    image: "📚",
    category: "books",
    rating: 4.8,
    reviews: 45,
    inStock: true,
  },
  {
    id: 9,
    name: "Copper Kalash",
    description: "Traditional copper kalash for religious ceremonies",
    price: 1299,
    image: "🏺",
    category: "decor",
    rating: 4.7,
    reviews: 78,
    inStock: true,
  },
  {
    id: 10,
    name: "Guggulu Incense",
    description: "Sacred guggulu resin incense for purification",
    price: 449,
    image: "🕉️",
    category: "incense",
    rating: 4.6,
    reviews: 92,
    inStock: true,
  },
  {
    id: 11,
    name: "Cotton Angavastram",
    description: "Traditional cotton upper garment for temple visits",
    price: 699,
    image: "👘",
    category: "clothing",
    rating: 4.5,
    reviews: 113,
    inStock: true,
  },
  {
    id: 12,
    name: "Crystal Mala",
    description: "Clear quartz crystal mala for healing and meditation",
    price: 1799,
    image: "📿",
    category: "beads",
    rating: 4.8,
    reviews: 67,
    inStock: true,
  },
];

export default function DivineBazaar() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const filteredProducts = PRODUCTS.filter(product => {
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

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartItemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((total, [productId, count]) => {
    const product = PRODUCTS.find(p => p.id === parseInt(productId));
    return total + (product?.price || 0) * count;
  }, 0);

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛍️</span>
              <h1 className="text-2xl font-bold text-green-700">Divine Bazaar</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for spiritual items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Cart */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <span>🛒</span>
                <span>Cart ({cartItemCount})</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  selectedCategory === category.key
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort and Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {PRODUCTS.length} items
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                  <span className="text-6xl">{product.image}</span>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                    {product.discount && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-green-700">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <div className="flex items-center gap-2">
                    {cart[product.id] ? (
                      <>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="flex-1 py-2 px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          Remove
                        </button>
                        <span className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-bold">
                          {cart[product.id]}
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Cart Summary Modal */}
        {cartItemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-6 border border-gray-200 max-w-sm"
          >
            <h3 className="font-bold text-lg mb-3">Cart Summary</h3>
            <div className="space-y-2 mb-4">
              {Object.entries(cart).map(([productId, count]) => {
                const product = PRODUCTS.find(p => p.id === parseInt(productId));
                return (
                  <div key={productId} className="flex justify-between items-center">
                    <span className="text-sm">{product?.name}</span>
                    <span className="text-sm font-bold">₹{product?.price} × {count}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
            <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
              Proceed to Checkout
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 