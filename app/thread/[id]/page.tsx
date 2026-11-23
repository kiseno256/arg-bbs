'use client'

import { createClient } from "@/lib/supabase";
import { Suspense, use, useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export type Post = {
  id: number;
  author_name: string;
  content: string;
  role: 'anon' | 'GM';
};

function ThreadPage({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);

  const [title, setTitle] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [name, setName] = useState<string>('名無し');
  const [content, setContent] = useState<string>('');

  const supabase = useMemo(() => createClient(), []);

  const fetchPosts = useCallback(async () => {
    const { data: data2, error: error2 } = await supabase
      .from('posts')
      .select('id, author_name, content, role')
      .eq('thread_id', id)
      .order('id', { ascending: true });

    console.log('id:', id, 'data2:', data2, 'error2:', error2);

    if (error2) {
      console.error('posts取得エラー:', error2.message, error2);
      return;
    }

    const list: Post[] = (data2 ?? []).map((item) => ({
      id: Number(item.id),
      author_name: String(item.author_name ?? ''),
      content: String(item.content ?? ''),
      role: item.role === 'GM' ? 'GM' : 'anon',
    }));
    setPosts(list);
  }, [id, supabase]);

  const handleSend = async () => {
    if (!content.trim()) return;

    const { error } = await supabase
      .from('posts')
      .insert({
        thread_id: id,
        author_name: name || '名無し',
        content: content,
        role: 'anon',
      });

    if (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました。');
      return;
    }

    setContent('');
    await fetchPosts();
  };

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase
        .from('threads')
        .select('title')
        .eq('id', id)
        .single();

      if (error) {
        console.error('thread取得エラー:', error);
        return;
      }

      setTitle(data?.title ?? '');
      await fetchPosts();
    };

    init();
  }, [id, supabase, fetchPosts]);

  return (
    <div>
      <h1>{title}</h1>
      {posts.map((post) => (
        <div
          key={post.id}
          className={post.role === 'GM' ? "bg-red-300" : "bg-slate-100"}
        >
          <p>{post.author_name}</p>
          <p>{post.content}</p>
        </div>
      ))}
      <div>
        <small>
          名前:
          <input
            type="text"
            className="border-2"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </small>
        <textarea
          className="border-2"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <button onClick={handleSend}>送信</button>
      </div>
    </div>
  );
}

export default function Yomikomi({ params }: Props) {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <ThreadPage paramsPromise={params} />
    </Suspense>
  );
}