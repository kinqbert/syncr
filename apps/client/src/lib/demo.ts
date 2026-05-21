export const DEMO_HEADER = "X-Demo-Mode";

export const isDemoView = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.hostname.startsWith("demo.");
};

export const getRealWebsiteUrl = () => {
  if (typeof window === "undefined") {
    return "/";
  }

  const url = new URL(window.location.href);
  url.hostname = url.hostname.replace(/^demo\./, "");
  url.pathname = "/";
  url.search = "";
  url.hash = "";

  return url.toString();
};
