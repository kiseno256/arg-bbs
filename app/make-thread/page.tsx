'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import LoginButton from '@/components/LoginButton' 
import type { User } from '@supabase/supabase-js'

export default function MakeThreadPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [selected, setSelected] = useState("kison");
  const [selected2,setSelected2]=useState('private')
  const newOrKison = (event: React.ChangeEvent<HTMLInputElement>) => setSelected(event.target.value);
  const isPublic = (event: React.ChangeEvent<HTMLInputElement>) => setSelected2(event.target.value);
  const [title,setTitle]=useState<string>('')
  const [description,setDescription]=useState<string>('')
  const [threadTitle,setThreadTitle]=useState<string>('')

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
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
    <main>
      <h1>新しいスレッドを立てる</h1>
      <section>
        <div className="col-4">
          <label className="form-check-label">
            <input className="form-check-input" type="radio" name="newOrKison" 
              value="kison" checked={"kison" === selected} onChange={newOrKison}/>
            <span className="fs-6">既存のARGにスレッドを追加する</span>
          </label>
        </div>
        <div className="col-4">
          <label className="form-check-label">
            <input className="form-check-input" type="radio" name="newOrKison" 
              value="new" checked={"new" === selected} onChange={newOrKison}/>
            <span className="fs-6">新しいARGを作って、そこにスレッドを立てる</span>
          </label>
        </div>
        {selected==="kison"?
          (
            <div>
              <p>どのARGにスレッドを追加しますか？</p>
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
        <div className="col-4">
          <label className="form-check-label">
            <input className="form-check-input" type="radio" name="isPublic" 
              value="public" checked={"public" === selected2} onChange={isPublic}/>
            <span className="fs-6">掲示板を訪れた全員に見えるようにする</span>
          </label>
        </div>
        <div className="col-4">
          <label className="form-check-label">
            <input className="form-check-input" type="radio" name="isPublic" 
              value="private" checked={"private" === selected2} onChange={isPublic}/>
            <span className="fs-6">リンクを知っている人のみに見えるようにする</span>
          </label>
        </div>
      </section>
    </main>
  )
}