import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 240;

const DrawerComponent = ({ openDrawer, handleDrawerToggle, menuItems }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

    return (
        <div>
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
                        <ListItem key={item.text} disablePadding sx={{ marginY: 3 }}>
                            <ListItemButton
                                onClick={() => handleListItemClick(index)}
                                sx={{
                                    backgroundColor: selectedIndex === index ? "#ffebcc" : "transparent", // Light blue for selected
                                    borderRadius: "8px",
                                    transition: "background-color 0.3s ease-in-out",
                                    "&:hover": {
                                        backgroundColor: selectedIndex === index ? "#ffd1b3" : "#ffebcc", // Slightly darker on hover
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: selectedIndex === index ? "#ff6600" : "inherit",
                                    }}
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
                    ))}
                </List>
            </Drawer>
        </div>
    );
};

export default DrawerComponent;
