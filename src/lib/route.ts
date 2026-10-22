import { useEffect, useState } from "react";

/**
 * Tiny hash router: mcudle.vercel.app/#/classic etc.
 * Hash URLs work on any static host without extra setup, and the phone's back button works.
 */
export type Route = "home" | "classic" | "endless" | "quote" | "emoji";

const parse = (): Route => {
  const h = window.location.hash.replace(/^#\/?/, "");
  return h === "classic" || h === "endless" || h === "quote" || h === "emoji" ? h : "home";
};

export function useRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(parse);

  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const go = (r: Route) => {
    window.location.hash = r === "home" ? "/" : `/${r}`;
  };
  return [route, go];
}
