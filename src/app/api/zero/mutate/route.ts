// zero-cache forwards client mutations here; we re-run the same mutators against Postgres.
// The latency slider delays this endpoint — the Zero UI stays instant anyway.
import { mustGetMutator } from "@rocicorp/zero";
import { handleMutateRequest } from "@rocicorp/zero/server";
import { dbProvider } from "@/lib/zero/db";
import { mutators } from "@/lib/zero/mutators";
import { delay, maybeFail } from "@/lib/server-settings";

export async function POST(request: Request) {
  await delay(); // simulated slow server (outside the DB transaction)
  const result = await handleMutateRequest({
    dbProvider,
    handler: (transact) =>
      transact((tx, name, args) => {
        maybeFail(); // "fail 50% of writes" toggle -> Zero rolls back the optimistic change
        return mustGetMutator(mutators, name).fn({ args, tx });
      }),
    request,
    userID: null,
  });
  return Response.json(result);
}
