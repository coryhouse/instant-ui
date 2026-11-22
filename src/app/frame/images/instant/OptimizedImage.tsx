"use client";
import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { throttled } from "../photos";

// Same optimizer URL next/image uses by default, just sent through the simulated
// network so the byte savings are visible. In a real app you'd use <Image> as-is.
const loader = ({ src, width, quality }: ImageLoaderProps) =>
  throttled(`/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`, "instant");

export function OptimizedImage({ alt, ...props }: ImageProps) {
  return <Image loader={loader} alt={alt} {...props} />;
}
