import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to top on every route change (page, category, tool)
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const supportsSmooth = "scrollBehavior" in document.documentElement.style;
        if (supportsSmooth) {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } else {
          window.scrollTo(0, 0);
        }
      }
    } catch {
      // no-op
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
