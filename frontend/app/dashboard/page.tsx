"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiService } from "@/lib/api";

interface ApiUserFields {
  name?: string;
  email?: string;
  phone?: string;
  studentId?: string;
  courses?: string[];
  trips?: string[];
  volunteer?: string[];
}

interface ApiUser {
  fields?: ApiUserFields;
}

interface ApiUserResponse {
  user: ApiUser;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  student_id: string;
  courses?: string[];
  trips?: string[];
  volunteer?: string[];
}

// Skeleton components for loading states
const ProfileSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="text-center mb-6">
      <div className="relative inline-block">
        <div className="w-30 h-30 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
      <div className="pt-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ActivitySkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((section) => (
      <div key={section} className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    student_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      loadUserData();
    }
  }, [session]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.getUserByEmail(session?.user?.email || "");
      
      if (result.success && result.data && typeof result.data === 'object' && 'user' in result.data) {
        const user = (result.data as unknown as ApiUserResponse).user;
        setUserData({
          name: user.fields?.name || session?.user?.name || "",
          email: user.fields?.email || session?.user?.email || "",
          phone: user.fields?.phone || "",
          student_id: user.fields?.studentId || "",
          courses: user.fields?.courses || [],
          trips: user.fields?.trips || [],
          volunteer: user.fields?.volunteer || [],
        });
      } else {
        // If user not found in database, use session data
        setUserData({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          phone: "",
          student_id: "",
          courses: [],
          trips: [],
          volunteer: [],
        });
        if (result.error && result.error !== 'User not found') {
          setError(result.error);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user data");
      // Fallback to session data
      setUserData({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        student_id: "",
        courses: [],
        trips: [],
        volunteer: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const result = await apiService.updateUser({
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        student_id: userData.student_id,
      });

      if (result.success) {
        setIsEditing(false);
        // Reload user data to get the latest from database
        await loadUserData();
      } else {
        setError(result.error || 'Failed to save changes');
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reload original data
    loadUserData();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ProfileSkeleton />
            </div>
            <div className="lg:col-span-2">
              <ActivitySkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your profile and view your activities</p>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg overflow-hidden"
              >
                <p className="text-red-800 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-30 h-30 relative">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={120}
                        height={120}
                        className="rounded-full border-4 border-green-100"
                        priority
                      />
                    ) : (
                      <div className="w-30 h-30 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mt-4">
                  {session?.user?.name || "User"}
                </h2>
                <p className="text-gray-500">{session?.user?.email}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 min-h-[2.5rem] flex items-center">{userData.name || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 min-h-[2.5rem] flex items-center">{userData.phone || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.student_id}
                      onChange={(e) => handleInputChange('student_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 min-h-[2.5rem] flex items-center">{userData.student_id || "Not provided"}</p>
                  )}
                </div>

                <div className="pt-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity History */}
          <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Trip Registrations */}
            <motion.div
              layout
              className="bg-white rounded-xl shadow-lg p-6 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">🚶‍♂️</span>
                  Soul Walks
                </h3>
                <span className="text-sm text-gray-500">{userData.trips?.length || 0} registrations</span>
              </div>
              
              <AnimatePresence mode="wait">
                {userData.trips && userData.trips.length > 0 ? (
                  <motion.div
                    key="trips-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {userData.trips.map((trip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{trip}</p>
                            <p className="text-sm text-gray-500">Soul Walk</p>
                          </div>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Registered</span>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="trips-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="text-4xl mb-2">🚶‍♂️</div>
                    <p className="text-gray-500 mb-4">No soul walks registered yet</p>
                    <a
                      href="/trips"
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Explore Soul Walks
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Course Registrations */}
            <motion.div
              layout
              className="bg-white rounded-xl shadow-lg p-6 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  DivyaVidya Courses
                </h3>
                <span className="text-sm text-gray-500">{userData.courses?.length || 0} registrations</span>
              </div>
              
              <AnimatePresence mode="wait">
                {userData.courses && userData.courses.length > 0 ? (
                  <motion.div
                    key="courses-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {userData.courses.map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{course}</p>
                            <p className="text-sm text-gray-500">Course</p>
                          </div>
                        </div>
                        <span className="text-blue-600 text-sm font-medium">Enrolled</span>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="courses-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="text-4xl mb-2">📚</div>
                    <p className="text-gray-500 mb-4">No courses enrolled yet</p>
                    <a
                      href="/courses"
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Explore Courses
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Volunteer Events */}
            <motion.div
              layout
              className="bg-white rounded-xl shadow-lg p-6 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">🤝</span>
                  Volunteer Events
                </h3>
                <span className="text-sm text-gray-500">{userData.volunteer?.length || 0} events</span>
              </div>
              
              <AnimatePresence mode="wait">
                {userData.volunteer && userData.volunteer.length > 0 ? (
                  <motion.div
                    key="volunteer-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {userData.volunteer.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-sm font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{event}</p>
                            <p className="text-sm text-gray-500">Volunteer Role</p>
                          </div>
                        </div>
                        <span className="text-purple-600 text-sm font-medium">Applied</span>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="volunteer-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="text-4xl mb-2">🤝</div>
                    <p className="text-gray-500 mb-4">No volunteer roles applied yet</p>
                    <p className="text-sm text-gray-400">
                      Volunteer opportunities will be available soon
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
