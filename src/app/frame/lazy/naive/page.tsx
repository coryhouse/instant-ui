import { Article } from "../Article";
import { EagerEditor } from "./EagerEditor";

// Naive: the heavy editor is imported eagerly and every image loads immediately,
// even the ones far below the fold.
export default function Page() {
  return <Article editor={<EagerEditor />} imageLoading="eager" />;
}
