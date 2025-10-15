import { ReactNode } from "react";

import { ProtectedLayout } from "@/components/layouts/protected-layout";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
