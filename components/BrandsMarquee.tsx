const brands = ["Access", "RedBeryl Tech", "Stanbic IBTC", "Wema Bank", "Ekulo Group", "EDC", "Vel Triplum", "Famsville", "isura", "HIGC Health Consultants"];

export default function BrandsMarquee() {
  const track = [...brands, ...brands];
  return (
    <section className="overflow-hidden border-y border-line py-10" aria-label="Companies that gift with us">
      <p className="container-x mb-6 text-center text-[15px] text-ink-muted">Lagos teams that send their gifts through us</p>
      <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="marquee-track flex w-max items-center">
          {track.map((b, i) => (
            <span key={b + i} className="px-8 text-[22px] font-semibold tracking-tight text-ink/35 whitespace-nowrap">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
