export type Card = { id: string; title: string; emoji: string; hue: number; kind: "fruit" | "veg"; blurb: string };

export const CARDS: Card[] = [
  { id: "apple", title: "Apple", emoji: "🍎", hue: 0, kind: "fruit", blurb: "Crisp, sweet, and keeps the doctor away." },
  { id: "carrot", title: "Carrot", emoji: "🥕", hue: 28, kind: "veg", blurb: "Crunchy root, great for your eyes (sort of)." },
  { id: "lemon", title: "Lemon", emoji: "🍋", hue: 52, kind: "fruit", blurb: "Sour, bright, makes everything better." },
  { id: "broccoli", title: "Broccoli", emoji: "🥦", hue: 110, kind: "veg", blurb: "Tiny trees. Roast them with garlic." },
  { id: "grapes", title: "Grapes", emoji: "🍇", hue: 280, kind: "fruit", blurb: "Bite-sized and best frozen in summer." },
  { id: "eggplant", title: "Eggplant", emoji: "🍆", hue: 300, kind: "veg", blurb: "Silky when cooked right. Salt it first." },
  { id: "kiwi", title: "Kiwi", emoji: "🥝", hue: 90, kind: "fruit", blurb: "Fuzzy outside, emerald inside." },
  { id: "corn", title: "Corn", emoji: "🌽", hue: 45, kind: "veg", blurb: "Summer on a cob. Butter mandatory." },
  { id: "blueberry", title: "Blueberries", emoji: "🫐", hue: 230, kind: "fruit", blurb: "Small, mighty, stains everything." },
];

export function getCard(id: string) {
  return CARDS.find((c) => c.id === id);
}

export function thumbStyle(hue: number) {
  return { background: `linear-gradient(135deg, hsl(${hue} 80% 70%), hsl(${(hue + 40) % 360} 70% 45%))` };
}
