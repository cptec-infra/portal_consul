import React, { useState } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, InputBase, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { IconSearch } from '@tabler/icons-react';
import Profile from './Profile';
import AppsIcon from '@mui/icons-material/Apps';
import Menuitems from "@/app/layout/sidebar/MenuItems"; 

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const links = Menuitems?.filter((item) => item?.href);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    backgroundColor: '#232f3e', 
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },  
    zIndex: theme.zIndex.drawer + 1,
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    minHeight: 64,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }));

  return (
    <AppBarStyled position="fixed">
      <ToolbarStyled>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={handleMenuClick} sx={{ color: 'white' }} size="small">
            <AppsIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: '#232f3e',
                color: 'white',
                mt: 6,
                minWidth: 180,
                boxShadow: 3,
              },
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {links.map((item, index) => (
              <MenuItem
                key={index}
                onClick={handleClose}
                component={Link}
                href={item.href ?? '#'}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1a2533',
                  },
                }}
              >
                {item.title}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
