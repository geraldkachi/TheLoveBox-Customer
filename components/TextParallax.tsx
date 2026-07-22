"use client";
import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const IMG_PADDING = 12;

interface PanelProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  children?: ReactNode;
}

export function TextParallaxSection({ imgUrl, subheading, heading, children }: PanelProps) {
  return (
    <div style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}>
      <div className="relative h-[100vh] sm:h-[120vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
}

function StickyImage({ imgUrl }: { imgUrl: string }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["end end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <motion.div
      ref={targetRef}
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(80vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div className="absolute inset-0 bg-brand-ink/50" style={{ opacity }} />
    </motion.div>
  );
}

function OverlayCopy({ subheading, heading }: { subheading: string; heading: string }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      ref={targetRef}
      style={{ y, opacity }}
      className="absolute left-0 top-0 flex h-[80vh] w-full flex-col items-center justify-center text-white px-6 text-center"
    >
      <p className="mb-3 text-lg sm:text-2xl text-white/80">{subheading}</p>
      <p className="font-display text-4xl sm:text-6xl">{heading}</p>
    </motion.div>
  );
}

export function ParallaxStory() {
  return (
    <div className="bg-white">
      <TextParallaxSection
        imgUrl="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1600&auto=format&fit=crop"
        subheading="Curated, not mass-produced"
        heading="Made to be opened slowly."
      >
        <StoryContent
          title="Every box is styled by hand"
          body="No two orders leave our studio looking the same. We match colours, wrapping and cards to the occasion, not a template."
        />
      </TextParallaxSection>
      <TextParallaxSection
        imgUrl="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1600&auto=format&fit=crop"
        subheading="Same-day, city-wide"
        heading="Delivered before the moment passes."
      >
        <StoryContent
          title="Lagos delivery, done right"
          body="Order before 3pm and we'll have it at their door the same day, tracked from the moment it leaves our studio."
        />
      </TextParallaxSection>
    </div>
  );
}

function StoryContent({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-5 pb-24 pt-12 sm:grid-cols-12">
      <h2 className="col-span-1 font-display text-[26px] text-brand-ink sm:col-span-4">{title}</h2>
      <div className="col-span-1 sm:col-span-8">
        <p className="mb-6 text-[16px] sm:text-[18px] text-[#5a4c4f] leading-relaxed">{body}</p>
        <Link
          href="/category/birthdays"
          className="inline-flex items-center gap-1 rounded-full bg-brand-ink px-6 py-3 text-[14px] text-white transition-colors hover:bg-brand-ink/80"
        >
          Shop the collection <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
