'use client'

import LoginButton from "@/components/LoginButton";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

type Thread={
  id:string;
  title:string;
  arg_title:string;
}

export default function Home(){
  const [threads,setThreads]=useState<Thread[]>([])

  const supabase=createClient()

  useEffect(()=>{
    const kansuu=async()=>{
      const { data, error } = await supabase
        .from('threads')
        .select('id,title,args(title)')
        .eq('is_public', true)
      
      if(error){
        console.error(error.message)
        return
      }

      const list: Thread[] = (data ?? []).map((item: any) => {
        // Supabaseの外部キー結合だと item.args に { title: '...' } が入るよ
        const argObj = Array.isArray(item.args) ? item.args[0] : item.args

        return {
          id: String(item.id),
          title: String(item.title ?? ''),
          arg_title: argObj?.title ? String(argObj.title) : 'ARGなし',
        }
      })

      setThreads(list)
    }
    kansuu()
  },[])
  return (
    <div>
      <main>
        <Link href="/make-thread">スレッドを立てる</Link>
        <div>
          {threads.map((thread)=>(
            <Link key={thread.id} href={`/thread/${thread.id}`}>
              <h2>{thread.title}</h2>
              <p>{thread.arg_title}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}