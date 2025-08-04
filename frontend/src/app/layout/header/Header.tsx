import React, { useState } from 'react';
import {Box,AppBar,Toolbar,styled,Stack,IconButton,InputBase,Typography,Button, Menu, MenuItem} from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { IconBellRinging, IconMenu2, IconGridDots, IconSearch } from '@tabler/icons-react';
import Profile from './Profile';
import AppsIcon from '@mui/icons-material/Apps';
import Menuitems from "@/app/layout/sidebar/MenuItems"; 

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const links = Menuitems.filter((item) => item.href);
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

        {/* Lado esquerdo */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={handleMenuClick}
            sx={{ color: 'white' }}
            size="small"
          >
            <AppsIcon size="small" />
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
                href={item.href}
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


          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Portal
          </Typography>
        </Stack>

        {/* Centro - barra de busca */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            minWidth: '250px',
          }}
        >
          <IconSearch size="1.1rem" style={{ color: '#666' }} />
          <InputBase
            placeholder="Search"
            sx={{ ml: 1, fontSize: 14, width: '100%' }}
          />
        </Box>

        {/* Lado direito */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            component={Link}
            href="/authentication/login"
            disableElevation
            color="primary"
            size="small"
          >
            Login
          </Button>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
