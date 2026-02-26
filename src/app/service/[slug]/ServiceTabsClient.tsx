"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type TabKey = "about" | "prices" | "specialists";

type ServiceTabsClientProps = {
  about: ReactNode;
  prices: ReactNode;
  specialists: ReactNode;
};

const TAB_LABELS: Record<TabKey, string> = {
  about: "О процедуре",
  prices: "Цены",
  specialists: "Специалисты",
};

export function ServiceTabsClient({
  about,
  prices,
  specialists,
}: ServiceTabsClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const content = useMemo(() => {
    switch (activeTab) {
      case "prices":
        return prices;
      case "specialists":
        return specialists;
      default:
        return about;
    }
  }, [activeTab, about, prices, specialists]);

  return (
    <div className="space-y-6">
      <div
        className="flex justify-center"
        role="tablist"
        aria-label="Разделы услуги"
      >
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-[0_12px_24px_rgba(13,19,33,0.08)]">
          {(Object.keys(TAB_LABELS) as TabKey[]).map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              role="tab"
              aria-selected={activeTab === tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeTab === tabKey
                  ? "bg-[#1D2D44] text-white shadow-[0_8px_18px_rgba(13,19,33,0.25)]"
                  : "text-slate-600 hover:text-[#1D2D44]"
              }`}
            >
              {TAB_LABELS[tabKey]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_32px_rgba(13,19,33,0.08)]">
        <div className="space-y-4">{content}</div>
      </div>
    </div>
  );
}
