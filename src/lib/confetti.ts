import confetti from "canvas-confetti";

export function triggerCelebration() {
  // Disparo central inicial
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#c79038", "#d7aa5f", "#0a261f", "#f6eed9", "#b89673"],
  });

  // Fogos laterais
  const end = Date.now() + 1500;
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#d7aa5f", "#c79038", "#ffffff"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#d7aa5f", "#c79038", "#ffffff"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}
