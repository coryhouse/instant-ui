import { Article } from "../Article";
import { LazyEditor } from "./LazyEditor";

// Instant: the editor chunk loads on demand, and below-the-fold images use
// loading="lazy" so they're fetched only when scrolled near the viewport.
export default function Page() {
  return <Article editor={<LazyEditor />} imageLoading="lazy" />;
}
