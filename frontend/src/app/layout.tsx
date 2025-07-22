"use client";
import { Container, Box, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import theme from "@/utils/theme";
import ClientLayout from "@/app/layout/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
