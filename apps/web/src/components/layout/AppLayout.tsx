import type { ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}
