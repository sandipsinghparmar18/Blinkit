import { useEffect, useState } from "react";

const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  const hnadleResize = () => {
    const checkpoint = window.innerWidth < breakpoint;
    setIsMobile(checkpoint);
  };
  useEffect(() => {
    hnadleResize();
    window.addEventListener("resize", hnadleResize);
    return () => window.removeEventListener("resize", hnadleResize);
  }, []);
  return [isMobile];
};

export default useMobile;
