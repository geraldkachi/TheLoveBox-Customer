export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  body: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "gift-ideas-lagos-birthday",
    title: "12 birthday gift ideas that don't feel generic",
    excerpt: "From personalised keepsakes to same-day flowers, here's how to pick a gift that actually lands.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop",
    date: "2026-06-02",
    body: [
      "Birthdays are the one occasion nobody forgets is coming, yet gift shopping still turns into a last-minute scramble more often than not. The good news is that a memorable birthday gift rarely needs to be expensive — it needs to be specific.",
      "Start with how the person actually spends their time, not their stated hobbies. Someone who says they love reading but hasn't finished a book in a year might get more use out of a really good candle and a cosy blanket than another novel.",
      "Personalised touches go further than most people expect. A card with a private joke, a photo from a shared memory tucked into a bouquet, or initials engraved on something small all signal that you thought about them specifically, not just the occasion.",
      "For same-day birthdays in Lagos, flowers paired with a small hamper are our most reliable combination — they arrive looking complete without needing you to coordinate multiple deliveries.",
    ],
  },
  {
    slug: "how-to-plan-a-surprise-proposal",
    title: "Planning a proposal in Lagos: a quiet, practical guide",
    excerpt: "Venue notes, timing, and the small details that make a proposal feel effortless.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    date: "2026-05-18",
    body: [
      "The best proposals we've helped with in Lagos share one thing in common: they were planned around the couple's actual routine, not a generic idea of what a proposal 'should' look like.",
      "Timing matters more than location. A familiar spot at an unfamiliar hour — a rooftop at sunset instead of dinner, a quiet morning instead of a loud evening — creates space for the moment without needing an elaborate set-up.",
      "If flowers are part of your plan, order them for arrival an hour before you need them. This gives enough buffer for last-minute placement without wilting in transit, and it's the single most common thing people cut too close.",
      "We can coordinate flower delivery timed precisely to your plan — message us on WhatsApp with your rough timeline and we'll work backward from there.",
    ],
  },
  {
    slug: "corporate-gifting-that-works",
    title: "Corporate gifting that people actually keep",
    excerpt: "What to send clients and teams that doesn't end up in a drawer.",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1200&auto=format&fit=crop",
    date: "2026-04-29",
    body: [
      "Most corporate gifts fail for the same reason: they're chosen to be inoffensive rather than useful. A branded pen nobody asked for gets thrown out faster than almost anything else in an office.",
      "The gifts that get kept tend to be either genuinely consumable — good coffee, quality chocolate, something people actually want to use up — or personal enough that discarding it feels wasteful, like a well-made notebook or a small plant.",
      "For client gifting specifically, skip the heavy branding. A card with your company's name is enough; covering the gift itself in a logo makes it feel like marketing rather than appreciation.",
      "We put together welcome kits, client gifts, and event favours in bulk for teams across Lagos — reach out with your headcount and budget and we'll propose a few directions.",
    ],
  },
];
