import Image from "next/image";
import { whatsappLink } from "@/lib/format";

export default function CorporateBand() {
  return (
    <section className="container-x py-6">
      <div className="relative grid overflow-hidden rounded-[32px] bg-ink text-white lg:grid-cols-2">
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <h2 className="text-h2 font-bold">Gifting for your whole team, handled.</h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/70">
            Welcome kits, client thank-yous and end-of-year hampers, branded the way you like and delivered to every address on your list.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink("Hi The Love Box! I'd like a quote for corporate gifts.")} target="_blank" rel="noreferrer" className="btn bg-ribbon-500 px-6 py-3.5 text-[15px] text-white hover:bg-ribbon-600">
              Get a corporate quote
            </a>
            <a href="/contact" className="btn border border-white/25 px-6 py-3.5 text-[15px] text-white hover:border-white">Send us a brief</a>
          </div>
        </div>
        <div className="relative min-h-[260px]">
          <Image src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1200&auto=format&fit=crop" alt="Stacked corporate gift boxes" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent max-lg:bg-gradient-to-b" />
        </div>
      </div>
    </section>
  );
}
