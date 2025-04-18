
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
import { useParams } from 'react-router-dom';
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

const CategoryDetailsPage = () => {
    const { categoryName } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedApi, setExpandedApi] = useState(null);
    const [apiDetailsMap, setApiDetailsMap] = useState({});

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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    return (
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
                    <AccordionSummary
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

                <Divider sx={{ marginBottom: 1}} />

                {apis.map(api => (
                    <Paper
                        key={api.id}
                        sx={{
                            p: 3,
                            mb: 2,
                            borderRadius: 2,
                            '&:hover': {
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                cursor: 'pointer'
                            },
                            textAlign: 'left' 
                        }}
                    >
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleExpandClick(api.id)}
                        >
                            <Box>
                                <Typography variant="h6" sx={{
                                    color: '#00796b',
                                    textAlign: 'left' 
                                }}>
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
                            <IconButton size="small">
                                {expandedApi === api.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Box>

                        <Collapse in={expandedApi === api.id} timeout="auto" unmountOnExit>
                            <Typography variant="subtitle2" sx={{ 
                                mt: 2, 
                                mb: 1,
                                color: '#00796b',
                                fontWeight: 600
                            }}>
                                Configuration
                            </Typography>
                            {renderApiConfiguration(apiDetailsMap[api.id])}
                        </Collapse>
                    </Paper>
                ))}
            </Paper>
        </Box>
    );
};

export default CategoryDetailsPage;