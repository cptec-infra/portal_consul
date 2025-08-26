import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const sidebarWidth = "230px";
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '7px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: '15px',
    },
  };

  const drawerPaperStyles = {
    boxSizing: "border-box",
    width: sidebarWidth,
    backgroundColor: "#f9f9f9",
    borderRight: "1px solid #e0e0e0",
    ...scrollbarStyles,
    top: "70px", 
    height: "calc(100% - 64px)",
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        <SidebarItems />
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Box sx={{ width: sidebarWidth, flexShrink: 0 }}>
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          slotProps={{
            paper: {
              sx: drawerPaperStyles,
            }
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      slotProps={{
        paper: {
          sx: {
            ...drawerPaperStyles,
            boxShadow: (theme) => theme.shadows[8],
          },
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default MSidebar;
