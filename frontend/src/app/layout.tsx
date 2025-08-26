"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import theme from "@/utils/theme";
import ClientLayout from "@/app/layout/ClientLayout";
import { Provider } from "react-redux";
import { store } from "../utils/store/store";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" style={{ height: "100%" }}>
      <body style={{ margin: 0, height: "100%" }}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
