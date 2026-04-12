"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasValidAccessToken } from "@/lib/karibdocs-api";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (hasValidAccessToken()) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/login");
  }, [router]);

  return null;
}
