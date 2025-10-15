import { ReactNode } from "react";

import { ProtectedLayout } from "@/components/layouts/protected-layout";

export default function AddBusinessLayout({ children }: { children: ReactNode }) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}