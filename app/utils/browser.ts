// Utility to check if we're in browser environment
export const isBrowser = typeof window !== "undefined";

// Safe window access
export const safeWindow = isBrowser ? window : undefined;
