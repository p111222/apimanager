import React, { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import { AuthContext } from "../Context/AuthContext";

const BreadcrumbComponent = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const pathnames = location.pathname.split("/").filter((x) => x);

    // Determine the role-specific dashboard path
    const dashboardPath = user?.roles?.includes("admin") ? "/admin/apidashboard" : "/user/apidashboard";

    return (
        <Stack spacing={2} sx={{ padding: "4px 8px" }}>
            <Breadcrumbs
                sx={{ fontSize: "0.85rem" }}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                <Link to={dashboardPath} style={{ textDecoration: "none", color: "inherit" }}>
                    <HomeIcon fontSize="small" sx={{ marginRight: "4px" }} />
                </Link>

                {pathnames.map((value, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;

                    // Handle "user" and "admin" breadcrumb links to redirect to the dashboard
                    if (value === "user" || value === "admin") {
                        return (
                            <Link
                                key={index}
                                to={dashboardPath}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                {value.charAt(0).toUpperCase() + value.slice(1)}
                            </Link>
                        );
                    }

                    return isLast ? (
                        <Typography key={index} color="text.primary" fontWeight={600}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Typography>
                    ) : (
                        <Link key={index} to={routeTo} style={{ textDecoration: "none", color: "inherit" }}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </Stack>
    );
};

export default BreadcrumbComponent;
