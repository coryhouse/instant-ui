import { thumbStyle, type Card } from "./data";

/** The "image": a gradient with an emoji. Same 4:3 shape at every size so morphs stay clean. */
export function Thumb({ card, size = "sm" }: { card: Card; size?: "sm" | "lg" }) {
  return (
    <div
      className={`flex aspect-[4/3] w-full items-center justify-center rounded-lg ${size === "lg" ? "text-8xl" : "text-4xl"}`}
      style={thumbStyle(card.hue)}
    >
      <span aria-hidden>{card.emoji}</span>
    </div>
  );
}
