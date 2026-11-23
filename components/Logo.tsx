import { brand } from "@/lib/brand";
import Image from "next/image";
import Link from "next/link";

export default function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" aria-label="The Love Box — home" className={`flex items-center gap-2.5 ${className}`}>
      <Image src={brand.logoMark} alt="" width={34} height={38} priority className="h-9 w-auto" />
      <span className={`font-script text-[30px] leading-none translate-y-1 ${variant === "light" ? "text-white" : "text-ink"}`}>
        The love box
      </span>
    </Link>
  );
}
