import React, { useState } from "react";
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

const drawerWidth = 280;

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

    const handleAPIToggle = () => {
        setOpenAPIs(!openAPIs);
    };

    const handleEndpointToggle = (apiName) => {
        setOpenEndpoints((prev) => ({
            ...prev,
            [apiName]: !prev[apiName],
        }));
    };


    const handleListItemClick = (index, path, apiId) => {
        console.log("apiId: " + apiId);

        setSelectedIndex(index);
        handleDrawerToggle();

        if (path && (path.startsWith("/admin"))) {
            navigate(path);
        }
        else if (path && apiId) {
            navigate(`/admin/apiview?endpoint=${encodeURIComponent(path)}&apiId=${encodeURIComponent(apiId)}`);
        }
    };



    return (
        <Drawer
            variant="temporary"
            open={openDrawer}
            onClose={handleDrawerToggle}
            sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, marginTop: "64px" },
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
                                            backgroundColor: openAPIs ? "#f1f1f1" : "transparent",
                                            borderRadius: "12px",
                                            transition: "background-color 0.3s ease-in-out",
                                            "&:hover": { backgroundColor: "#f1f1f1" },
                                            boxShadow: openAPIs ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: openAPIs ? "#ff6600" : "inherit",
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
                                                    color: openAPIs ? "#ff6600" : "#333",
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
                                                        onClick={() => handleEndpointToggle(api.name)}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            sx={{ fontWeight: "bold", color: "#333" }}
                                                        >
                                                            {api.name}
                                                        </Typography>
                                                        {openEndpoints[api.name] ? (
                                                            <ExpandLessIcon />
                                                        ) : (
                                                            <ExpandMoreIcon />
                                                        )}
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
                                                                                selectedIndex === `${api.name}-${endpointIndex}`
                                                                                    ? "#e0f7fa"
                                                                                    : "transparent",
                                                                            "&:hover": { backgroundColor: "#e0f7fa" },
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                            alignItems: "center",
                                                                            borderRadius: "8px",
                                                                        }}
                                                                        onClick={() =>
                                                                            handleListItemClick(
                                                                                `${api.name}-${endpointIndex}`,
                                                                                methodObj.name,
                                                                                api.id  // Pass the API ID here
                                                                            )
                                                                        }
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
                        ) : (
                            <ListItem key={item.text} disablePadding sx={{ marginY: 2 }}>
                                <ListItemButton
                                    onClick={() => handleListItemClick(index, item.path)}
                                    sx={{
                                        backgroundColor: selectedIndex === index ? "#f1f1f1" : "transparent",
                                        borderRadius: "12px",
                                        transition: "background-color 0.3s ease-in-out",
                                        "&:hover": { backgroundColor: selectedIndex === index ? "#ffd1b3" : "#f1f1f1" },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{ minWidth: 40, color: selectedIndex === index ? "#ff6600" : "inherit" }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            sx: {
                                                fontWeight: "bold",
                                                textAlign: "left",
                                                fontSize: "1.1rem",
                                                color: selectedIndex === index ? "#ff6600" : "#333",
                                            },
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
