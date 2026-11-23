'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import LoginButton from '@/components/LoginButton' 
import type { User } from '@supabase/supabase-js'
import { RadioOption } from '@/components/RadioOption'
import { useRouter } from 'next/navigation'

type KisonArgItem = {
  id: number
  title: string
}

export default function MakeThreadPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [selected, setSelected] = useState<"kison" | "new">("new");
  const [selected2, setSelected2] = useState<"public" | "private">("private");

  const [submitting, setSubmitting] = useState(false)

  const [title,setTitle]=useState<string>('')
  const [description,setDescription]=useState<string>('')
  const [threadTitle,setThreadTitle]=useState<string>('')

  const [kisonArg,setKisonArg]=useState<KisonArgItem[]>([])
  const [selectedArgId, setSelectedArgId] = useState<string>('')

  const supabase=createClient()
  const router=useRouter()

  const isThreadTitleEmpty = threadTitle.trim() === ''
  const isNewArgTitleEmpty = selected === 'new' && title.trim() === ''
  const isDisabled = submitting || isThreadTitleEmpty || isNewArgTitleEmpty
  
  const newOrKison = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "kison" || value === "new") {
      setSelected(value);
    }
  };

  const reset=()=>{
    setSelected('new')
    setSelected2('private')
    setTitle('')
    setDescription('')
    setThreadTitle('')
  }
  
  const isPublic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "public" || value === "private") {
      setSelected2(value);
    }
  };

  const handleSend=async()=>{
    setSubmitting(true)
    if (selected === 'new') {
      const { data: createdArg, error } = await supabase
        .from('args')
        .insert({
          title: title.trim(),
          description: description.trim(),
        })
        .select('id')
        .single()
      
      if (error) {
        console.error('ARG作成エラー:', error.message)
        alert("ARGの作成に失敗しました。")
        return
      }else{
        const argId = createdArg.id
        const {error:error2}=await supabase
          .from('threads')
          .insert({
            title:threadTitle,
            is_public:selected2==="public",
            arg_id:argId
          })

        if (error2){
          console.error('スレッド作成エラー:',error2.message)
          alert("スレッドの作成に失敗しました。")
          return
        }
      }
    }else{
      if (!selectedArgId) {
        alert('追加先のARGを選択してください。')
        setSubmitting(false)
        return
      }
    
      const { error: error2 } = await supabase
        .from('threads')
        .insert({
          title: threadTitle.trim(),
          is_public: selected2 === 'public',
          arg_id: Number(selectedArgId),
        })
      
      if (error2) {
        console.error('スレッド作成エラー:', error2.message)
        alert('スレッドの作成に失敗しました。')
        setSubmitting(false)
        return
      }
      
    }
    setSubmitting(false)
    alert('作成しました。')
    router.push('/')
    reset()
  }
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user

      setUser(currentUser)
      setLoading(false)

      if (!currentUser) return

      const { data: data2, error } = await supabase
        .from('args')
        .select('id,title')
        .eq('owner_id', currentUser.id)

      if (error) {
        console.error('取得エラー:', error.message)
        return
      }else{
        const list: KisonArgItem[] = (data2 ?? []).map((item) => ({
          id: Number(item.id),
          title: String(item.title ?? ''),
        }))
        setKisonArg(list)
        if (list.length > 0) {
          setSelectedArgId(String(list[0].id))
        }
      }

      console.log('自分のARG:', data2)
    }

    checkUser()
  }, [])

  if (loading) {
    return <main><p>確認中...</p></main>
  }

  if (!user) {
    return (
      <main>
        <h1>スレッドを立てるにはログインしてね！</h1>
        <LoginButton />
      </main>
    )
  }

  return (
    <main className='space-y-6'>
      <h1>新しいスレッドを立てる</h1>
      <section>
        <RadioOption
          name="newOrKison"
          value="new"
          checked={"new" === selected}
          onChange={newOrKison}
          label="新しいARGを作って、そこにスレッドを立てる"
        />
        <RadioOption
            name="newOrKison"
            value="kison"
            checked={"kison" === selected}
            onChange={newOrKison}
            label="既存のARGにスレッドを追加する"
          />

        {selected==="kison"?
          (
            <div>
              {kisonArg.length==0?
                (
                  <p>あなたはまだこの掲示板でARGを作っていません。新しいARGを作ってください</p>
                ):(
                  <div>
                    <p>どのARGにスレッドを追加しますか？</p>
                    <select
                      name="args"
                      value={selectedArgId}
                      onChange={(e) => setSelectedArgId(e.target.value)}
                    >
                      {kisonArg.map((arg) => (
                        <option key={arg.id} value={arg.id}>
                          {arg.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                )
              }
            </div>
          ):(
            <div>
              タイトル:<input type='text'
                className='border-2'
                onChange={(e)=>{
                  setTitle(e.target.value)
                }}
                value={title}
              />
              <br/>
              説明:<textarea
                className='border-2 w-100'
                onChange={(e)=>{
                  setDescription(e.target.value)
                }}
                value={description}
              />
            </div>
          )
        }
      </section>
      <section>
        スレッドのタイトル:<input type='text'
          className='border-2'
          onChange={(e)=>{
            setThreadTitle(e.target.value)
          }}
          value={threadTitle}
        />
      </section>
      <section>
        <RadioOption
          name="isPublic"
          value="public"
          checked={"public" === selected2}
          onChange={isPublic}
          label="掲示板のトップページに表示する"
        />
        <RadioOption
          name="isPublic"
          value="private"
          checked={"private" === selected2}
          onChange={isPublic}
          label="掲示板のトップページに表示しない。または、あとでトップページに表示する。"
        />
      </section>
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleSend}
        className="border-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? '作成中...' : 'スレッドを作成'}
      </button>
    </main>
  )
}