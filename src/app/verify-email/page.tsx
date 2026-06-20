"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * @fileOverview Redundant verification hub neutralized.
 */
export default function VerifyEmailPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/dashboard')
  }, [router])

  return null
}
