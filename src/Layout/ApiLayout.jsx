import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import PublishIcon from '@mui/icons-material/Publish';
import GroupIcon from '@mui/icons-material/Group';
import DrawerComponent from '../Components/DrawerComponent';
import ApiIcon from '@mui/icons-material/Api';
import { useQuery } from 'react-query';
import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import { IconButton, InputBase, Paper, List, ListItem, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import { Menu } from '@mui/material';
import useAxiosPrivate from '../Hooks/useAxiosPrivate';
import { AuthContext } from '../Context/AuthContext';
import debounce from 'lodash.debounce';
import CircularProgress from '@mui/material/CircularProgress';
import Loader from '../Assets/apidocumentationloader.gif'

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: drawerWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  })
);

const ApiLayout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [menuSelected, setMenuSelected] = useState(false);
  const [apiList, setApiList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);
  const { user, loginTime } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatLoginTime = () => {
    if (!loginTime) return "Not available";

    const loginDate = new Date(loginTime);
    return `Logged in since ${loginDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const { data: apiData, error: apiDataError, isLoading: apiDataLoading } = useQuery(
    ['apiData'],
    async () => {
      // const response = await axiosPrivate.get("http://localhost:8082/api/getAll");
      const response = await axiosPrivate.get("/getAll");
      return response.data;
    },
  );

  const getBearerToken = async () => {
    try {
      const response = await axiosPrivate.get(
        // "http://localhost:8083/token",
        "/token",
        null,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // console.log("Generated Bearer Token:", response.data.access_token);  
      return response.data.access_token;
    } catch (error) {
      console.error("Error fetching Bearer token:", error.response?.data || error.message);
      throw new Error("Failed to obtain Bearer token");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await getBearerToken();
      const response = await axiosPrivate.get(
        // 'http://localhost:8086/api/categories'
        '/categories'
      );
      return response.data.list;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const fetchApisForCategory = async (categoryName) => {
    try {

      const response = await axiosPrivate.get(
        // `http://localhost:8087/api/category-details?category=${encodeURIComponent(categoryName)}`
        `/category-details?category=${encodeURIComponent(categoryName)}`
      );

      return response.data.list || [];
    } catch (error) {
      console.error(`Error fetching APIs for category ${categoryName}:`, error);
      return [];
    }
  };

  // const searchApis = async (query) => {
  //   try {
  //     const searchFields = [
  //       `name:${query}`,
  //       `description:${query}`,
  //       `context:${query}`,
  //       `version:${query}`,
  //       `provider:${query}`,
  //       `type:${query}`,
  //       `audience:${query}`,
  //       `lifeCycleStatus:${query}`,
  //       `workflowStatus:${query}`,
  //       `updatedBy:${query}`,
  //       `gatewayVendor:${query}`,
  //       `advertiseOnly:${query}`,
  //     ];

  //     const token = await getBearerToken();


  //     let combinedResults = [];
  //     for (const field of searchFields) {
  //       const response = await axiosPrivate.get(
  //         `https://43.204.108.73:8344/api/am/publisher/v4/apis?query=${encodeURIComponent(field)}`,
  //         // `http://api.kriate.co.in:8344/api/am/publisher/v4/apis?query=${encodeURIComponent(field)}`,
  //         // `/am/publisher/v4/apis?query=${encodeURIComponent(field)}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       if (response.data.list) {
  //         combinedResults = [...combinedResults, ...response.data.list];
  //       }
  //     }

  //     const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());

  //     console.log("Search Response:", uniqueResults);
  //     setSearchResults(uniqueResults);
  //     setShowSuggestions(true);
  //   } catch (error) {
  //     console.error("Error searching APIs:", error.response?.data || error.message);
  //   }
  // };

  const searchApis = async (query) => {
    try {
      const searchFields = [
        `name:${query}`,
        `description:${query}`,
        `context:${query}`,
        `version:${query}`,
        `provider:${query}`,
        `type:${query}`,
        `audience:${query}`,
        `lifeCycleStatus:${query}`,
        `workflowStatus:${query}`,
        `updatedBy:${query}`,
        `gatewayVendor:${query}`,
        `advertiseOnly:${query}`,
      ];

      const response = await axiosPrivate.get(
        // `http://localhost:8088/api/search?query=${encodeURIComponent(query)}`,
        `/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer 9919f507-82e2-3bf1-9ba8-750aba735bc3`,
          },
        }
      );

      let combinedResults = [];
      if (response.data.list) {
        combinedResults = response.data.list;
      }

      const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());

      // console.log("Search Response:", uniqueResults);
      setSearchResults(uniqueResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching APIs:", error.response?.data || error.message);
    }
  };


  const handleSearchChange = useCallback(
    debounce((query) => {
      if (query.length > 2) {
        searchApis(query);
      } else {
        setShowSuggestions(false);
        setSearchResults([]);
      }
    }, 300),
    []
  );

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    handleSearchChange(query);
  };

  const handleSuggestionClick = (apiId) => {
    const pathPrefix = isAdmin ? "admin" : "user";

    navigate(`/${pathPrefix}/api-details/${apiId}`);
    setShowSuggestions(false);
    setSearchTerm('');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchApiDetails = async (apiId) => {
    try {
      // const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
      const response = await axiosPrivate.get(`/getapi/${apiId}`);
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
        // console.log("Resolved API List:", JSON.stringify(resolvedApiList, null, 2));
      }
    };
    fetchApiList();
  }, [apiData]);

  // Load all data
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);

      // 1. Fetch all categories
      const categoryList = await fetchCategories();

      // 2. For each category, fetch its APIs
      const categoriesWithApis = await Promise.all(
        categoryList.map(async (category) => {
          const apis = await fetchApisForCategory(category.name);

          // 3. For each API, fetch its details/endpoints
          const apisWithDetails = await Promise.all(
            apis.map(async (api) => {
              const methods = await fetchApiDetails(api.id);
              return {
                id: api.id,
                name: api.name,
                description: api.description,
                endpoints: [{
                  name: api.name,
                  method: methods.map(m => ({
                    name: m.name,
                    method: m.method
                  }))
                }]
              };
            })
          );

          return {
            id: category.id,
            name: category.name,
            description: category.description,
            apis: apisWithDetails
          };
        })
      );

      setCategories(categoriesWithApis);
      setLoading(false);
    };

    loadAllData();
  }, []);

  const getMenuItems = () => {
    return [
      {
        text: "API Dashboard",
        icon: <ApiIcon />,
        path: isAdmin ? "/admin/apidashboard" : "/user/apidashboard",
      },
      {
        text: "List of APIs",
        icon: <DashboardIcon />,
        apis: categories.flatMap(category => category.apis),
      },
      {
        text: "List of Categories",
        icon: <CategoryIcon />,
        categories: categories.map(category => ({
          name: category.name,
          description: category.description,
          apis: category.apis
        }))
      },
      ...(isAdmin ? [{
        text: "Upload APIs",
        icon: <PublishIcon />,
        path: "/admin/uploadapi"
      }] : []),
    ];
  };

  if (apiDataLoading || loading) return (
    // <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //   <CircularProgress />
    // </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'background.default' }}>
      <img
        src={Loader}
        alt="Loading..."
        style={{
          width: '150px', // Adjust size as needed
          height: '150px' // Adjust size as needed
        }}
      />

    </Box>
  );

  if (apiDataError) return <div>Error fetching data: {apiDataError.message}</div>;
  if (!apiData || !apiData.list) return <div>No Data Available</div>;

  // Determine the user role
  const isAdmin = user?.roles?.includes("admin");
  const isItUser = user?.roles?.includes("itUser");

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
    setMenuSelected(!menuSelected);
  };

  const handleLogout = () => {
    axiosPrivate.post('/auth/logout')
      .then(() => {
        console.log("Logged Out");
        window.location.href = '/login';
      }).catch((error) => {
        console.log("Error during logout: ", error);
      });
  };

  return (
    <div>
      <AppBar position="fixed" sx={{ backgroundColor: "#070111" }}>
        <Toolbar>
          <div className="flex items-center justify-between w-full">
            <div className='flex items-center'>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                // sx={{ color: menuSelected ? "#ff6600" : "white" }}
                sx={{ color: "#ff6600" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                className="text-orange-400 font-semibold px-3"
                onClick={() => navigate(isAdmin ? "/admin/apidashboard" : "/user/apidashboard")}
                sx={{ cursor: "pointer" }}
              >
                API Wiki Portal
              </Typography>

            </div>

            <Box ref={searchRef} sx={{ position: 'relative', marginRight: 2 }}>
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#333333',
                  borderRadius: 1,
                  padding: '4px 12px',
                  width: 500,  // Increased the width
                  color: 'white',
                  boxShadow: 3,
                }}
              >
                <SearchIcon sx={{ color: 'white' }} />
                <InputBase
                  placeholder="Search APIs..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  sx={{ color: 'white', marginLeft: 1, flex: 1, fontSize: '16px' }}
                />
              </Paper>

              {showSuggestions && searchResults.length > 0 && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '50px',  // Slightly below the search bar
                    left: 0,
                    width: 500,  // Matches the search bar width
                    maxHeight: 300,
                    overflowY: 'auto',
                    zIndex: 1300,
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    boxShadow: 6,  // Enhanced shadow for better visibility
                    border: '1px solid #ddd',
                  }}
                >
                  <List dense sx={{ padding: 1 }}>
                    {searchResults.map((api) => (
                      <ListItem
                        key={api.id}
                        button
                        onClick={() => handleSuggestionClick(api.id)}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                          padding: '8px 16px',
                          borderRadius: '4px',
                          margin: '2px 0',
                        }}
                      >
                        <ListItemText
                          primary={api.name}
                          secondary={`Version: ${api.version}`}
                          primaryTypographyProps={{ fontSize: '16px', fontWeight: 'bold' }}
                          secondaryTypographyProps={{ fontSize: '14px', color: 'gray' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>

            <div>

              <div className="flex items-center gap-1">
                <div className="flex flex-col mr-2">
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontSize: '0.875rem',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Welcome, {user?.userName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontSize: '0.75rem',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {formatLoginTime()}
                  </Typography>
                </div>
                <div onClick={handleMenuOpen}>
                  <AccountCircle sx={{ width: "26px", height: "26px", cursor: "pointer" }} />
                </div>
              </div>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate(isAdmin ? '/admin/my-profile' : '/user/my-profile');
                  }}
                >My Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>

      </AppBar>

      <div>

        <DrawerComponent
          openDrawer={openDrawer}
          handleDrawerToggle={handleDrawerToggle}
          menuItems={getMenuItems()}

        />

        <Main open={openDrawer} style={{ padding: '15px', marginTop: '50px' }}>
          <Outlet />
        </Main>
      </div>

      {/* <div >
        <footer className="bg-gray-900 py-3 px-4 text-center border-t border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <Typography variant="caption" className="text-gray-400">
              © {new Date().getFullYear()} Nishkaiv APIM
            </Typography>
            <div className="flex space-x-4">
              <Typography variant="caption" className="text-gray-500">
                v1.0.0
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                All Rights Reserved
              </Typography>
            </div>
          </div>
        </footer>
      </div> */}

      <div>
        <footer className="bg-gray-900 py-3 px-4 text-center border-t border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <Typography variant="caption" className="text-gray-400">
              © {new Date().getFullYear()} Nishkaiv APIM
            </Typography>

            <Typography variant="caption" className="text-gray-400 hover:text-white">
              <a
                href="https://api.kriate.co.in:8344/publisher/apis"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                https://api.kriate.co.in:8344/publisher/apis
              </a>
            </Typography>

            <div className="flex space-x-4">
              <Typography variant="caption" className="text-gray-500">
                v1.0.0
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                All Rights Reserved
              </Typography>
            </div>
          </div>
        </footer>
      </div>

    </div>

  );
}

export default ApiLayout;
