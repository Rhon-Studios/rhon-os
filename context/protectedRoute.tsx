"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "./userContext"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userId } = useUser()
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded && !userId) router.push("/admin")
  }, [loaded, userId, router])

  if (!loaded || !userId) return null

  return <>{children}</>
}
