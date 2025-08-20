import { ReactNode } from "react";

/**
 * Layout grouping for potential future expansion under (notes) segment.
 * Currently returns children as-is. Reserved for future nested routes.
 */
export default function NotesGroupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
