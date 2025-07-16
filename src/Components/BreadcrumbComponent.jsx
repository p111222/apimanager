import React, { useContext } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import { AuthContext } from "../Context/AuthContext";
import { Box } from "@mui/material";
import { useQuery } from "react-query";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";

// const BreadcrumbComponent = () => {
//     const location = useLocation();
//     const { user } = useContext(AuthContext);
//     const { categoryName } = useParams();
//     const { apiId } = useParams();


//     const pathnames = location.pathname.split("/").filter((x) => x);

//     // Determine the role-specific dashboard path
//     const dashboardPath = user?.roles?.includes("admin") ? "/admin/apidashboard" : "/user/apidashboard";

//     return (
//         <Stack spacing={2} sx={{ padding: "4px 8px" }}>
//             <Breadcrumbs
//                 sx={{ fontSize: "0.85rem" }}
//                 separator={<NavigateNextIcon fontSize="small" />}
//                 aria-label="breadcrumb"
//             >
//                 <Link to={dashboardPath} style={{ textDecoration: "none", color: "inherit" }}>
//                     <HomeIcon fontSize="small" sx={{ marginRight: "4px" }} />
//                 </Link>

//                 {pathnames.map((value, index) => {
//                     const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
//                     const isLast = index === pathnames.length - 1;
//                     const isCategoryDetails = value === "category-details";
//                     const isApiDetails = value === "api-details";


//                     // Handle "user" and "admin" breadcrumb links to redirect to the dashboard
//                     if (value === "user" || value === "admin") {
//                         return (
//                             <Link
//                                 key={index}
//                                 to={dashboardPath}
//                                 style={{ textDecoration: "none", color: "inherit" }}
//                             >
//                                 {value.charAt(0).toUpperCase() + value.slice(1)}
//                             </Link>
//                         );
//                     }

//                     if (isApiDetails) {
//                         return (
//                             <Typography key={index} color="text.primary" fontWeight={600}>
//                                 {apiId || "API Details"}
//                             </Typography>
//                         );
//                     }

//                     if (isCategoryDetails) {
//                         return (
//                             <Typography key={index} color="text.primary" fontWeight={600}>
//                                 {categoryName || "Category Details"}
//                             </Typography>
//                         );
//                     }

//                     return isLast ? (
//                         <Typography key={index} color="text.primary" fontWeight={600}>
//                             {value.charAt(0).toUpperCase() + value.slice(1)}
//                         </Typography>
//                     ) : (
//                         <Link key={index} to={routeTo} style={{ textDecoration: "none", color: "inherit" }}>
//                             {value.charAt(0).toUpperCase() + value.slice(1)}
//                         </Link>
//                     );
//                 })}
//             </Breadcrumbs>
//         </Stack>
//     );
// };

// export default BreadcrumbComponent;


// const BreadcrumbComponent = () => {
//     const location = useLocation();
//     const { user } = useContext(AuthContext);
//     const { apiId, categoryName } = useParams();

//     const pathnames = location.pathname.split("/").filter((x) => x);
//     const dashboardPath = user?.roles?.includes("admin") ? "/admin/apidashboard" : "/user/apidashboard";

//     return (
//         <Stack spacing={2} sx={{ padding: "4px 8px" }}>
//             <Breadcrumbs
//                 sx={{ 
//                     fontSize: "0.85rem",
//                     display: 'flex',
//                     alignItems: 'center',
//                     flexWrap: 'nowrap',
//                     overflow: 'hidden'
//                 }}
//                 separator={<NavigateNextIcon fontSize="small" />}
//                 aria-label="breadcrumb"
//             >
//                 <Link to={dashboardPath} style={{ textDecoration: "none", color: "inherit", display: 'flex', alignItems: 'center' }}>
//                     <HomeIcon fontSize="small" sx={{ marginRight: "4px" }} />
//                 </Link>

//                 {pathnames.map((value, index) => {
//                     const isAdminOrUser = value === "user" || value === "admin";
//                     const isApiDetails = value === "api-details";
//                     const isCategoryDetails = value === "category-details";
//                     const isLast = index === pathnames.length - 1;
//                     const isIdSegment = apiId && value === apiId;
//                     const isNameSegment = categoryName && value === categoryName;

//                     // Skip rendering if this is the ID/name segment
//                     if (isIdSegment || isNameSegment) {
//                         return null;
//                     }

//                     if (isAdminOrUser) {
//                         return (
//                             <Link
//                                 key={index}
//                                 to={dashboardPath}
//                                 style={{ 
//                                     textDecoration: "none", 
//                                     color: "inherit",
//                                     display: 'flex',
//                                     alignItems: 'center'
//                                 }}
//                             >
//                                 {value.charAt(0).toUpperCase() + value.slice(1)}
//                             </Link>
//                         );
//                     }

//                     if (isApiDetails) {
//                         return (
//                             <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
//                                     API Details
//                                 </Typography>
//                                 <NavigateNextIcon fontSize="small" sx={{ mx: 0.5 }} />
//                                 <Typography color="text.primary" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
//                                     {apiId}
//                                 </Typography>
//                             </Box>
//                         );
//                     }

//                     if (isCategoryDetails) {
//                         return (
//                             <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
//                                     Category
//                                 </Typography>
//                                 <NavigateNextIcon fontSize="small" sx={{ mx: 0.5 }} />
//                                 <Typography color="text.primary" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
//                                     {categoryName}
//                                 </Typography>
//                             </Box>
//                         );
//                     }

//                     return isLast ? (
//                         <Typography 
//                             key={index} 
//                             color="text.primary" 
//                             fontWeight={600}
//                             sx={{ whiteSpace: 'nowrap' }}
//                         >
//                             {value.charAt(0).toUpperCase() + value.slice(1)}
//                         </Typography>
//                     ) : (
//                         <Link 
//                             key={index} 
//                             to={`/${pathnames.slice(0, index + 1).join("/")}`}
//                             style={{ 
//                                 textDecoration: "none", 
//                                 color: "inherit",
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 whiteSpace: 'nowrap'
//                             }}
//                         >
//                             {value.charAt(0).toUpperCase() + value.slice(1)}
//                         </Link>
//                     );
//                 })}
//             </Breadcrumbs>
//         </Stack>
//     );
// };

// export default BreadcrumbComponent;

const BreadcrumbComponent = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const { apiId, categoryName } = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const { data: apiName, isLoading, error } = useQuery(['apiDetails', apiId], async () => {
        // const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
        const response = await axiosPrivate.get(`/getapi/${apiId}`);
        return response.data;
    });

    const pathnames = location.pathname.split("/").filter((x) => x);
    const dashboardPath = user?.roles?.includes("admin") ? "/admin/apidashboard" : "/user/apidashboard";

    // Get the previous location state
    const prevLocation = location.state?.from || null;

    // Function to clean path segments (remove admin/user and their dashboard)
    const getCleanPathSegments = () => {
        const segments = [...pathnames];

        // Remove 'admin' or 'user' and their dashboard if present
        if (segments.length > 0 && (segments[0] === 'admin' || segments[0] === 'user')) {
            segments.shift(); // Remove 'admin' or 'user'
            if (segments.length > 0 && segments[0] === 'apidashboard') {
                segments.shift(); // Remove 'apidashboard'
            }
        }

        return segments;
    };

    const cleanPathSegments = getCleanPathSegments();

    return (
        <Stack spacing={2} sx={{ padding: "4px 8px" }}>
            <Breadcrumbs
                sx={{
                    fontSize: "0.85rem",
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    overflow: 'hidden'
                }}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                <Link to={dashboardPath} style={{ textDecoration: "none", color: "inherit", display: 'flex', alignItems: 'center' }}>
                    <HomeIcon fontSize="small" sx={{ marginRight: "4px" }} />
                </Link>

                {/* Handle category details breadcrumb */}
                {prevLocation?.pathname?.includes('category-details') && (
                    <Link
                        to={prevLocation.pathname}
                        state={{ from: location }}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {decodeURIComponent(prevLocation.pathname.split('/').pop().replace(/-/g, ' '))}
                    </Link>
                )}

                {cleanPathSegments.map((value, index) => {
                    const isApiDetails = value === "api-details";
                    const isCategoryDetails = value === "category-details";
                    const isLast = index === cleanPathSegments.length - 1;
                    const isIdSegment = apiId && value === apiId;
                    const isNameSegment = categoryName && value === categoryName;

                    // Skip rendering if this is the ID/name segment
                    if (isIdSegment || isNameSegment) {
                        return null;
                    }

                    if (isApiDetails) {
                        return (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                    API Details
                                </Typography>
                                <NavigateNextIcon fontSize="small" sx={{ mx: 0.5 }} />
                                <Typography color="text.primary" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                                    {apiName.name}
                                </Typography>
                            </Box>
                        );
                    }

                    if (isCategoryDetails) {
                        return (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                    Category
                                </Typography>
                                <NavigateNextIcon fontSize="small" sx={{ mx: 0.5 }} />
                                <Typography color="text.primary" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                                    {categoryName}
                                </Typography>
                            </Box>
                        );
                    }

                    return isLast ? (
                        <Typography
                            key={index}
                            color="text.primary"
                            fontWeight={600}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            {value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')}
                        </Typography>
                    ) : (
                        <Link
                            key={index}
                            to={`/${pathnames.slice(0, pathnames.indexOf(value) + 1).join("/")}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                display: 'flex',
                                alignItems: 'center',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </Stack>
    );
};

export default BreadcrumbComponent;