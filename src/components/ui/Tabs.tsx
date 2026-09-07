"use client";

import {
  useState,
  type ReactNode,
} from "react";

export type Tab = {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
};

export function Tabs({
  tabs,
  defaultTab,
  className = "",
}: TabsProps) {
  const firstEnabledTab =
    tabs.find((tab) => !tab.disabled)?.id ?? "";

  const [activeTab, setActiveTab] = useState(
    defaultTab &&
      tabs.some(
        (tab) =>
          tab.id === defaultTab &&
          !tab.disabled,
      )
      ? defaultTab
      : firstEnabledTab,
  );

  const selectedTab =
    tabs.find((tab) => tab.id === activeTab) ??
    tabs.find((tab) => !tab.disabled);

  return (
    <div
      className={[
        "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800"
      >
        {tabs.map((tab) => {
          const isActive =
            tab.id === selectedTab?.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => {
                if (!tab.disabled) {
                  setActiveTab(tab.id);
                }
              }}
              className={[
                "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-40",
                isActive
                  ? "text-zinc-950 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
              ].join(" ")}
            >
              {tab.label}

              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-zinc-950 dark:bg-white" />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="pt-5"
      >
        {selectedTab?.content}
      </div>
    </div>
  );
}