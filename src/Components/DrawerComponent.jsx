import React, { useContext, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { Chip, Box, Typography } from "@mui/material";
import { ApiEndpointContext } from "../Context/ApiEndpointContext";

const drawerWidth = 260;

const methodColors = {
    GET: "#4caf50",    // Green
    POST: "#2196f3",   // Blue
    PUT: "#ff9800",    // Orange
    DELETE: "#f44336", // Red
    PATCH: "#9c27b0",  // Purple
    OPTIONS: "#607d8b" // Grey
};

const DrawerComponent = ({ openDrawer, handleDrawerToggle, menuItems }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [openAPIs, setOpenAPIs] = useState(false);
    const [openEndpoints, setOpenEndpoints] = useState({});
    const navigate = useNavigate();
    const { endpoint, setEndpoint, setActiveTab, setSelectedApiName } = useContext(ApiEndpointContext);
    const [openCategories, setOpenCategories] = useState(false);
    const [openCategoryItems, setOpenCategoryItems] = useState({});

    const handleAPIToggle = () => {
        setOpenAPIs(!openAPIs);
        setSelectedIndex("list-of-apis");
        if (openAPIs) {
            setOpenEndpoints({});
        }
    };

    const handleCategoryToggle = () => {
        setOpenCategories(!openCategories);
        setSelectedIndex("list-of-categories");
        if (openCategories) {
            setOpenCategoryItems({});
            setOpenEndpoints({});
        }
    };

    const handleCategoryNameClick = (categoryName) => {
        const pathPrefix = window.location.pathname.startsWith("/admin") ? "admin" : "user";
        navigate(`/${pathPrefix}/category-details/${encodeURIComponent(categoryName)}`);
    };

    const handleCategoryItemToggle = (categoryName, apiId = null) => {
        if (!apiId) {
            setOpenCategoryItems(prev => ({
                ...prev,
                [categoryName]: !prev[categoryName]
            }));
        } else {
            setOpenEndpoints(prev => ({
                ...prev,
                [apiId]: !prev[apiId]
            }));
        }
    };


    const handleEndpointToggle = (apiName, apiId, methodName) => {
        if (!methodName) {
            setOpenEndpoints(prev => ({
                ...prev,
                [apiName]: !prev[apiName] 
            }));
        } else {
            setOpenEndpoints(prev => ({
                ...prev,
                [apiName]: true
            }));
        }

        setEndpoint(methodName || apiName);
        setActiveTab("operations");
        setSelectedApiName(apiName);

        const pathPrefix = window.location.pathname.startsWith("/admin") ? "admin" : "user";
        navigate(`/${pathPrefix}/api-details/${encodeURIComponent(apiId)}`);
    };

    const handleListItemClick = (selectedId, path, apiId) => {
        setSelectedIndex(selectedId);
        handleDrawerToggle();
        setEndpoint(path);
        setActiveTab("operations");

        const pathPrefix = window.location.pathname.startsWith("/admin") ? "admin" : "user";
        if (path && apiId) {
            navigate(`/${pathPrefix}/api-details/${encodeURIComponent(apiId)}`);
        } else if (path) {
            navigate(path);
        }
    };

    return (
        <Drawer
            variant="permanent"
            open={true}
            onClose={handleDrawerToggle}
            // sx={{
            //     display: { xs: "none", sm: "block" },
            //     "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, marginTop: "64px" },
            // }}
            sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                    marginTop: "64px",
                    height: 'calc(100vh - 64px)',
                    overflowY: 'auto',
                    // Hide scrollbar for Chrome, Safari and Opera
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    // Hide scrollbar for IE, Edge and Firefox
                    '-ms-overflow-style': 'none',  /* IE and Edge */
                    'scrollbar-width': 'none',  /* Firefox */
                },
            }}
        >
            <List>
                {menuItems.map((item, index) => (
                    <div key={item.text}>
                        {item.text === "List of APIs" ? (
                            <>
                                <ListItem disablePadding sx={{ marginY: 2 }}>
                                    <ListItemButton
                                        onClick={handleAPIToggle}
                                        sx={{
                                            backgroundColor: selectedIndex === "list-of-apis" ? "#ff6600" : openAPIs ? "#f1f1f1" : "transparent",
                                            borderRadius: "12px",
                                            transition: "background-color 0.3s ease-in-out",
                                            "&:hover": { backgroundColor: selectedIndex === "list-of-apis" ? "#ff6600" : "#f1f1f1" },
                                            boxShadow: openAPIs ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: selectedIndex === "list-of-apis" ? "#fff" : openAPIs ? "#ff6600" : "inherit",
                                                marginRight: "8px",
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontWeight: "bold",
                                                    fontSize: "1.2rem",
                                                    color: selectedIndex === "list-of-apis" ? "#fff" : openAPIs ? "#ff6600" : "#333",
                                                },
                                            }}
                                        />
                                        {openAPIs ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={openAPIs} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.apis?.map((api, apiIndex) => (
                                            <div key={apiIndex}>
                                                <ListItem disablePadding sx={{ marginY: 1 }}>
                                                    <ListItemButton
                                                        sx={{
                                                            pl: 4,
                                                            backgroundColor: openEndpoints[api.name] ? "#e6e6e6" : "transparent",
                                                            borderRadius: "8px",
                                                            transition: "background-color 0.3s ease",
                                                            "&:hover": { backgroundColor: "#e6e6e6" },
                                                        }}
                                                        onClick={() => handleEndpointToggle(api.name, api.id)}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            sx={{ fontWeight: "bold", color: "#333" }}
                                                        >
                                                            {api.name}
                                                        </Typography>
                                                        {openEndpoints[api.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                    </ListItemButton>
                                                </ListItem>
                                                <Collapse in={openEndpoints[api.name]} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {api.endpoints?.flatMap((endpoint, endpointIndex) =>
                                                            endpoint.method.map((methodObj) => (
                                                                <ListItem key={endpointIndex} disablePadding>
                                                                    <ListItemButton
                                                                        sx={{
                                                                            pl: 6,
                                                                            marginY: 0.5,
                                                                            backgroundColor:
                                                                                selectedIndex === `${api.name}-${endpointIndex}-${methodObj.name}`
                                                                                    ? "#e0f7fa"
                                                                                    : "transparent",
                                                                            "&:hover": { backgroundColor: "#e0f7fa" },
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                            alignItems: "center",
                                                                            borderRadius: "8px",
                                                                        }}
                                                                        onClick={() => {
                                                                            handleEndpointToggle(api.name, api.id, methodObj.name);
                                                                            handleListItemClick(
                                                                                `${api.name}-${endpointIndex}-${methodObj.name}`,
                                                                                methodObj.name,
                                                                                api.id
                                                                            )
                                                                        }}
                                                                    >
                                                                        <ListItemText
                                                                            primary={methodObj.name}
                                                                            primaryTypographyProps={{
                                                                                sx: {
                                                                                    color: "#333",
                                                                                    fontSize: "0.9rem",
                                                                                    fontWeight: "500",
                                                                                    maxWidth: "170px",
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap",
                                                                                },
                                                                            }}
                                                                        />
                                                                        <Box sx={{ display: "flex", gap: "8px" }}>
                                                                            <Chip
                                                                                label={methodObj.method}
                                                                                size="small"
                                                                                sx={{
                                                                                    backgroundColor: methodColors[methodObj.method] || "#bbb",
                                                                                    color: "#fff",
                                                                                    fontWeight: "bold",
                                                                                    borderRadius: "20px",
                                                                                    padding: "0 8px",
                                                                                    marginLeft: "4px",
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                    </ListItemButton>
                                                                </ListItem>
                                                            ))
                                                        )}
                                                    </List>
                                                </Collapse>
                                            </div>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        ) :
                            item.text === "List of Categories" ? (
                                <>
                                    <ListItem disablePadding sx={{ marginY: 2 }}>
                                        <ListItemButton
                                            onClick={handleCategoryToggle}
                                            sx={{
                                                backgroundColor: selectedIndex === "list-of-categories" ? "#ff6600" : openCategories ? "#f1f1f1" : "transparent",
                                                borderRadius: "12px",
                                                transition: "background-color 0.3s ease-in-out",
                                                "&:hover": { backgroundColor: selectedIndex === "list-of-categories" ? "#ff6600" : "#f1f1f1" },
                                                boxShadow: openCategories ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    color: selectedIndex === "list-of-categories" ? "#fff" : openCategories ? "#ff6600" : "inherit",
                                                    // marginRight: "px",
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.text}
                                                primaryTypographyProps={{
                                                    sx: {
                                                        fontWeight: "bold",
                                                        fontSize: "1rem",
                                                        color: selectedIndex === "list-of-categories" ? "#fff" : openCategories ? "#ff6600" : "#333",
                                                    },
                                                }}
                                            />
                                            {openCategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </ListItemButton>
                                    </ListItem>
                                    <Collapse in={openCategories} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.categories?.map((category, catIndex) => (
                                                <div key={catIndex}>
                                                    <ListItem disablePadding sx={{ marginY: 1 }}>
                                                        {/* <ListItemButton
                                                            sx={{
                                                                pl: 4,
                                                                backgroundColor: openCategoryItems[category.name] ? "#e6e6e6" : "transparent",
                                                                borderRadius: "8px",
                                                                transition: "background-color 0.3s ease",
                                                                "&:hover": { backgroundColor: "#e6e6e6" },
                                                            }}
                                                            onClick={() => handleCategoryItemToggle(category.name)}
                                                        >
                                                            <Typography
                                                                variant="body1"
                                                                sx={{ fontWeight: "bold", color: "#333" }}
                                                            >
                                                                {category.name}
                                                            </Typography>
                                                            {openCategoryItems[category.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </ListItemButton> */}
                                                        <ListItemButton
                                                            sx={{
                                                                pl: 4,
                                                                backgroundColor: openCategoryItems[category.name] ? "#e6e6e6" : "transparent",
                                                                borderRadius: "8px",
                                                                transition: "background-color 0.3s ease",
                                                                "&:hover": { backgroundColor: "#e6e6e6" },
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent the toggle from happening
                                                                handleCategoryNameClick(category.name);
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontWeight: "bold",
                                                                    color: "#333",
                                                                    cursor: "pointer" // Add pointer cursor
                                                                }}
                                                            >
                                                                {category.name}
                                                            </Typography>
                                                            <Box onClick={(e) => {
                                                                e.stopPropagation(); // Isolate the expand/collapse click
                                                                handleCategoryItemToggle(category.name);
                                                            }}>
                                                                {openCategoryItems[category.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                            </Box>
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <Collapse in={openCategoryItems[category.name]} timeout="auto" unmountOnExit>
                                                        <List component="div" disablePadding>
                                                            {category.apis?.map((api, apiIndex) => (
                                                                <div key={apiIndex}>
                                                                    <ListItem disablePadding>
                                                                        <ListItemButton
                                                                            sx={{
                                                                                pl: 6,
                                                                                backgroundColor: openEndpoints[api.id] ? "#e0f7fa" : "transparent",
                                                                                borderRadius: "8px",
                                                                                "&:hover": { backgroundColor: "#e0f7fa" },
                                                                            }}
                                                                            // onClick={() => handleCategoryItemToggle(category.name, api.id)}
                                                                            onClick={(e) => handleCategoryItemToggle(category.name, api.id, e)}

                                                                        >
                                                                            <Typography
                                                                                variant="body2"
                                                                                sx={{ fontWeight: "500", color: "#333", cursor: "pointer" }}
                                                                            >
                                                                                {api.name}
                                                                            </Typography>
                                                                            {openEndpoints[api.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                                        </ListItemButton>
                                                                    </ListItem>
                                                                    <Collapse in={openEndpoints[api.id]} timeout="auto" unmountOnExit>
                                                                        <List component="div" disablePadding>
                                                                            {api.endpoints?.flatMap((endpoint, endpointIndex) =>
                                                                                endpoint.method.map((methodObj) => (
                                                                                    <ListItem key={endpointIndex} disablePadding>
                                                                                        <ListItemButton
                                                                                            sx={{
                                                                                                pl: 8,
                                                                                                marginY: 0.5,
                                                                                                backgroundColor:
                                                                                                    selectedIndex === `${api.name}-${endpointIndex}-${methodObj.name}`
                                                                                                        ? "#e0f7fa"
                                                                                                        : "transparent",
                                                                                                "&:hover": { backgroundColor: "#e0f7fa" },
                                                                                                display: "flex",
                                                                                                justifyContent: "space-between",
                                                                                                alignItems: "center",
                                                                                                borderRadius: "8px",
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                handleEndpointToggle(api.name, api.id, methodObj.name);
                                                                                                handleListItemClick(
                                                                                                    `${api.name}-${endpointIndex}-${methodObj.name}`,
                                                                                                    methodObj.name,
                                                                                                    api.id
                                                                                                )
                                                                                            }}
                                                                                        >
                                                                                            <ListItemText
                                                                                                primary={methodObj.name}
                                                                                                primaryTypographyProps={{
                                                                                                    sx: {
                                                                                                        color: "#333",
                                                                                                        fontSize: "0.9rem",
                                                                                                        fontWeight: "500",
                                                                                                        maxWidth: "170px",
                                                                                                        overflow: "hidden",
                                                                                                        textOverflow: "ellipsis",
                                                                                                        whiteSpace: "nowrap",
                                                                                                    },
                                                                                                }}
                                                                                            />
                                                                                            <Box sx={{ display: "flex", gap: "8px" }}>
                                                                                                <Chip
                                                                                                    label={methodObj.method}
                                                                                                    size="small"
                                                                                                    sx={{
                                                                                                        backgroundColor: methodColors[methodObj.method] || "#bbb",
                                                                                                        color: "#fff",
                                                                                                        fontWeight: "bold",
                                                                                                        borderRadius: "20px",
                                                                                                        padding: "0 8px",
                                                                                                        marginLeft: "4px",
                                                                                                    }}
                                                                                                />
                                                                                            </Box>
                                                                                        </ListItemButton>
                                                                                    </ListItem>
                                                                                ))
                                                                            )}
                                                                        </List>
                                                                    </Collapse>
                                                                </div>
                                                            ))}
                                                        </List>
                                                    </Collapse>
                                                </div>
                                            ))}
                                        </List>
                                    </Collapse>
                                </>
                            ) :

                                (
                                    <ListItem key={item.text} disablePadding sx={{ marginY: 2 }}>
                                        <ListItemButton
                                            onClick={() => handleListItemClick(index, item.path)}
                                            sx={{
                                                backgroundColor: selectedIndex === index ? "#ff6600" : "transparent",
                                                borderRadius: "12px",
                                                transition: "background-color 0.3s ease-in-out",
                                                "&:hover": { backgroundColor: selectedIndex === index ? "#ff6600" : "#ffd1b3" },
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40, color: selectedIndex === index ? "#fff" : "inherit" }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.text}
                                                primaryTypographyProps={{
                                                    color: selectedIndex === index ? "#fff" : "inherit"
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                    </div>
                ))}
            </List>
        </Drawer>
    );
};

export default DrawerComponent;