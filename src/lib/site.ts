// Public product configuration only. Never import training or evaluation artifacts here.
export const CONSOLE_URL = (process.env.NEXT_PUBLIC_CONSOLE_URL || "https://console.openinstinct.dev").replace(/\/$/, "");
export const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.openinstinct.dev/docs";
export const MODEL_NAME = "Instinct One";
