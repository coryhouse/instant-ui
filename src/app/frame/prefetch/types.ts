import type { Product, Review } from "@/lib/db";

export type ProductDetail = Product & { reviews: Review[] };
