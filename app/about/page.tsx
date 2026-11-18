import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our story",
  description: "The Love Box is a Lagos gift box curator styling flowers, hampers and thoughtful boxes for every occasion.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Thoughtful first", body: "Every box is put together as if we were sending it to someone we love." },
  { title: "Craft over speed", body: "We'd rather take ten more minutes to style it right than rush it out the door." },
  { title: "Real people", body: "A message to us reaches a gift specialist, not a queue or a bot." },
  { title: "Reliable", body: "If we say same-day, we mean same-day — on busy days too." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <h1 className="text-display font-bold">A Lagos studio for gifts that feel chosen.</h1>
          <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft">
            The Love Box started from a simple frustration: gifting in Lagos often felt rushed, generic or impersonal. So we built a studio where every order is styled by hand, delivered on time, and feels like it was picked for the person opening it.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[32px]">
          <Image src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1200&auto=format&fit=crop" alt="Flowers being arranged in the studio" fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-petal-100">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-h2 font-bold">What we do</h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-soft">
              Flowers, hampers, cakes and curated boxes for birthdays, weddings, anniversaries, corporate events and everything in between. We source, style and wrap every order in Yaba, then deliver it across the city the same day.
            </p>
            <Link href="/contact" className="btn-dark mt-8">Plan a custom gift</Link>
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10">
            {values.map((v) => (
              <div key={v.title}>
                <dt className="mb-2 text-[18px] font-semibold tracking-tight">{v.title}</dt>
                <dd className="text-[15px] leading-relaxed text-ink-soft">{v.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
