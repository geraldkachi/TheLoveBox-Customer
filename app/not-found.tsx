import { brand } from "@/lib/brand";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <Image src={brand.logoMark} alt="" width={70} height={78} className="mb-8" />
      <h1 className="text-h1 font-bold">This page has been unwrapped already</h1>
      <p className="mt-3 max-w-md text-[16px] text-ink-soft">The link may be old, or the gift is no longer available. Let's find you another one.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/categories" className="btn-primary">Browse gifts</Link>
        <Link href="/" className="btn-ghost">Go home</Link>
      </div>
    </div>
  );
}
