"use client";

import { styled, Container, Box } from "@mui/material";
import React, { useState } from "react";
import Header from "@/app/layout/header/Header";
import Sidebar from "@/app/layout/sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  height: "100vh",   
  width: "100%",
  overflow: "hidden",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 2,
  backgroundColor: "transparent",
  paddingTop: "70px",
  height: "100%",
  overflow: "hidden",
}));

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <PageWrapper className="page-wrapper">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <Container
          sx={{
            paddingTop: "1rem",
            height: "100%",
            overflow: "auto",
          }}
          maxWidth={false}
        >
          <Box
            sx={{
              height: "100%",
              overflowY: "auto",
            }}
          >
            {children}
          </Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}