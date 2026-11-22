const ADJ = ["Swift", "Quiet", "Bright", "Clever", "Brave", "Calm", "Eager", "Fancy", "Gentle", "Happy", "Jolly", "Kind", "Lively", "Mighty", "Nimble", "Proud", "Rapid", "Silly", "Tidy", "Witty"];
const NOUN = ["Falcon", "Otter", "Panda", "Tiger", "Koala", "Badger", "Heron", "Lynx", "Moose", "Raven", "Gecko", "Bison", "Camel", "Dingo", "Ferret", "Iguana", "Jaguar", "Lemur", "Marten", "Newt"];

export const WORDS: string[] = Array.from({ length: 10_000 }, (_, i) => `${ADJ[i % 20]} ${NOUN[Math.floor(i / 20) % 20]} ${i}`);

export const MAX_ROWS = 250;
export const MS_PER_ROW = 0.8;

export function search(query: string) {
  const q = query.trim().toLowerCase();
  const matches = q ? WORDS.filter((w) => w.toLowerCase().includes(q)) : WORDS;
  return { total: matches.length, rows: matches.slice(0, MAX_ROWS) };
}
