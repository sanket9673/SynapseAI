import React from "react";

export interface CommandAction {
  id: string;
  title: string;
  description?: string;
  category: "Navigation" | "Actions" | "Study" | "Preferences";
  shortcut?: string[];
  icon: React.ReactNode;
  perform: () => void;
  keywords?: string[];
}
