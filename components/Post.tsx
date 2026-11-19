// app/components/Post.tsx

export type PostProps = {
  id:string
  name: string;
  text: string;
};

export default function Post({id, name, text }: PostProps) {
  return (
    <div className="group border-b border-dashed border-slate-300 py-3 transition-colors">

      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 font-mono">

        <span className="font-bold text-blue-400">
          {name}
        </span>
      </div>


      <div className="mt-1.5 text-sm leading-relaxed text-slate-800 font-sans whitespace-pre-wrap pl-2 border-l-2 border-transparent transition-colors">
        {text}
      </div>
    </div>
  );
}