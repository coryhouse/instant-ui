"use server";
import { addTodo, deleteTodo, toggleTodo, type Todo } from "@/lib/db";

// Server Actions used by BOTH panels. They hit the fake DB (latency + "fail 50%").
// We return a result object instead of throwing so the error message survives
// to the client in production (thrown errors are redacted).
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

async function run<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, value: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong" };
  }
}

export async function addTodoAction(text: string): Promise<Result<Todo>> {
  return run(() => addTodo(text));
}

export async function toggleTodoAction(id: string): Promise<Result<Todo | null>> {
  return run(() => toggleTodo(id));
}

export async function deleteTodoAction(id: string): Promise<Result<void>> {
  return run(() => deleteTodo(id));
}
