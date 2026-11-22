"use client";
import { useEffect, useState } from "react";
import { getJson, ProductBrowser, productUrl, productsUrl, type ProductResponse, type ProductsResponse } from "./ProductBrowser";

// Naive: fetch in useEffect whenever the URL changes. Nothing is remembered,
// so every tab switch (even back to one you just saw) shows a spinner again.
function useFetch<T>(url: string | null) {
  const [state, setState] = useState<{ url: string; data: T } | null>(null);
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    getJson<T>(url).then((data) => !cancelled && setState({ url, data }));
    return () => { cancelled = true; };
  }, [url]);
  return state?.url === url ? state.data : undefined;
}

export function NaivePanel() {
  const [category, setCategory] = useState("Peripherals");
  const [productId, setProductId] = useState<number | null>(null);
  const list = useFetch<ProductsResponse>(productsUrl(category));
  const detail = useFetch<ProductResponse>(productId === null ? null : productUrl(productId));
  return (
    <ProductBrowser
      category={category}
      onCategory={(c) => { setCategory(c); setProductId(null); }}
      productId={productId}
      onProduct={setProductId}
      list={list}
      detail={detail}
    />
  );
}
