import NextAuth, { AuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Types
interface ExtendedUser extends Omit<User, 'id'> {
  id: string;
  token?: string;
  is_sadhaka?: boolean;
}

interface ExtendedSession extends Session {
  user: {
    id: string;
    email: string;
    is_sadhaka?: boolean;
  };
  accessToken?: string;
}

interface ExtendedToken extends JWT {
  id: string;
  email: string;
  accessToken?: string;
  is_sadhaka?: boolean;
}

// Constants
const BACKEND_URL = "http://127.0.0.1:8000";

// Helper Functions
const decodeJWT = (token: string) => {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format");
    }
    return JSON.parse(atob(tokenParts[1]));
  } catch (error) {
    throw new Error("Failed to decode token");
  }
};

// Auth Configuration
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${BACKEND_URL}/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Authentication failed");
          }

          if (!data.access) {
            throw new Error("No access token received");
          }

          const tokenData = decodeJWT(data.access);

          return {
            id: tokenData.email,
            email: credentials.email,
            token: data.access,
            is_sadhaka: tokenData.is_sadhaka || false,
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          accessToken: (user as ExtendedUser).token,
          is_sadhaka: (user as ExtendedUser).is_sadhaka,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          is_sadhaka: token.is_sadhaka,
        },
        accessToken: token.accessToken,
      };
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
