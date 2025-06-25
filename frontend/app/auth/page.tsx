"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Types
type AuthType = "login" | "signup";

// Components
const AuthButton = ({ 
  type, 
  onClick, 
  isLoading 
}: { 
  type: AuthType; 
  onClick: () => void; 
  isLoading: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={isLoading}
    className={`flex-1 py-3 bg-gradient-to-r ${
      type === "login" 
        ? "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
        : "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
    } text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg
    disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {isLoading ? "Loading..." : type === "login" ? "Login" : "Sign Up"}
  </motion.button>
);

const AuthInput = ({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  disabled 
}: { 
  type: "email" | "password"; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder: string; 
  disabled: boolean;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {type === "email" ? "Email" : "Password"}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
      placeholder={placeholder}
      disabled={disabled}
      suppressHydrationWarning
    />
  </div>
);

// Main Component
export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {data: session} = useSession();
  const isSadhaka = session?.user?.is_sadhaka;
  const isLoggedIn=!!session;

  const handleAuth = async (type: AuthType) => {
    setIsLoading(true);
    setMessage("");

    try {
      if (type === "login") {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setMessage(result.error);
          return;
        }

        if(isLoggedIn && isSadhaka){
          router.push("/dashboard");
        }else{
          router.push("/");
        }
      } else {
        const res = await fetch(`http://127.0.0.1:8000/auth/signup/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        
        if (res.ok) {
          const tableRes = await fetch(`http://127.0.0.1:8000/api/sadhana-report/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const tableData = await tableRes.json();
          if (!tableRes.ok) {
            console.warn("Failed to create sadhaka report table:", tableData.error);
          }
          
          setMessage(data.message || "Signup successful");
        } else {
          setMessage(data.error || "Signup failed");
        }
      }
    } catch (error) {
      setMessage("An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        {/* Shield Symbol */}
        <div className="absolute top-[10vh] left-[5vw] w-32 h-32 opacity-20 transform rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1 0L3.75 5.25a.75.75 0 00-.516.697v.037c0 .483.097.96.285 1.398.188.439.465.84.82 1.18.354.34.78.614 1.26.81.48.197 1.002.312 1.54.34.538.028 1.08-.033 1.61-.18.53-.147 1.04-.38 1.51-.69.47-.31.89-.7 1.25-1.15.36-.45.65-.96.86-1.5.21-.54.34-1.12.37-1.7.03-.58-.03-1.16-.19-1.71-.16-.55-.41-1.06-.74-1.52-.33-.46-.74-.86-1.21-1.19-.47-.33-1-.58-1.56-.73-.56-.15-1.15-.2-1.74-.15-.59.05-1.17.2-1.71.44-.54.24-1.03.57-1.47.98-.44.41-.82.9-1.12 1.45-.3.55-.52 1.15-.64 1.78-.12.63-.15 1.28-.09 1.93.06.65.22 1.29.47 1.89.25.6.59 1.16 1.01 1.66.42.5.92.93 1.48 1.28.56.35 1.17.61 1.82.77.65.16 1.33.22 2.01.18.68-.04 1.35-.19 1.98-.44.63-.25 1.22-.6 1.75-1.03.53-.43.99-.95 1.37-1.53.38-.58.67-1.22.85-1.9.18-.68.26-1.39.23-2.1-.03-.71-.17-1.41-.41-2.07-.24-.66-.58-1.28-1-1.84-.42-.56-.92-1.05-1.49-1.45-.57-.4-1.21-.71-1.89-.92-.68-.21-1.4-.32-2.13-.32-.73 0-1.45.11-2.13.32-.68.21-1.32.52-1.89.92-.57.4-1.07.89-1.49 1.45-.42.56-.76 1.18-1 1.84-.24.66-.38 1.36-.41 2.07-.03.71.05 1.42.23 2.1.18.68.47 1.32.85 1.9.38.58.84 1.1 1.37 1.53.53.43 1.12.78 1.75 1.03.63.25 1.3.4 1.98.44.68.04 1.36-.02 2.01-.18.65-.16 1.26-.42 1.82-.77.56-.35 1.06-.78 1.48-1.28.42-.5.76-1.06 1.01-1.66.25-.6.41-1.24.47-1.89.06-.65.03-1.3-.09-1.93-.12-.63-.34-1.23-.64-1.78-.3-.55-.68-1.04-1.12-1.45-.44-.41-.93-.74-1.47-.98-.54-.24-1.12-.39-1.71-.44-.59-.05-1.18 0-1.74.15-.56.15-1.09.4-1.56.73-.47.33-.88.73-1.21 1.19-.33.46-.58.97-.74 1.52-.16.55-.22 1.13-.19 1.71.03.58.16 1.16.37 1.7.21.54.5 1.05.86 1.5.36.45.78.84 1.25 1.15.47.31.98.54 1.51.69.53.15 1.07.21 1.61.18.54-.03 1.06-.14 1.54-.34.48-.2.91-.47 1.26-.81.35-.34.63-.74.82-1.18.19-.44.29-.92.29-1.4v-.037a.75.75 0 00-.516-.697L12.516 2.17z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Lock Symbol */}
        <div className="absolute top-[30vh] right-[10vw] w-48 h-48 opacity-20 transform -rotate-45">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Key Symbol */}
        <div className="absolute top-[50vh] left-[15vw] w-40 h-40 opacity-20 transform rotate-90">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
            <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
          </svg>
        </div>
        {/* User Circle Symbol */}
        <div className="absolute top-[70vh] right-[20vw] w-36 h-36 opacity-20 transform -rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Welcome
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in or create an account
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <AuthInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />

            <AuthInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />

            <div className="flex gap-4">
              <AuthButton
                type="login"
                onClick={() => handleAuth("login")}
                isLoading={isLoading}
              />
              <AuthButton
                type="signup"
                onClick={() => handleAuth("signup")}
                isLoading={isLoading}
              />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google", { callbackUrl: "/" })}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 6.538C34.631 2.766 29.697 0.5 24 0.5C11.411 0.5 1.5 10.411 1.5 23s9.911 22.5 22.5 22.5c12.088 0 21.408-8.522 22.452-19.917c.004-.323.011-.646.011-.969c0-.422-.016-1.153-.059-1.531z"/>
                  <path fill="#FF3D00" d="M6.306 14.691c-1.956 3.859-1.956 8.411 0 12.27l-4.85-3.759C.053 20.627-.249 17.5 1.456 10.932l4.85 3.759z"/>
                  <path fill="#4CAF50" d="M24 48c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.32-4.402 2.108-7.219 2.108c-5.22 0-9.658-3.344-11.303-7.952l-6.305 4.878C7.054 42.158 14.938 48 24 48z"/>
                  <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-0.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238c3.693-3.413 6.13-8.23 6.19-14.283c.004-.323.011-.646.011-.969c0-.422-.016-1.153-.059-1.531z"/>
                </svg>
                Sign in with Google
              </motion.button>
            </div>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center text-sm ${
                  message.includes("success") ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
