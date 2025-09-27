import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { apiClient } from "@/lib/api"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Use FastAPI backend for authentication
          const response = await apiClient.login({
            email: credentials.email,
            password: credentials.password
          })

          if (response.error || !response.data) {
            console.error("Login failed:", response.error)
            return null
          }

          const { user, access_token, refresh_token } = response.data as any

          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            image: user.profile_picture_url,
            accessToken: access_token,
            refreshToken: refresh_token,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        (session as any).accessToken = token.accessToken as string
        (session as any).refreshToken = token.refreshToken as string
      }
      return session
    },
  },
}