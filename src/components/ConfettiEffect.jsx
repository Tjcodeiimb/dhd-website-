import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiEffect() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ['#C084FC', '#A855F7', '#FDE68A', '#FDA4AF', '#7C3AED', '#34D399'];
    let rafId;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.6 },
        colors,
      });
      if (Date.now() < end) {
        rafId = requestAnimationFrame(frame);
      }
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
