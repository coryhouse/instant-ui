/**
 * Drop inside a page rendered in a <FrameCompare> iframe. Emits a tiny inline script
 * that runs the moment the browser parses this point in the (possibly streamed) HTML,
 * reporting to the parent how long after navigation start the content arrived.
 *
 * For content rendered only on the client, use <ClientMark> instead.
 */
export function Mark({ name }: { name: string }) {
  const js = `try{var m={type:"instant-ui:mark",name:${JSON.stringify(name)},at:Math.round(performance.now())};(window.__marks=window.__marks||[]).push(m);parent.postMessage(m,"*")}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
