'use client'

import LoginButton from "@/components/LoginButton";
import Link from "next/link";

export default function Home(){


  return (
    <div>
      <main>
        <Link href="/make-thread">スレッドを立てる</Link>
      </main>
    </div>
  )
}