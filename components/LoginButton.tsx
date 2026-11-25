'use client'

import { createClient } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { useEffect, useMemo, useState } from "react"

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = useMemo(() => createClient(), [])

  const handleGoogleLogin = async () => {
    if(user){
      const {error}=await supabase.auth.signOut()
      if(error){
        alert('ログアウトに失敗しました')
      }else{
        alert('ログアウトしました')
      }
      setUser(null)
      return
    }
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
        className="cursor-pointer m-1 p-1 bg-slate-200"
        onClick={handleGoogleLogin}
      >
        {user ? "ログアウト" : "Googleでログイン"}
      </button>
    </div>
  )
}