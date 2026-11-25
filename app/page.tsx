'use client'

import LoginButton from "@/components/LoginButton";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Thread={
  id:string;
  title:string;
  arg_title:string;
}

export default function Home(){
  const [threads,setThreads]=useState<Thread[]>([])

  const supabase=useMemo(()=>createClient(),[])

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
      <main className="p-1">
        <Link href="/creater-page" className="m-2 p-1 bg-slate-300">クリエイターページへ</Link>
        <div>
          {threads.map((thread)=>(
            <Link
              className="m-3 p-1 bg-slate-100 block hover:underline"
              key={thread.id} href={`/thread/${thread.id}`}>
              <h2 className="text-xl">{thread.title}</h2>
              <p className="text-sm text-slate-500">{thread.arg_title}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}