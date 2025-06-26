"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_date: string;
  slug: string;
  image_url?: string;
}

export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/blog/');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      setPosts(data.records || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setLoading(false);
    }
  };

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-gray-200 border-t-green-600"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
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
            <span className="text-green-700 text-sm font-light tracking-[0.2em]">LOADING</span>
            <span className="text-gray-500 text-xs font-light tracking-wider">ANNOUNCEMENTS</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center p-4">
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
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      {/* Daily Announcements Feed */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📢</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Announcements Today</h2>
            <p className="text-gray-600">Check back later for today's spiritual message</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openPost(post)}
              >
                {/* Post Header */}
                <div className="p-6 border-b border-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.author}</p>
                        <p className="text-sm text-gray-500">{getTimeAgo(post.published_date)}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                      Daily Message
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                </div>

                {/* Post Content Preview */}
                <div className="p-6">
                  {/* Image if available */}
                  {post.image_url && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content Preview */}
                  <div className="prose prose-sm max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: post.excerpt || post.content.substring(0, 200) + '...' 
                      }} 
                    />
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <button className="text-green-600 font-medium text-sm hover:text-green-700 transition flex items-center gap-1">
                      Read Full Message
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="text-xs text-gray-400">
                      Click to view & discuss
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {showModal && selectedPost && (
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
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedPost.author}</p>
                        <p className="text-sm text-gray-500">{formatDate(selectedPost.published_date)}</p>
                      </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {selectedPost.title}
                    </h1>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Post Image */}
                {selectedPost.image_url && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={selectedPost.image_url}
                      alt={selectedPost.title}
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Post Content */}
                <article className="prose prose-lg max-w-none mb-8">
                  <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                </article>

                {/* Comments Section */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Share Your Thoughts</h2>
                  <div id="giscus-container" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Giscus Script */}
      {showModal && selectedPost && (
        <GiscusComments postSlug={selectedPost.slug} />
      )}
    </div>
  );
}

// Giscus Comments Component
function GiscusComments({ postSlug }: { postSlug: string }) {
  useEffect(() => {
    // Remove existing script if any
    const existingScript = document.querySelector('script[src="https://giscus.app/client.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'yourusername/blog-comments'); // Replace with your repo
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // Replace with your repo ID
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // Replace with your category ID
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    // Append to container
    const container = document.getElementById('giscus-container');
    if (container) {
      container.appendChild(script);
    }

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[src="https://giscus.app/client.js"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [postSlug]);

  return null;
}
