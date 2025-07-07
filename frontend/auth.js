// auth.js (root)
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { apiService  } from "@/lib/api";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
            const response = await apiService.storeUser({
            name: user.name || "",
            email: user.email || "",
            profile_photo: user.image || "",
          });

          if (!response.success) {
            console.error("Failed to store user:", response.error);
          }
        } catch (error) {
          console.error("Error storing user data:", error);
        }
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  debug: process.env.NODE_ENV === "development",
};

// ✅ Export all handlers from config
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
