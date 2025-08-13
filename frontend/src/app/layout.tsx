"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import theme from "@/utils/theme";
import ClientLayout from "@/app/layout/ClientLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" style={{ height: "100%" }}>
      <body style={{ margin: 0, height: "100%" }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
