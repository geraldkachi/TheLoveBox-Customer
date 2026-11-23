"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-h1 font-bold">This page didn't load</h1>
      <p className="mt-3 max-w-md text-ink-soft">Something went wrong on our side. Try again, or come back in a minute.</p>
      <button onClick={reset} className="btn-primary mt-8">Try again</button>
    </div>
  );
}
