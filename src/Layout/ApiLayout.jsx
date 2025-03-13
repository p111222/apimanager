// import React, { useEffect, useState } from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
// import Typography from '@mui/material/Typography';
// import SearchIcon from '@mui/icons-material/Search';
// import InputBase from "@mui/material/InputBase";
// import { useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
// import Toolbar from '@mui/material/Toolbar';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import { Menu, IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import CategoryIcon from '@mui/icons-material/Category';
// import PublishIcon from '@mui/icons-material/Publish';
// import GroupIcon from '@mui/icons-material/Group';
// import DrawerComponent from '../Components/DrawerComponent';
// import ApiIcon from '@mui/icons-material/Api';
// import { makeRequest } from '../Axios';
// import { useQuery } from 'react-query';


// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   transition: theme.transitions.create('margin', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   // marginLeft: `-${drawerWidth}px`,
//   ...(open && {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   }),
// }));

// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(1),
//     width: 'auto',
//   },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   width: '100%',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     [theme.breakpoints.up('sm')]: {
//       width: '12ch',
//       '&:focus': {
//         width: '20ch',
//       },
//     },
//   },
// }));

// const ApiLayout = () => {

//   const [open, setOpen] = React.useState(true);
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [menuSelected, setMenuSelected] = useState(false);
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [environment, setEnvironment] = useState("All");
//   const navigate = useNavigate();
//   const location = useLocation();
//   // const { user, setUser } = useContext(AuthContext);
//   const user = { role: "admin" };

//   const { data: apiData, error: apiDataError, isLoading: apiDataLoading } = useQuery(
//     ['apiData'],
//     async () => {

//       const response = await makeRequest.get("/getAll");
//       console.log(response.data);

//       return response.data;
//     },
//   );

//   if (apiDataLoading) return <div>Loading...</div>;
//   if (apiDataError) return <div>Error fetching data: {apiDataError.message}</div>;
//   if (!apiData || !apiData.list) return <div>No Data Available</div>;

//   // Dynamically generate API list
//   const apiList = apiData.list.map(api => ({
//     name: api.name, // API name from response
//     path: api.context, // API context as path
//     method: "GET" // Default method (adjust as needed)
//   }));

//   const menuItems = {
//     admin: [
//       { text: "API Dashboard", icon: <ApiIcon />, path: "/admin/apidashboard" },
//       {
//         text: "List of APIs",
//         icon: <DashboardIcon />,
//         apis: apiList,
//       },
//       {
//         text: "List of Categories",
//         icon: <CategoryIcon />,
//         path: "/admin/allcategories",
//         categories: [
//           { name: "Technology", path: "/admin/categories/technology" },
//           { name: "Health", path: "/admin/categories/health" },
//           { name: "Finance", path: "/admin/categories/finance" },
//         ],
//       },
//       { text: "Upload APIs", icon: <PublishIcon />, path: "/admin/uploadapi" },
//       { text: "Create a Team", icon: <GroupIcon />, path: "/admin/createteam" }
//     ],
//     itTeam: [
//       { text: "List of APIs", icon: <DashboardIcon />, path: "/itteam/list-of-apis" },
//       { text: "List of Categories", icon: <CategoryIcon />, path: "/itteam/list-of-categories" },
//     ],
//     buisnessTeam: [
//       { text: "List of APIs", icon: <DashboardIcon />, path: "/businessteam/list-of-apis" },
//       { text: "List of Categories", icon: <CategoryIcon />, path: "/businessteam/list-of-categories" }
//     ]
//   };


//   const userRole = user.role;
//   const availableMenuItems = menuItems[userRole] || [];


//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleDrawerToggle = () => {
//     setOpenDrawer(!openDrawer);
//     setMenuSelected(!menuSelected);
//   };


//   const handleEnvChange = (e) => {
//     setEnvironment(e.target.value);
//   }

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   // Close menu
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleChangePassword = () => {

//   }

//   const handleLogout = () => {

//   }

//   return (
//     <div>
//       <AppBar position="static" sx={{ backgroundColor: "#070111" }}>
//         <Toolbar>
//           <div className="flex items-center justify-between w-full">

//             <div className='flex items-center'>
//               <IconButton
//                 aria-label="open drawer"
//                 edge="start"
//                 onClick={handleDrawerToggle}
//                 // onClick={handleDrawerToggle}
//                 sx={{ color: menuSelected ? "#ff6600" : "white" }}
//               >
//                 <MenuIcon />
//               </IconButton>
//               <Typography
//                 variant="h6"
//                 noWrap
//                 component="div"
//                 className="text-orange-400 font-semibold px-3"
//               >
//                 Nishkaiv APIM
//               </Typography>

//             </div>

//             <div className="flex items-center bg-white rounded-md">
//               <Select
//                 value={environment}
//                 displayEmpty
//                 sx={{
//                   height: "40px",
//                   minWidth: "130px",
//                   border: "none",
//                   "& .MuiOutlinedInput-notchedOutline": { border: "none" },
//                 }}
//                 onChange={handleEnvChange}
//               >
//                 <MenuItem value="All"><em>All</em></MenuItem>
//                 <MenuItem value="Production">Production</MenuItem>
//                 <MenuItem value="Prototyped">Prototyped</MenuItem>
//               </Select>

//               <div className="flex items-center border-l border-gray-400 pl-2">
//                 <SearchIcon sx={{ color: "black", marginRight: "5px" }} />
//                 <InputBase
//                   placeholder="Search…"
//                   sx={{ width: "300px", height: "40px", color: "black" }}
//                   inputProps={{ "aria-label": "search" }}
//                 />
//               </div>
//             </div>

//             <div>
//               <div onClick={handleMenuOpen}>
//                 <AccountCircle sx={{ width: "26px", height: "26px", cursor: "pointer" }} />
//               </div>

//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "right",
//                 }}
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//               >
//                 <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
//                 <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
//               </Menu>
//             </div>
//           </div>
//         </Toolbar>
//       </AppBar>

//       <DrawerComponent
//         openDrawer={openDrawer}
//         handleDrawerToggle={handleDrawerToggle}
//         menuItems={availableMenuItems}
//       />

//       <Main open={open} style={{ padding: '15px' }}>
//         <Outlet />
//       </Main>


//     </div>


//   )
// }

// export default ApiLayout

import React, { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import PublishIcon from '@mui/icons-material/Publish';
import GroupIcon from '@mui/icons-material/Group';
import DrawerComponent from '../Components/DrawerComponent';
import ApiIcon from '@mui/icons-material/Api';
import { useQuery } from 'react-query';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import { Menu } from '@mui/material';
import useAxiosPrivate from '../Hooks/useAxiosPrivate';
import { AuthContext } from '../Context/AuthContext';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const ApiLayout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [menuSelected, setMenuSelected] = useState(false);
  const [apiList, setApiList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { user } = useContext(AuthContext);

  // Fetch API List
  const { data: apiData, error: apiDataError, isLoading: apiDataLoading } = useQuery(
    ['apiData'],
    async () => {
      const response = await axiosPrivate.get("http://localhost:8082/api/getAll");
      return response.data;
    },
  );

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchApiDetails = async (apiId) => {
    try {
      const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
      const endpoints = response.data.operations.map((op) => ({
        name: op.target,
        method: op.verb,
      }));
      return endpoints;
    } catch (error) {
      console.error(`Error fetching API details for ID ${apiId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchApiList = async () => {
      if (apiData && apiData.list) {
        const apiPromises = apiData.list.map(async (api) => {
          const method = await fetchApiDetails(api.id);
          return {
            id: api.id,
            name: api.name,
            endpoints: [
              { name: api.name, method: method },
            ],
          };
        });
        const resolvedApiList = await Promise.all(apiPromises);
        setApiList(resolvedApiList);
        console.log("Resolved API List:", JSON.stringify(resolvedApiList, null, 2));
      }
    };
    fetchApiList();
  }, [apiData]);

  if (apiDataLoading) return <div>Loading...</div>;
  if (apiDataError) return <div>Error fetching data: {apiDataError.message}</div>;
  if (!apiData || !apiData.list) return <div>No Data Available</div>;

  // Determine the user role
  const isAdmin = user?.roles?.includes("admin");
  const isItUser = user?.roles?.includes("itUser");

  // Define menu items based on role
  const menuItems = [
    {
      text: "API Dashboard",
      icon: <ApiIcon />,
      path: isAdmin ? "/admin/apidashboard" : "/user/apidashboard",
    },
    {
      text: "List of APIs",
      icon: <DashboardIcon />,
      apis: apiList,
    },
    {
      text: "List of Categories",
      icon: <CategoryIcon />,
      path: isAdmin ? "/admin/allcategories" : "/user/allcategories",
      categories: [
        { name: "Technology", path: "/categories/technology" },
        { name: "Health", path: "/categories/health" },
        { name: "Finance", path: "/categories/finance" },
      ],
    },
    // Conditionally render "Upload APIs" for Admin users only
    ...(isAdmin
      ? [{ text: "Upload APIs", icon: <PublishIcon />, path: "/admin/uploadapi" }]
      : []),
    {
      text: "Create a Team",
      icon: <GroupIcon />,
      path: "/admin/createteam",
    },
  ];

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
    setMenuSelected(!menuSelected);
  };

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
                sx={{ color: menuSelected ? "#ff6600" : "white" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" className="text-orange-400 font-semibold px-3">
                Nishkaiv APIM
              </Typography>
            </div>
            <div>
              <div onClick={handleMenuOpen}>
                <AccountCircle sx={{ width: "26px", height: "26px", cursor: "pointer" }} />
              </div>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
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
        menuItems={menuItems}
      />

      <Main open={openDrawer} style={{ padding: '15px' }}>
        <Outlet />
      </Main>
    </div>
  );
}

export default ApiLayout;
