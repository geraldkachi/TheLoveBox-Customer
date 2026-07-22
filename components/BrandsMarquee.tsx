import Image from "next/image";

interface Brand {
  name: string;
  logo?: string;
}

const brands: Brand[] = [
  { name: "Access" },
  { name: "RedBeryl Tech" },
  { name: "Stanbic IBTC" },
  { name: "Wema Bank" },
  { name: "Ekulo Group" },
  { name: "EDC" },
  { name: "Vel Triplum" },
  { name: "Famsville" },
  { name: "isura" },
  { name: "HIGC Health Consultants" },
];

function BrandChip({ name, logo }: Brand) {
  return (
    <div className="flex items-center gap-2.5 shrink-0 px-6">
      {logo ? (
        <div className="relative w-8 h-8 shrink-0">
          <Image src={logo} alt={name} fill className="object-contain" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-brand-blush text-brand-pink text-[12px] font-medium flex items-center justify-center shrink-0">
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="text-[15px] text-brand-ink/70 whitespace-nowrap">{name}</span>
    </div>
  );
}

export default function BrandsMarquee() {
  const track = [...brands, ...brands];

  return (
    <section className="bg-white border-y border-brand-blush py-10 overflow-hidden">
      <p className="text-center text-[12px] uppercase tracking-wide text-brand-gold mb-6">
        Trusted by teams across Lagos
      </p>
      <div className="flex marquee-track w-max">
        {track.map((b, i) => (
          <BrandChip key={b.name + i} {...b} />
        ))}
      </div>
    </section>
  );
}
