
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//     Typography,
//     Box,
//     Paper,
//     Chip,
//     CircularProgress,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     Divider
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Info from '@mui/icons-material/Info';
// import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

// const CategoryDetailsPage = () => {
//     const { categoryName } = useParams();
//     const axiosPrivate = useAxiosPrivate();
//     const [apis, setApis] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const randomData = {
//         provider: "Admin",
//         type: "HTTP",
//         version: "1.0.0",
//         status: "PUBLISHED",
//         visibility: "Public"
//     };

//     const getBearerToken = async () => {
//         try {
//             const response = await axiosPrivate.get(
//                 "http://localhost:8083/token",
//                 // "/token",
//                 null,
//                 {
//                     headers: {
//                         "Content-Type": "application/x-www-form-urlencoded",
//                     },
//                 }
//             );
//             return response.data.access_token;
//         } catch (error) {
//             console.error("Error fetching Bearer token:", error.response?.data || error.message);
//             throw new Error("Failed to obtain Bearer token");
//         }
//     };

//     useEffect(() => {
//         const fetchCategoryApis = async () => {
//             try {
//                 const token = await getBearerToken();
//                 const response = await axiosPrivate.get(
//                     `http://localhost:8087/api/category-details?category=${encodeURIComponent(categoryName)}`
//                     // `/category-details?category=${encodeURIComponent(categoryName)}`
//                 );
//                 setApis(response.data.list || []);
//             } catch (error) {
//                 console.error("Error fetching category APIs:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCategoryApis();
//     }, [categoryName]);

//     if (loading) return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <CircularProgress />
//         </Box>
//     );

//     return (
//         <Box
//             sx={{
//                 padding: 4,
//                 backgroundColor: '#f5f7fa',
//                 minHeight: '100vh',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 flexDirection: 'column',
//                 gap: 3
//             }}
//         >
//             <Typography
//                 variant="h4"
//                 sx={{
//                     fontWeight: 'bold',
//                     marginBottom: 2,
//                     textAlign: 'left',
//                     color: '#00796b',
//                     fontSize: '28px',
//                     width: '100%',
//                     maxWidth: 1200
//                 }}
//             >
//                 Category Details - {categoryName}
//             </Typography>

//             <Paper
//                 elevation={3}
//                 sx={{
//                     width: '100%',
//                     maxWidth: 1200,
//                     padding: 3,
//                     borderRadius: 3,
//                     backgroundColor: '#ffffff',
//                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 }}
//             >
//                 <Accordion defaultExpanded>
//                     <AccordionSummary
//                         expandIcon={<ExpandMoreIcon />}
//                         sx={{ backgroundColor: '#e1f5fe' }}
//                     >
//                         <Info color="primary" sx={{
//                             marginRight: 1,
//                             color: '#00796b'
//                         }} />
//                         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                             General Information
//                         </Typography>
//                     </AccordionSummary>

//                     <AccordionDetails sx={{
//                         padding: '24px 32px',
//                         backgroundColor: '#f5f5f5',
//                         borderTop: '1px solid #e0e0e0'
//                     }}>
//                         <Box sx={{
//                             display: 'grid',
//                             gridTemplateColumns: 'minmax(120px, max-content) 1fr',
//                             gap: '12px 8px',
//                             alignItems: 'baseline',
//                         }}>
//                             <Typography variant="body1" sx={{
//                                 fontWeight: 500,
//                                 color: '#00796b',
//                                 alignSelf: 'center',
//                                 textAlign: 'left',
//                             }}>
//                                 Name:
//                             </Typography>
//                             <Typography variant="body1" sx={{
//                                 color: '#424242',
//                                 paddingLeft: '4px',
//                                 textAlign: 'left',
//                             }}>
//                                 {categoryName}
//                             </Typography>

//                             <Typography variant="body1" sx={{
//                                 fontWeight: 500,
//                                 color: '#00796b',
//                                 alignSelf: 'flex-start',
//                                 pt: 1,
//                                 textAlign: 'left',
//                             }}>
//                                 Description:
//                             </Typography>
//                             <Typography
//                                 variant="body1"
//                                 sx={{
//                                     whiteSpace: 'pre-wrap',
//                                     wordBreak: 'break-word',
//                                     lineHeight: '1.8',
//                                     color: '#424242',
//                                     textAlign: 'left',
//                                 }}
//                             >
//                                 {apis[0]?.description || "No description available"}
//                             </Typography>

//                             {[
//                                 { label: 'Provider', value: randomData.provider },
//                                 { label: 'Type', value: randomData.type },
//                                 { label: 'Version', value: randomData.version },
//                                 { label: 'Status', value: randomData.status },
//                                 { label: 'Visibility', value: randomData.visibility }
//                             ].map((item, index) => (
//                                 <React.Fragment key={index}>
//                                     <Typography variant="body1" sx={{
//                                         fontWeight: 500,
//                                         color: '#00796b',
//                                         alignSelf: 'center',
//                                         textAlign: 'left',
//                                     }}>
//                                         {item.label}:
//                                     </Typography>
//                                     <Typography variant="body1" sx={{
//                                         color: '#424242',
//                                         paddingLeft: '4px',
//                                         textAlign: 'left',
//                                     }}>
//                                         {item.value}
//                                     </Typography>
//                                 </React.Fragment>
//                             ))}
//                         </Box>
//                     </AccordionDetails>
//                 </Accordion>

//                 <Box sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     mt: 3,
//                     mb: 2,
//                     p: 2,
//                     backgroundColor: '#e8f5e9',
//                     borderRadius: 1
//                 }}>
//                     <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
//                         API List
//                     </Typography>
//                     <Chip
//                         label={`Total: ${apis.length} APIs`}
//                         color="success"
//                         sx={{
//                             fontWeight: 600,
//                             fontSize: '0.875rem'
//                         }}
//                     />
//                 </Box>

//                 <Divider sx={{ marginBottom: 1}} />

//                 {apis.map(api => (
//                     <Paper
//                         key={api.id}
//                         sx={{
//                             p: 3,
//                             mb: 2,
//                             borderRadius: 2,
//                             '&:hover': {
//                                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//                                 cursor: 'pointer'
//                             },
//                             textAlign: 'left' 
//                         }}
//                     >
//                         <Typography variant="h6" sx={{
//                             color: '#00796b',
//                             textAlign: 'left' 
//                         }}>
//                             {api.name}
//                         </Typography>
//                         <Typography variant="body2" sx={{
//                             mt: 1,
//                             color: '#616161',
//                             whiteSpace: 'pre-line',
//                             textAlign: 'left' 
//                         }}>
//                             {api.description || "No description available"}
//                         </Typography>
//                     </Paper>
//                 ))}
//             </Paper>
//         </Box>
//     );
// };

// export default CategoryDetailsPage;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    Typography,
    Box,
    Paper,
    Chip,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Collapse,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Info from '@mui/icons-material/Info';
import { Security, Public, DirectionsCar, ExpandMore, ExpandLess } from '@mui/icons-material';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import BreadcrumbComponent from '../../Components/BreadcrumbComponent';
import Loader from '../../Assets/loader2.gif';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const CategoryDetailsPage = () => {
    const { categoryName } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedApi, setExpandedApi] = useState(null);
    const [apiDetailsMap, setApiDetailsMap] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const randomData = {
        provider: "Admin",
        type: "HTTP",
        version: "1.0.0",
        status: "PUBLISHED",
        visibility: "Public"
    };

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
            return response.data.access_token;
        } catch (error) {
            console.error("Error fetching Bearer token:", error.response?.data || error.message);
            throw new Error("Failed to obtain Bearer token");
        }
    };

    const fetchApiDetails = async (apiId) => {
        try {
            const token = await getBearerToken();
            const response = await axiosPrivate.get(
                // `http://localhost:8081/api/getapi/${apiId}`
                `/getapi/${apiId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching API details:", error);
            return null;
        }
    };

    const handleExpandClick = async (apiId) => {
        if (expandedApi === apiId) {
            setExpandedApi(null);
        } else {
            setExpandedApi(apiId);
            if (!apiDetailsMap[apiId]) {
                const details = await fetchApiDetails(apiId);
                setApiDetailsMap(prev => ({ ...prev, [apiId]: details }));
            }
        }
    };

    // const handleApiNameClick = (apiId, apiName) => {
    //     const pathPrefix = window.location.pathname.startsWith("/admin") ? "admin" : "user";
    //     navigate(`/${pathPrefix}/api-details/${encodeURIComponent(apiId)}`);
    // };

    const handleApiNameClick = (apiId, apiName) => {
        const pathPrefix = window.location.pathname.startsWith("/admin") ? "admin" : "user";
        navigate(`/${pathPrefix}/api-details/${encodeURIComponent(apiId)}`, {
            state: {
                from: {
                    pathname: location.pathname,
                    categoryName: categoryName
                }
            }
        });
    };

    useEffect(() => {
        const fetchCategoryApis = async () => {
            try {
                const token = await getBearerToken();
                const response = await axiosPrivate.get(
                    // `http://localhost:8087/api/category-details?category=${encodeURIComponent(categoryName)}`
                    `/category-details?category=${encodeURIComponent(categoryName)}`
                );
                setApis(response.data.list || []);
            } catch (error) {
                console.error("Error fetching category APIs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryApis();
    }, [categoryName]);

    const renderApiConfiguration = (apiDetails) => {
        if (!apiDetails) return null;

        return (
            <Box sx={{
                mt: 2,
                p: 2,
                backgroundColor: '#f9f9f9',
                borderRadius: 1,
                borderLeft: '3px solid #00796b'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    alignItems: 'center'
                }}>
                    {/* Transports */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsCar sx={{ mr: 1, color: '#00796b' }} />
                        <Typography variant="body2">
                            <strong>Transports:</strong> {apiDetails.transport?.join(', ')}
                        </Typography>
                    </Box>

                    {/* Security */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Security sx={{ mr: 1, color: '#00796b' }} />
                        <Typography variant="body2">
                            <strong>Security:</strong> {apiDetails.securityScheme?.join(', ')}
                        </Typography>
                    </Box>

                    {/* Visibility */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Public sx={{ mr: 1, color: '#00796b' }} />
                        <Typography variant="body2">
                            <strong>Visibility:</strong> {apiDetails.visibility}
                        </Typography>
                    </Box>

                    {/* Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                            label={apiDetails.lifeCycleStatus}
                            size="small"
                            color={
                                apiDetails.lifeCycleStatus === 'PUBLISHED' ? 'success' :
                                    apiDetails.lifeCycleStatus === 'CREATED' ? 'warning' : 'default'
                            }
                        />
                    </Box>
                </Box>
            </Box>
        );
    };

    if (loading) return (
        // <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        //     <CircularProgress />
        // </Box>

        // <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'background.default' }}>
        //     <img
        //         src={Loader}
        //         alt="Loading..."
        //         style={{
        //             width: '250px',
        //             height: '250px'
        //         }}
        //     />

        // </Box>

        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <DotLottieReact
                src="https://lottie.host/daa52b92-4f61-46f3-b628-4e8763f992f0/uxk1wFWwXN.lottie"
                className="w-[100px] h-[100px]"
                loop
                autoplay
            />
        </div>
    );

    return (
        <>
            {/* <Box sx={{
                // position: 'sticky',
                top: 0,
                zIndex: 1100,
                backgroundColor: '#f8fafc',
                pt: 2,
                pb: 1,
                mb: 1,
                mt: 1
            }}>
                <BreadcrumbComponent />
            </Box> */}

            <Box sx={{
                position: 'sticky',
                top: 65, // Adjust this to match your header height (64px is common for MUI AppBar)
                zIndex: 600,
                backgroundColor: '#f8fafc',
                pt: 2,
                pb: 1,
                mb: 1,
                borderBottom: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <BreadcrumbComponent />
            </Box>

            <Box
                sx={{
                    padding: 2,
                    backgroundColor: '#f5f7fa',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 3
                }}
            >

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 0,
                        marginTop: 1,
                        textAlign: 'left',
                        color: '#00796b',
                        fontSize: '28px',
                        width: '100%',
                        maxWidth: 1200
                    }}
                >
                    Category Details - {categoryName}
                </Typography>

                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        maxWidth: 1200,
                        padding: 3,
                        borderRadius: 3,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Accordion defaultExpanded>
                        {/* <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ backgroundColor: '#e1f5fe' }}
                        >
                            <Info color="primary" sx={{
                                marginRight: 1,
                                color: '#00796b'
                            }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                General Information
                            </Typography>
                        </AccordionSummary> */}

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: '#FFECB3', // Amber-100 equivalent
                                minHeight: '48px', // Matching min-h-12 (3rem)
                                '& .MuiAccordionSummary-content': {
                                    alignItems: 'center' // Center items vertically
                                }
                            }}
                        >
                            <Info sx={{
                                color: '#9CA3AF', // Gray-400 equivalent
                                marginRight: '8px', // mr-2 equivalent
                                fontSize: '1.25rem' // Matching icon size
                            }} />
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                fontSize: '1.125rem', // text-lg
                                color: '#111827' // Gray-900 for text
                            }}>
                                General Information
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{
                            padding: '24px 32px',
                            backgroundColor: '#f5f5f5',
                            borderTop: '1px solid #e0e0e0'
                        }}>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(120px, max-content) 1fr',
                                gap: '12px 8px',
                                alignItems: 'baseline',
                            }}>
                                <Typography variant="body1" sx={{
                                    fontWeight: 500,
                                    color: '#00796b',
                                    alignSelf: 'center',
                                    textAlign: 'left',
                                }}>
                                    Name:
                                </Typography>
                                <Typography variant="body1" sx={{
                                    color: '#424242',
                                    paddingLeft: '4px',
                                    textAlign: 'left',
                                }}>
                                    {categoryName}
                                </Typography>

                                <Typography variant="body1" sx={{
                                    fontWeight: 500,
                                    color: '#00796b',
                                    alignSelf: 'flex-start',
                                    pt: 1,
                                    textAlign: 'left',
                                }}>
                                    Description:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        lineHeight: '1.8',
                                        color: '#424242',
                                        textAlign: 'left',
                                    }}
                                >
                                    {apis[0]?.description || "No description available"}
                                </Typography>

                                {[
                                    { label: 'Provider', value: randomData.provider },
                                    { label: 'Type', value: randomData.type },
                                    { label: 'Version', value: randomData.version },
                                    { label: 'Status', value: randomData.status },
                                    { label: 'Visibility', value: randomData.visibility }
                                ].map((item, index) => (
                                    <React.Fragment key={index}>
                                        <Typography variant="body1" sx={{
                                            fontWeight: 500,
                                            color: '#00796b',
                                            alignSelf: 'center',
                                            textAlign: 'left',
                                        }}>
                                            {item.label}:
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: '#424242',
                                            paddingLeft: '4px',
                                            textAlign: 'left',
                                        }}>
                                            {item.value}
                                        </Typography>
                                    </React.Fragment>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 3,
                        mb: 2,
                        p: 2,
                        backgroundColor: '#e8f5e9',
                        borderRadius: 1
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                            API List
                        </Typography>
                        <Chip
                            label={`Total: ${apis.length} APIs`}
                            color="success"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                        />
                    </Box>

                    <Divider sx={{ marginBottom: 1 }} />

                    {apis.map(api => (
                        <Paper
                            key={api.id}
                            sx={{
                                p: 3,
                                mb: 2,
                                borderRadius: 2,
                                '&:hover': {
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                },
                                textAlign: 'left'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        onClick={() => handleApiNameClick(api.id, api.name)}
                                        sx={{
                                            color: '#00796b',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        {api.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        mt: 1,
                                        color: '#616161',
                                        whiteSpace: 'pre-line',
                                        textAlign: 'left'
                                    }}>
                                        {api.description || "No description available"}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Always visible configuration section */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{
                                    mb: 1,
                                    color: '#00796b',
                                    fontWeight: 600
                                }}>
                                    Configuration
                                </Typography>
                                {renderApiConfiguration(apiDetailsMap[api.id] || api)}
                            </Box>
                        </Paper>
                    ))}
                </Paper>
            </Box>
        </>
    );
};

export default CategoryDetailsPage;