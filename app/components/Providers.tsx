"use client"

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";


const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

if(!urlEndpoint) {
    throw new Error("NEXT_PUBLIC_URL_ENDPOINT is not defined");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ThemeProvider attribute="class" defaultTheme="system" 
      enableSystem>
        <ImageKitProvider urlEndpoint={urlEndpoint}>
            {children}
        </ImageKitProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}