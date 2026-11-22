// Tiny Standard Schema (https://standardschema.dev) validator so Zero checks args on the server.
// Zero accepts any Standard Schema lib (zod, valibot, ...); this just avoids adding a dependency.
type StandardSchema<T> = {
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (value: unknown) => { value: T } | { issues: { message: string }[] };
    readonly types?: { readonly input: T; readonly output: T };
  };
};

export function validator<T>(check: (v: unknown) => v is T): StandardSchema<T> {
  return {
    "~standard": {
      version: 1,
      vendor: "instant-ui",
      validate: (value) => (check(value) ? { value } : { issues: [{ message: "Invalid arguments" }] }),
    },
  };
}

export const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
