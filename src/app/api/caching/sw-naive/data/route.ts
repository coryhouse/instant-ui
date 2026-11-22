import { dealsResponse } from "@/lib/caching/sw-data";

// NOT intercepted by the service worker: always goes to the network.
export const GET = dealsResponse;
