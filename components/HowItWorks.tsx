const steps = [
  { title: "Pick a gift", body: "Browse by occasion or budget. Every box is shown exactly as it will arrive." },
  { title: "Write the card", body: "Add your message at checkout. We handwrite it and tuck it inside." },
  { title: "We deliver today", body: "Order by 3pm and a rider brings it to their door anywhere in Lagos, tracked the whole way." },
];

export default function HowItWorks() {
  return (
    <section className="bg-cream-100">
      <div className="container-x grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 className="text-h2 font-bold">Sending a gift takes about three minutes.</h2>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-ink-soft">No accounts required, no back-and-forth. Want something personal? Build your own box, piece by piece.</p>
          <a href="/curate" className="btn-primary mt-6">Curate your own gift</a>
        </div>
        <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="mb-5 block text-[64px] font-extrabold leading-none tracking-tighter text-gold-400">{i + 1}</span>
              <p className="mb-2 text-[19px] font-semibold tracking-tight">{s.title}</p>
              <p className="text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
