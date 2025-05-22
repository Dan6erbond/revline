"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AffiliateCookie() {
  const query = useSearchParams();

  useEffect(() => {
    if (query?.get("affiliate")) {
      document.cookie = `affiliate=${query.get("affiliate")}`;
    }
  }, [query]);

  return null;
}
