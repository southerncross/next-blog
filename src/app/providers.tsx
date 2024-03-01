"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { NextUIProvider } from "@nextui-org/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </UserProvider>
  );
}
