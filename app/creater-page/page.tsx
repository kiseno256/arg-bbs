import Link from "next/link";

type Button={
  title:string;
  description:string;
  path:string;
}

export default function Home(){
  const buttons:Button[]=[
    {
      title:'新しいスレッド・ARGを作る',
      description:'自分のスレッドを立てることができます',
      path:'/creater-page/make-thread'
    },
    {
      title:'自分のスレッドに投稿する',
      description:'自分のスレッドに投稿します。GMとして投稿したり、キャラの名前で投稿したり、一般人を装って投稿したりできます。',
      path:'/creater-page/post'
    }
  ]
  return (
    <div className="p-3">
      {buttons.map((button)=>(
        <Link 
          key={button.path}
          className="p-1 m-2 bg-slate-200 block"
          href={button.path}>
          <p className="text-xl">{button.title}</p>
          <p>{button.description}</p>
        </Link>
      ))}
    </div>
  )
}