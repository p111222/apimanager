import React from "react";
import { useLocation, Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";

const BreadcrumbComponent = () => {
    const location = useLocation();

    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <Stack spacing={2} sx={{ padding: "4px 8px" }}>
            <Breadcrumbs sx={{ fontSize: "0.85rem" }} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <HomeIcon fontSize="small" sx={{ marginRight: "4px" }} />
                </Link>

                {pathnames.map((value, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;

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
