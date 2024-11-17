// src/types/next-auth.d.ts
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | undefined
      email?: string | null | undefined
      name?: string | null | undefined
      role?: string | undefined
    }
  }

  interface User {
    id?: string | undefined
    email?: string | null | undefined
    name?: string | null | undefined
    role?: string | undefined
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
  }
}

export interface Token extends JWT {
  id?: string
  role?: string
}

export type UserType = {
  id: string
  email: string
  name: string | null
  password: string
  role: string
}