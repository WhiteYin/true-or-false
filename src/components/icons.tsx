import type { SVGProps } from "react";

type IconName = "arrow" | "diagonal" | "image" | "close" | "alert";

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {name === "arrow" && <><path d="M4 12h16M14 6l6 6-6 6" /></>}
      {name === "diagonal" && <path d="M6 18 18 6M6 6h12v12" />}
      {name === "image" && <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L6 21" /></>}
      {name === "close" && <path d="m6 6 12 12M18 6 6 18" />}
      {name === "alert" && <><path d="m10.3 4.5-8 14A1.7 1.7 0 0 0 3.8 21h16.4a1.7 1.7 0 0 0 1.5-2.5l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>}
    </svg>
  );
}
