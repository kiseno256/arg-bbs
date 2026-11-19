'use client'

import { createClient } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('ログインエラー:', error.message)
    }
  }

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [supabase])

  return (
    <div>
      <button
        className="cursor-pointer"
        onClick={handleGoogleLogin}
      >
        {user ? "ログイン済み" : "Googleでログイン"}
      </button>
    </div>
  )
}