import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { User } from 'next-auth'
import 'next-auth/jwt'
import { login } from './api/auth'

declare module 'next-auth' {
  interface User {
    token?: string
    id?: string
    firstName?: string
    lastName?: string
    phone?: string
    email?: string | null
    role?: string
    adminRole?: string
    profilePicture?: string
  }

  interface Session {
    accessToken?: string
    user: User
  }
}

// Add this back
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    id?: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'signIn',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing Email Address or Password')
        }

        try {
          const res = await login({
            email: credentials.email as string,
            password: credentials.password as string,
          })

          if (!res.data) {
            throw new Error('Invalid response from server')
          }

          return {
            ...res.data.admin,
            token: res.data.token,
          } as User
        } catch (error) {
          console.error(error)
          throw new Error('Authentication failed')
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Simplified token assignment using spread operator
        return {
          ...token,
          accessToken: user.token,
          id: user.id ?? '',
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email ?? '',
          phone: user.phone,
        }
      }
      return token
    },
    async session({ session, token }) {
      // Simplified session assignment
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          email: token.email,
          phone: token.phone,
        },
      }
    },
  },
})
