/** Bare layout for pages loaded inside <FrameCompare> iframes. */
export default function FrameLayout({ children }: LayoutProps<"/frame">) {
  return <div className="p-4 text-sm">{children}</div>;
}
