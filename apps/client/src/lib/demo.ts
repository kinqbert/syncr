export const DEMO_HEADER = "X-Demo-Mode";

export const isDemoView = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.hostname.startsWith("demo.");
};
