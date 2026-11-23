import type { Metadata } from "next";
import CurateBuilder from "./CurateBuilder";

export const metadata: Metadata = {
  title: "Curate your own gift box",
  description: "Build a gift box your way: pick the box, fill it with gifts, add food, drinks and a card. Delivered across Lagos by The Love Box.",
  alternates: { canonical: "/curate" },
};

export default function CuratePage() {
  return (
    <>
      <section className="container-x pb-10 pt-12">
        <h1 className="text-display font-bold">Curate your own gift</h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-soft">
          Choose the box, fill it with things they'll love, and add a treat and a card. We wrap it by hand and deliver across Lagos.
        </p>
      </section>
      <CurateBuilder />
    </>
  );
}
