import type { ReactNode } from "react";
import Nav from "@/components/ui/nav";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div>
        <Nav />
        {children}
      </div>
    </>
  );
}
