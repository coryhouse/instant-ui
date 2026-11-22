import "server-only";
import { delay, maybeFail } from "./server-settings";

/**
 * A fake, in-memory "database". Every read/write goes through `delay()` so the
 * global latency slider applies, and writes can fail via the failure-rate toggle.
 */

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
};

export type Todo = { id: string; text: string; done: boolean; createdAt: number };

export type Review = { id: number; productId: number; author: string; stars: number; body: string };

const adjectives = ["Swift", "Turbo", "Instant", "Rapid", "Snappy", "Zippy", "Nimble", "Brisk", "Fleet", "Hyper"];
const nouns = ["Keyboard", "Mouse", "Monitor", "Headset", "Webcam", "Dock", "Router", "Speaker", "Lamp", "Chair"];
const categories = ["Peripherals", "Audio", "Displays", "Networking", "Furniture"];

const products: Product[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: `${adjectives[i % adjectives.length]} ${nouns[Math.floor(i / adjectives.length) % nouns.length]}`,
  category: categories[i % categories.length],
  price: Math.round((19 + ((i * 37) % 480)) * 100) / 100 - 0.01,
  rating: 3 + ((i * 7) % 20) / 10,
  description: `A ${adjectives[i % adjectives.length].toLowerCase()} ${nouns[Math.floor(i / adjectives.length) % nouns.length].toLowerCase()} built for people who hate waiting.`,
}));

const reviewers = ["Ada", "Grace", "Linus", "Margaret", "Dennis", "Barbara", "Ken", "Radia"];

type Store = { todos: Todo[]; viewCount: number };
const g = globalThis as typeof globalThis & { __instantUiDb?: Store };
const store = (g.__instantUiDb ??= {
  todos: [
    { id: "1", text: "Write the talk", done: true, createdAt: 1 },
    { id: "2", text: "Build the demos", done: false, createdAt: 2 },
    { id: "3", text: "Make it instant", done: false, createdAt: 3 },
  ],
  viewCount: 0,
});

export async function getProducts(opts: { latency?: number } = {}) {
  await delay(opts.latency);
  return products;
}

export async function getProduct(id: number, opts: { latency?: number } = {}) {
  await delay(opts.latency);
  return products.find((p) => p.id === id) ?? null;
}

export async function getReviews(productId: number, opts: { latency?: number } = {}) {
  await delay(opts.latency);
  return Array.from({ length: 3 }, (_, i): Review => ({
    id: productId * 10 + i,
    productId,
    author: reviewers[(productId + i) % reviewers.length],
    stars: 3 + ((productId + i) % 3),
    body: ["Genuinely instant.", "Faster than my last one.", "Would wait zero seconds again."][i],
  }));
}

export async function getRecommendations(productId: number, opts: { latency?: number } = {}) {
  await delay(opts.latency);
  return products.filter((p) => p.id !== productId).slice(productId % 50, (productId % 50) + 4);
}

export async function getTodos() {
  await delay();
  return [...store.todos].sort((a, b) => a.createdAt - b.createdAt);
}

export async function addTodo(text: string) {
  await delay();
  maybeFail(`Couldn't save "${text}"`);
  const todo: Todo = { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() };
  store.todos.push(todo);
  return todo;
}

export async function toggleTodo(id: string) {
  await delay();
  maybeFail();
  const todo = store.todos.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
  return todo ?? null;
}

export async function deleteTodo(id: string) {
  await delay();
  maybeFail();
  store.todos = store.todos.filter((t) => t.id !== id);
}

/** A value that changes per request: used to show what's dynamic vs static. */
export async function incrementViews() {
  await delay();
  return ++store.viewCount;
}
