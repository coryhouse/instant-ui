// Static imports give next/image the intrinsic width/height (no layout shift)
// and a tiny generated blurDataURL for placeholder="blur".
import hero from "../../../../public/demo-images/hero.png";
import p1 from "../../../../public/demo-images/photo-1.png";
import p2 from "../../../../public/demo-images/photo-2.png";
import p3 from "../../../../public/demo-images/photo-3.png";
import p4 from "../../../../public/demo-images/photo-4.png";
import p5 from "../../../../public/demo-images/photo-5.png";
import p6 from "../../../../public/demo-images/photo-6.png";

export { hero };
export const gallery = [p1, p2, p3, p4, p5, p6];

/**
 * Routes an image URL through the simulated ~40 Mbps link (see /api/images/throttle)
 * so image weight is visible on localhost. Each frame gets its own "pipe".
 */
export function throttled(url: string, pipe: "naive" | "instant") {
  return `/api/images/throttle?pipe=${pipe}&url=${encodeURIComponent(url)}`;
}
