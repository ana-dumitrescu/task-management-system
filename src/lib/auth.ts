// src/lib/auth.ts
import NextAuth from "next-auth"
import { AuthOptions, getServerSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("Starting authorization attempt");
        
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error("Missing credentials");
          }

          console.log("Looking up user:", credentials.email);
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          }).catch(err => {
            console.error("Database lookup error:", err);
            return null;
          });

          if (!user || !user.password) {
            console.log("User not found or no password");
            throw new Error("Invalid credentials");
          }

          console.log("Checking password");
          
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          ).catch(err => {
            console.error("Password comparison error:", err);
            return false;
          });

          if (!isPasswordValid) {
            console.log("Invalid password");
            throw new Error("Invalid credentials");
          }

          console.log("Authorization successful");
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
  debug: true, // Enable debug mode to get more detailed logs
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      console.error('Auth error:', { code, metadata });
    },
    warn(code) {
      console.warn('Auth warning:', code);
    },
    debug(code, metadata) {
      console.log('Auth debug:', { code, metadata });
    },
  },
}

export const auth = () => {
  try {
    return getServerSession(authOptions);
  } catch (error) {
    console.error("GetServerSession error:", error);
    return null;
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }