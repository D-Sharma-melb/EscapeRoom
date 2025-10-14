"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    const loadBootstrap = async () => {
      try {
        if (typeof window !== "undefined") {
          // Import Bootstrap properly with types support
          const bootstrap = await import("bootstrap");

          // ✅ Attach it to window for global access
          (window as any).bootstrap = bootstrap;

          console.log("✅ Bootstrap fully loaded and attached to window");
        }
      } catch (error) {
        console.error("❌ Failed to load Bootstrap JavaScript:", error);
      }
    };

    loadBootstrap();
  }, []);

  return null;
}
