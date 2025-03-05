import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from "@mui/material/InputBase";
import { useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Menu, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import PublishIcon from '@mui/icons-material/Publish';
import GroupIcon from '@mui/icons-material/Group';
import DrawerComponent from '../Components/DrawerComponent';



const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const ApiLayout = () => {

  const [open, setOpen] = React.useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [menuSelected, setMenuSelected] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [environment, setEnvironment] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();
  // const { user, setUser } = useContext(AuthContext);
  const user = { role: "admin" }; 

  const menuItems = {
    admin: [
        { text: "List of APIs", icon: <DashboardIcon /> },
        { text: "List of Categories", icon: <CategoryIcon /> },
        { text: "Publish APIs", icon: <PublishIcon /> },
        { text: "Create a Team", icon: <GroupIcon /> }
    ],
    itTeam: [
        { text: "List of APIs", icon: <DashboardIcon /> },
        { text: "List of Categories", icon: <CategoryIcon /> },
    ],
    buisnessTeam: [
        { text: "List of APIs", icon: <DashboardIcon /> },
        { text: "List of Categories", icon: <CategoryIcon /> }
    ]
};

  const userRole = user.role;
  const availableMenuItems = menuItems[userRole] || [];


  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
    setMenuSelected(!menuSelected);
  };


  const handleEnvChange = (e) => {
    setEnvironment(e.target.value);
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = () => {

  }

  const handleLogout = () => {

  }

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#070111" }}>
        <Toolbar>
          <div className="flex items-center justify-between w-full">

            <div className='flex items-center'>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                // onClick={handleDrawerToggle}
                sx={{ color: menuSelected ? "#ff6600" : "white" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                className="text-orange-400 font-semibold px-3"
              >
                Nishkaiv APIM
              </Typography>

            </div>

            <div className="flex items-center bg-white rounded-md">
              <Select
                value={environment}
                displayEmpty
                sx={{
                  height: "40px",
                  minWidth: "130px",
                  border: "none",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                onChange={handleEnvChange}
              >
                <MenuItem value="All"><em>All</em></MenuItem>
                <MenuItem value="Production">Production</MenuItem>
                <MenuItem value="Prototyped">Prototyped</MenuItem>
              </Select>

              <div className="flex items-center border-l border-gray-400 pl-2">
                <SearchIcon sx={{ color: "black", marginRight: "5px" }} />
                <InputBase
                  placeholder="Search…"
                  sx={{ width: "300px", height: "40px", color: "black" }}
                  inputProps={{ "aria-label": "search" }}
                />
              </div>
            </div>

            <div>
              <div onClick={handleMenuOpen}>
                <AccountCircle sx={{ width: "26px", height: "26px", cursor: "pointer" }} />
              </div>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <DrawerComponent
        openDrawer={openDrawer}
        handleDrawerToggle={handleDrawerToggle}
        menuItems={availableMenuItems}
      />

      <Main open={open} style={{padding:'15px' }}>
        <Outlet />
      </Main>


    </div>


  )
}

export default ApiLayout