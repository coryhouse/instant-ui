export type Row = { id: number; name: string; email: string; amount: string; hue: number };

const FIRST = ["Ada", "Grace", "Linus", "Margaret", "Dennis", "Barbara", "Ken", "Radia", "Alan", "Frances", "Tim", "Hedy"];
const LAST = ["Lovelace", "Hopper", "Torvalds", "Hamilton", "Ritchie", "Liskov", "Thompson", "Perlman", "Turing", "Allen", "Berners-Lee", "Lamarr"];

export function makeRows(count: number): Row[] {
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST[i % 12];
    const last = LAST[Math.floor(i / 12) % 12];
    return {
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first}.${last}${i}@example.com`.toLowerCase(),
      amount: "$" + (((i * 7919) % 100000) / 100).toFixed(2),
      hue: (i * 37) % 360,
    };
  });
}

export const ROW_HEIGHT = 40;
