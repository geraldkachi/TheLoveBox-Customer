import Image from "next/image";

export default function AuthShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="container-x grid min-h-[75vh] items-center gap-12 py-12 lg:grid-cols-2">
      <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[32px] lg:block">
        <Image src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop" alt="" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent" />
        <p className="absolute bottom-10 left-10 right-10 font-script text-[46px] leading-none text-white">Save the people you love, and their addresses.</p>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-h1 font-bold">{title}</h1>
        <p className="mb-8 mt-3 text-[16px] text-ink-soft">{sub}</p>
        {children}
      </div>
    </div>
  );
}
