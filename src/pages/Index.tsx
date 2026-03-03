import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUACK_TEXTS = ["QUACK!", "QUAAACK!", "quack~", "QUACK QUACK!", "🦆💛"];

const Index = () => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const idRef = useRef(0);

  const quack = useCallback(() => {
    // Web Audio API quack sound
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);

    const id = idRef.current++;
    const text = QUACK_TEXTS[Math.floor(Math.random() * QUACK_TEXTS.length)];
    const x = Math.random() * 200 - 100;
    const y = -Math.random() * 80 - 40;
    setRipples((r) => [...r, { id, x, y, text }]);
    setTimeout(() => setRipples((r) => r.filter((q) => q.id !== id)), 1200);
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background select-none overflow-hidden">
      <h1 className="text-5xl md:text-7xl font-black text-foreground mb-12 tracking-tight">
        Quack App
      </h1>

      <div className="relative">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              initial={{ opacity: 1, y: 0, x: r.x, scale: 0.5 }}
              animate={{ opacity: 0, y: r.y - 60, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-1/2 top-0 -translate-x-1/2 text-2xl md:text-3xl font-black text-primary pointer-events-none whitespace-nowrap"
            >
              {r.text}
            </motion.span>
          ))}
        </AnimatePresence>

        <motion.button
          onClick={quack}
          whileTap={{ scale: 0.85, rotate: -8 }}
          whileHover={{ scale: 1.08 }}
          className="text-[10rem] md:text-[14rem] leading-none cursor-pointer focus:outline-none drop-shadow-2xl"
          aria-label="Quack!"
        >
          🦆
        </motion.button>
      </div>

      <p className="mt-10 text-lg text-muted-foreground font-medium">
        Tap the duck.
      </p>
    </div>
  );
};

export default Index;
