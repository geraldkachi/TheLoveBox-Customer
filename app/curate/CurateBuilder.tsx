"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Gift, Package, Coffee, ClipboardCheck, Loader2, Pencil, Minus, Plus } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { naira } from "@/lib/format";
import { toast } from "@/lib/toast";
import { useCartStore, useUI, type CustomBox } from "@/lib/cartStore";
import { brand } from "@/lib/brand";
import QtyStepper from "@/components/QtyStepper";
import ShippingNote from "@/components/ShippingNote";

interface Option {
  _id: string;
  step: "box" | "item" | "extra";
  name: string;
  description?: string;
  image?: string;
  price: number;
  group?: string;
  capacity?: number;
  maxPerOrder: number;
  soldOut?: boolean;
}
interface Options {
  boxes: Option[];
  items: Option[];
  extras: Option[];
}
type Picks = Record<string, number>;

const STEPS = [
  { key: "box", label: "Gift box", icon: Package },
  { key: "items", label: "Gift items", icon: Gift },
  { key: "extras", label: "Food & cards", icon: Coffee },
  { key: "review", label: "Review", icon: ClipboardCheck },
] as const;

const STORAGE = "tlb_curate_draft";
const ease = [0.22, 1, 0.36, 1] as const;

function OptionImage({ src, alt }: { src?: string; alt: string }) {
  return src ? (
    <Image src={src} alt={alt} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
  ) : (
    <div className="grid h-full place-items-center">
      <Image src={brand.logoMark} alt="" width={48} height={54} className="opacity-30" />
    </div>
  );
}

export default function CurateBuilder() {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const [[step, dir], setStep] = useState<[number, number]>([0, 0]);
  const [boxId, setBoxId] = useState<string | null>(null);
  const [items, setItems] = useState<Picks>({});
  const [extras, setExtras] = useState<Picks>({});
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [restored, setRestored] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery<Options>({
    queryKey: ["curate-options"],
    queryFn: async () => (await api.get("/curate/options")).data,
  });

  // Restore an unfinished box after refresh
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE);
      if (raw) {
        const d = JSON.parse(raw);
        setBoxId(d.boxId ?? null);
        setItems(d.items || {});
        setExtras(d.extras || {});
        setStep([d.step || 0, 0]);
      }
    } catch {
      /* ignore */
    }
    setRestored(true);
  }, []);
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify({ boxId, items, extras, step }));
    } catch {
      /* ignore */
    }
  }, [boxId, items, extras, step, restored]);

  const byId = useMemo(() => new Map([...(data?.boxes || []), ...(data?.items || []), ...(data?.extras || [])].map((o) => [o._id, o])), [data]);
  const box = boxId ? byId.get(boxId) : undefined;
  const capacity = box?.capacity || 6;
  const itemCount = Object.values(items).reduce((a, b) => a + b, 0);
  const extraCount = Object.values(extras).reduce((a, b) => a + b, 0);
  const sum = (p: Picks) => Object.entries(p).reduce((s, [id, q]) => s + (byId.get(id)?.price || 0) * q, 0);
  const unitTotal = (box?.price || 0) + sum(items) + sum(extras);
  const total = unitTotal * qty;
  const pickedCount = (box ? 1 : 0) + itemCount + extraCount;

  // Drop picks that the admin has since removed
  useEffect(() => {
    if (!data) return;
    if (boxId && !byId.has(boxId)) setBoxId(null);
    const clean = (p: Picks) => Object.fromEntries(Object.entries(p).filter(([id]) => byId.has(id)));
    setItems((p) => clean(p));
    setExtras((p) => clean(p));
  }, [data, byId, boxId]);

  const canNext = step === 0 ? !!box : step === 1 ? itemCount > 0 && itemCount <= capacity : true;
  const go = (to: number) => {
    if (to > step && !canNext) {
      toast.error(step === 0 ? "Choose a gift box to continue." : itemCount === 0 ? "Add at least one gift item to your box." : `Your box holds ${capacity} items.`);
      return;
    }
    setStep([to, to > step ? 1 : -1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setPick = (kind: "items" | "extras", o: Option, next: number) => {
    const setter = kind === "items" ? setItems : setExtras;
    const current = (kind === "items" ? items : extras)[o._id] || 0;
    const clamped = Math.max(0, Math.min(o.maxPerOrder, next));
    if (next > o.maxPerOrder) toast(`You can add up to ${o.maxPerOrder} × ${o.name}.`);
    if (kind === "items" && clamped > current && itemCount + (clamped - current) > capacity) {
      toast.error(`Your ${box?.name || "box"} is full (${capacity} items). Remove something or pick a bigger box.`);
      return;
    }
    setter((p) => {
      const n = { ...p };
      if (clamped === 0) delete n[o._id];
      else n[o._id] = clamped;
      return n;
    });
  };

  const chooseBox = (o: Option) => {
    if (itemCount > (o.capacity || 6)) {
      toast.error(`The ${o.name} holds ${o.capacity} items and you've picked ${itemCount}. Remove some first.`);
      return;
    }
    setBoxId(o._id);
  };

  const buildCustom = (): CustomBox => ({
    box: { option: box!._id, name: box!.name, price: box!.price, qty: 1 },
    items: Object.entries(items).map(([id, q]) => ({ option: id, name: byId.get(id)!.name, price: byId.get(id)!.price, qty: q })),
    extras: Object.entries(extras).map(([id, q]) => ({ option: id, name: byId.get(id)!.name, price: byId.get(id)!.price, qty: q })),
  });

  const addToCart = async (checkout: boolean) => {
    if (!box) return;
    setAdding(true);
    try {
      const custom = buildCustom();
      // Server confirms availability, capacity and prices
      const res = await api.post("/curate/price", {
        box: custom.box.option,
        items: custom.items.map((x) => ({ option: x.option, qty: x.qty })),
        extras: custom.extras.map((x) => ({ option: x.option, qty: x.qty })),
      });
      const priced = res.data;
      add({
        productId: `custom:${Date.now().toString(36)}`,
        custom,
        name: `Curated gift box — ${box.name}`,
        image: box.image || "",
        size: "Curated",
        price: priced.price,
        qty,
      });
      sessionStorage.removeItem(STORAGE);
      setBoxId(null);
      setItems({});
      setExtras({});
      setQty(1);
      setStep([0, -1]);
      if (checkout) {
        toast.success("Your curated box is in your cart");
        router.push("/checkout");
      } else {
        toast.success("Your curated box is in your cart", { action: { label: "View cart", onClick: () => setCartOpen(true) } });
        setCartOpen(true);
      }
    } catch (err) {
      toast.error(errorMessage(err, "We couldn't add your box. Please review your picks."));
    } finally {
      setAdding(false);
    }
  };

  const lastPicked = useMemo(() => {
    const ids = [...Object.keys(extras), ...Object.keys(items)];
    const names = ids.map((id) => byId.get(id)?.name).filter(Boolean);
    if (!box) return "No items selected yet";
    return names.length ? `${box.name} with ${names.slice(-2).join(", ")}${names.length > 2 ? ` +${names.length - 2} more` : ""}` : box.name;
  }, [box, items, extras, byId]);

  /* ------------------------------ render ------------------------------ */
  if (isLoading) {
    return (
      <div className="container-x grid grid-cols-2 gap-5 py-10 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[20px] bg-cream-100" />)}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="container-x py-20 text-center">
        <p className="text-[18px] font-semibold">The gift builder didn't load</p>
        <p className="mt-1 text-ink-muted">{errorMessage(error)}</p>
        <button onClick={() => refetch()} className="btn-dark mt-6">Try again</button>
      </div>
    );
  }
  if (!data?.boxes.length || !data.items.length) {
    return (
      <div className="container-x py-20 text-center">
        <Gift className="mx-auto mb-4 h-10 w-10 text-gold-400" />
        <p className="text-[20px] font-semibold tracking-tight">The gift builder is being restocked</p>
        <p className="mx-auto mt-2 max-w-md text-ink-muted">We're adding new boxes and items. Browse our ready-made gifts, or message us to build one together.</p>
        <Link href="/categories" className="btn-dark mt-6">Browse gifts</Link>
      </div>
    );
  }

  const extraGroups = data.extras.reduce<Record<string, Option[]>>((g, o) => {
    const k = o.group || "Extras";
    (g[k] ||= []).push(o);
    return g;
  }, {});

  const PickCard = ({ o, kind }: { o: Option; kind: "items" | "extras" }) => {
    const q = (kind === "items" ? items : extras)[o._id] || 0;
    const blocked = o.soldOut || (kind === "items" && q === 0 && itemCount >= capacity);
    return (
      <div className={`group relative ${o.soldOut ? "opacity-50" : ""}`}>
        <button
          type="button"
          disabled={o.soldOut}
          onClick={() => setPick(kind, o, q ? q : 1)}
          className={`relative block aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-cream-100 text-left ring-2 transition ${q ? "ring-primary-600" : "ring-transparent hover:ring-line"}`}
          aria-pressed={q > 0}
          aria-label={`${q ? "Selected: " : "Add "}${o.name}, ${naira(o.price)}`}
        >
          <OptionImage src={o.image} alt={o.name} />
          <AnimatePresence>
            {q > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 24 }} className="absolute right-3 top-3 grid h-8 min-w-8 place-items-center rounded-full bg-primary-600 px-2 text-[13px] font-bold text-white">
                {q > 1 ? `×${q}` : <Check className="h-4 w-4" />}
              </motion.span>
            )}
          </AnimatePresence>
          {o.soldOut && <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[12px] font-semibold text-white">Sold out</span>}
        </button>
        <div className="flex items-start justify-between gap-3 px-1 pt-3">
          <div className="min-w-0">
            <p className="text-[15.5px] font-semibold leading-snug tracking-tight">{o.name}</p>
            {o.description && <p className="mt-0.5 line-clamp-2 text-[13px] text-ink-muted">{o.description}</p>}
            <p className="mt-1 text-[15px] tabular-nums">{naira(o.price)}</p>
          </div>
          {q > 0 ? (
            <QtyStepper size="sm" value={q} onChange={(n) => setPick(kind, o, n)} />
          ) : (
            <button
              type="button"
              disabled={blocked}
              onClick={() => setPick(kind, o, 1)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition hover:border-primary-600 hover:bg-primary-600 hover:text-white disabled:opacity-40"
              aria-label={`Add ${o.name}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
        {q > 0 && (
          <button onClick={() => setPick(kind, o, 0)} className="mt-1 px-1 text-[12.5px] font-medium text-ink-muted hover:text-red-600">
            Remove
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Stepper */}
      <div className="container-x">
        <ol className="relative mx-auto mb-12 grid max-w-3xl grid-cols-4">
          <span className="absolute left-[12.5%] right-[12.5%] top-6 h-[2px] bg-line" aria-hidden="true" />
          <motion.span className="absolute left-[12.5%] top-6 h-[2px] bg-primary-600" aria-hidden="true" animate={{ width: `${(step / 3) * 75}%` }} transition={{ duration: 0.5, ease }} />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const current = i === step;
            return (
              <li key={s.key} className="relative flex flex-col items-center">
                <button
                  onClick={() => (i < step ? go(i) : i === step + 1 ? go(i) : undefined)}
                  disabled={i > step + 1}
                  aria-current={current ? "step" : undefined}
                  className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border-2 transition-colors ${current ? "border-primary-600 bg-primary-600 text-white shadow-lift" : done ? "border-primary-600 bg-white text-primary-600" : "border-line bg-white text-ink-muted"}`}
                >
                  {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </button>
                <span className={`mt-2.5 text-center text-[13px] font-medium ${current ? "text-ink" : "text-ink-muted"}`}>
                  <span className="hidden sm:inline">{i + 1}. </span>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="container-x overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.4, ease }}
          >
            {step === 0 && (
              <>
                <h2 className="text-h2 font-bold">Select your gift box</h2>
                <p className="mb-8 mt-2 text-[16px] text-ink-muted">Each box holds a set number of gift items. Food, drinks and cards go alongside and don't take up space.</p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.boxes.map((o) => {
                    const selected = boxId === o._id;
                    return (
                      <button key={o._id} type="button" disabled={o.soldOut} onClick={() => chooseBox(o)} aria-pressed={selected} className="group text-left disabled:opacity-50">
                        <div className={`relative aspect-[4/3] overflow-hidden rounded-[24px] bg-cream-100 ring-2 transition ${selected ? "ring-primary-600" : "ring-transparent group-hover:ring-line"}`}>
                          <OptionImage src={o.image} alt={o.name} />
                          {selected && (
                            <motion.span layoutId="box-check" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-primary-600 text-white shadow-lift">
                              <Check className="h-5 w-5" />
                            </motion.span>
                          )}
                        </div>
                        <div className="flex items-start justify-between gap-4 px-1 pt-4">
                          <div>
                            <p className="text-[18px] font-semibold tracking-tight">{o.name}</p>
                            {o.description && <p className="mt-0.5 text-[14px] text-ink-muted">{o.description}</p>}
                            <p className="mt-2 inline-flex rounded-full bg-gold-100 px-2.5 py-1 text-[12.5px] font-medium text-gold-600">Holds up to {o.capacity} items</p>
                          </div>
                          <p className="text-[17px] font-semibold tabular-nums">{naira(o.price)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <h2 className="text-h2 font-bold">Choose your gift items</h2>
                    <p className="mt-2 text-[16px] text-ink-muted">Fill your {box?.name} with up to {capacity} items.</p>
                  </div>
                  <div className="w-full max-w-xs">
                    <div className="mb-1.5 flex justify-between text-[13.5px]">
                      <span className="text-ink-soft">Space in your box</span>
                      <span className="font-semibold tabular-nums">{itemCount} / {capacity}</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: capacity }).map((_, i) => (
                        <motion.span key={i} className="h-2 flex-1 rounded-full" animate={{ backgroundColor: i < itemCount ? "rgb(var(--gold-400))" : "rgb(var(--cream-200))" }} transition={{ duration: 0.25 }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
                  {data.items.map((o) => <PickCard key={o._id} o={o} kind="items" />)}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-h2 font-bold">Food, drinks & greeting cards</h2>
                <p className="mb-8 mt-2 text-[16px] text-ink-muted">Optional finishing touches. Skip this step if you don't need any.</p>
                {data.extras.length === 0 ? (
                  <p className="rounded-[20px] bg-cream-50 p-8 text-center text-ink-muted">No extras available right now — continue to review your box.</p>
                ) : (
                  Object.entries(extraGroups).map(([group, opts]) => (
                    <div key={group} className="mb-12">
                      <h3 className="mb-5 text-[20px] font-semibold tracking-tight">{group}</h3>
                      <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
                        {opts.map((o) => <PickCard key={o._id} o={o} kind="extras" />)}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {step === 3 && box && (
              <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px]">
                <div>
                  <h2 className="text-h2 font-bold">Review your box</h2>
                  <p className="mb-8 mt-2 text-[16px] text-ink-muted">Check everything looks right. You can add a card message at checkout.</p>
                  {[
                    { title: "Gift box", to: 0, rows: [{ o: box, q: 1 }] },
                    { title: "Gift items", to: 1, rows: Object.entries(items).map(([id, q]) => ({ o: byId.get(id)!, q })) },
                    { title: "Food, drinks & cards", to: 2, rows: Object.entries(extras).map(([id, q]) => ({ o: byId.get(id)!, q })) },
                  ].map((sec) => (
                    <section key={sec.title} className="mb-8">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-[17px] font-semibold tracking-tight">{sec.title}</h3>
                        <button onClick={() => go(sec.to)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13.5px] font-medium text-primary-700 hover:bg-primary-50">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                      </div>
                      {sec.rows.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-line px-4 py-4 text-[14px] text-ink-muted">Nothing added.</p>
                      ) : (
                        <ul className="divide-y divide-line rounded-2xl border border-line">
                          {sec.rows.map(({ o, q }) => (
                            <li key={o._id} className="flex items-center gap-4 p-3">
                              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                                {o.image && <Image src={o.image} alt="" fill sizes="56px" className="object-cover" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[15px] font-medium">{o.name}</span>
                                <span className="text-[13px] text-ink-muted tabular-nums">{q} × {naira(o.price)}</span>
                              </span>
                              <span className="text-[15px] font-semibold tabular-nums">{naira(o.price * q)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>

                <aside className="rounded-[28px] border border-line p-6 lg:sticky lg:top-28">
                  <p className="text-[20px] font-semibold tracking-tight">Your curated box</p>
                  <dl className="mt-5 flex flex-col gap-2 text-[15px]">
                    <div className="flex justify-between"><dt className="text-ink-soft">Box</dt><dd className="tabular-nums">{naira(box.price)}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-soft">Gift items ({itemCount})</dt><dd className="tabular-nums">{naira(sum(items))}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-soft">Extras ({extraCount})</dt><dd className="tabular-nums">{naira(sum(extras))}</dd></div>
                  </dl>
                  <div className="my-5 flex items-center justify-between border-y border-dashed border-line py-4">
                    <span className="text-[15px] font-medium">How many boxes?</span>
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream-100" aria-label="Fewer boxes"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
                      <button onClick={() => setQty((q) => Math.min(50, q + 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream-100" aria-label="More boxes"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-[28px] font-bold tracking-tight tabular-nums">{naira(total)}</span>
                  </div>
                  <div className="mt-4"><ShippingNote compact /></div>
                  <button onClick={() => addToCart(true)} disabled={adding} className="btn-primary mt-5 w-full">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Checkout this box"}
                  </button>
                  <button onClick={() => addToCart(false)} disabled={adding} className="btn-ghost mt-2 w-full">Add to cart & keep shopping</button>
                </aside>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Sticky summary bar */}
      <div className="sticky bottom-0 z-30 mt-16 bg-ink text-white shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.4)]">
        <div className="container-x flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <motion.span key={pickedCount} initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="flex shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-3.5 py-2.5 text-[14px] font-semibold">
              <Gift className="h-4 w-4 text-gold-300" /> {pickedCount} item{pickedCount === 1 ? "" : "s"}
            </motion.span>
            <div className="min-w-0">
              <p className="truncate text-[14.5px] text-white/80">{lastPicked}</p>
              <p className="text-[18px] font-bold tabular-nums">Total: {naira(total)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => go(step - 1)} disabled={step === 0} className="btn border border-white/25 px-5 py-3 text-[14.5px] text-white hover:border-white disabled:opacity-30">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 3 ? (
              <button onClick={() => go(step + 1)} className={`btn px-6 py-3 text-[14.5px] ${canNext ? "bg-gold-400 text-ink hover:bg-gold-300" : "bg-white/15 text-white/60"}`}>
                {step === 2 && extraCount === 0 ? "Skip" : "Next"} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={() => addToCart(false)} disabled={adding} className="btn bg-gold-400 px-6 py-3 text-[14.5px] text-ink hover:bg-gold-300">
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
