"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ExtendedSession } from "../api/auth/[...nextauth]/route";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Array<{
    date: string;
    rounds: number;
    reading_time: number;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({
    rounds: '',
    reading_time: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserStats();
    }
  }, [status, router]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/post-sadhana/', {
        headers: {
          'Authorization': `Bearer ${(session as ExtendedSession)?.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      const requestData = {
        date: today,
        rounds: parseInt(formData.rounds),
        reading_time: parseInt(formData.reading_time)
      };

      console.log('Access Token:', (session as ExtendedSession)?.accessToken);
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as ExtendedSession)?.accessToken}`
      };
      console.log('Request Headers:', headers);

      const response = await fetch('http://127.0.0.1:8000/auth/post-sadhana/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit stats');
      }

      setMessage({ text: 'Stats recorded successfully!', type: 'success' });
      setFormData({ rounds: '', reading_time: '' });
      
      // Update stats immediately with the new data
      if (data.data) {
        setStats(prevStats => [...prevStats, data.data]);
      }
    } catch (error) {
      console.error('Error submitting stats:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to submit stats', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Sadhana Tracker</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="rounds" className="block text-sm font-medium text-gray-700">
                Rounds Meditated
              </label>
              <input
                type="number"
                id="rounds"
                value={formData.rounds}
                onChange={(e) => setFormData(prev => ({ ...prev, rounds: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>

            <div>
              <label htmlFor="reading_time" className="block text-sm font-medium text-gray-700">
                Reading Time (min)
              </label>
              <input
                type="number"
                id="reading_time"
                value={formData.reading_time}
                onChange={(e) => setFormData(prev => ({ ...prev, reading_time: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? 'Recording...' : 'Record Stats'}
            </motion.button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Stats</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rounds</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reading Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.map((stat, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.rounds}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.reading_time} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
