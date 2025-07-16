// import React, { useState, useEffect } from 'react';
// import BreadcrumbComponent from '../../Components/BreadcrumbComponent';
// import { Tabs, Tab, Box, MenuItem, Select, FormControl } from "@mui/material";
// import AppTab from '../../Components/AppTab';
// import ParamsTab from '../../Components/ParamsTab';
// import HeadersTab from '../../Components/HeadersTab';
// import BodyTab from '../../Components/BodyTab';
// import AuthorizationTab from '../../Components/AuthorizationTab';
// import { useLocation } from 'react-router-dom';
// import useAxiosPrivate from "../../Hooks/useAxiosPrivate";

// const ApiView = ({ apiId, endpoint }) => {
//     const [selectedTab, setSelectedTab] = useState(0);
//     const [selectedError, setSelectedError] = useState("400");
//     const [copied, setCopied] = useState({ request: false, response: false, error: false });
//     const [apiDetails, setApiDetails] = useState(null);
//     const [curlCommand, setCurlCommand] = useState("");
//     const [apiResponse, setApiResponse] = useState("");
//     const [errorResponse, setErrorResponse] = useState("");
//     const location = useLocation();
//     // const queryParams = new URLSearchParams(location.search);
//     // const endpoint = queryParams.get('endpoint');
//     // const apiId = queryParams.get('apiId');
//     const axiosPrivate = useAxiosPrivate();

//     console.log("apiId" + apiId + "endpoint" + endpoint);


//     // Utility function to get the Bearer token
//     const getBearerToken = async () => {
//         try {
//             const response = await axiosPrivate.get(
//                 "http://localhost:8083/token",
//                 // "token",  
//                 null,
//                 {
//                     headers: {
//                         "Content-Type": "application/x-www-form-urlencoded",
//                     },
//                 }
//             );
//             console.log("Generated Bearer Token:", response.data.access_token);  // Print the token
//             return response.data.access_token;
//         } catch (error) {
//             console.error("Error fetching Bearer token:", error.response?.data || error.message);
//             throw new Error("Failed to obtain Bearer token");
//         }
//     };


//     useEffect(() => {
//         const fetchApiDetails = async () => {
//             try {
//                 const token = await getBearerToken();

//                 // Fetch API details using the provided apiId
//                 const response = await axiosPrivate.post(
//                     `https://api.kriate.co.in:8344/api/am/publisher/v4/apis/${apiId}/generate-mock-scripts`,
//                     null,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 );

//                 setApiDetails(response.data);
//                 console.log("Fetched API Details:", response.data);

//                 // If the API response is fetched, use the provided 'endpoint' prop
//                 if (endpoint) {
//                     // Set the first error code as the default, but check for the correct operation
//                     const operation = response.data.paths[endpoint]?.post || response.data.paths[endpoint]?.get;
//                     const errorCodes = Object.keys(operation?.responses || {});
//                     if (errorCodes.length > 0) {
//                         setSelectedError(errorCodes[0]);
//                     }

//                     // Generate cURL command and set API response content
//                     const generatedCurl = generateCurlCommand(response.data);
//                     setCurlCommand(generatedCurl);
//                     const responseContent = operation?.responses?.["200"]?.content?.["application/json"]?.schema?.properties || {};
//                     setApiResponse(JSON.stringify(responseContent, null, 2));
//                 }
//             } catch (error) {
//                 console.error("Error fetching API details:", error);
//                 setErrorResponse(
//                     JSON.stringify(error.response?.data || {
//                         status: "error",
//                         message: error.message || "Unknown error occurred"
//                     }, null, 2)
//                 );
//             }
//         };

//         if (apiId && endpoint) {
//             fetchApiDetails();
//         }
//     }, [apiId, endpoint]);  // Add 'endpoint' as a dependency


//     useEffect(() => {
//         if (apiDetails) {
//             const endpoint = Object.keys(apiDetails.paths)[0];
//             const operation = apiDetails.paths[endpoint]?.post || apiDetails.paths[endpoint]?.get;

//             // Fetching the actual response body for the API Response section
//             const responseContent = operation?.responses?.["200"]?.content?.["application/json"]?.schema?.properties || {};
//             setApiResponse(JSON.stringify(responseContent, null, 2));

//             // Fetching the error response for the selected error code
//             const errorContent = operation?.responses?.[selectedError]?.content?.["application/json"]?.schema?.properties || {};
//             setErrorResponse(JSON.stringify(errorContent, null, 2));
//         }
//     }, [selectedError, apiDetails]);


//     // Generate cURL command based on API details
//     const generateCurlCommand = (details) => {
//         const endpoint = Object.keys(details.paths)[0];
//         const operation = details.paths[endpoint]?.post || details.paths[endpoint]?.get;
//         const method = operation ? (details.paths[endpoint].post ? "POST" : "GET") : "GET";

//         let curl = `curl -X ${method} "${endpoint}" \\\n`;

//         // Add headers
//         const headers = operation?.parameters?.filter((param) => param.in === "header") || [];
//         headers.forEach((header) => {
//             const headerName = header.name;
//             const headerValue = header.schema?.example || "";
//             curl += `    -H "${headerName}: ${headerValue}" \\\n`;
//         });

//         // Add request body (for POST or PUT)
//         if (method === "POST" || method === "PUT") {
//             const body = operation?.requestBody?.content?.["application/json"]?.schema?.properties || {};
//             const requestBody = JSON.stringify(
//                 Object.fromEntries(Object.entries(body).map(([key, value]) => [key, value.example || ""])),
//                 null,
//                 2
//             );
//             curl += `    -d '${requestBody}'`;
//         }

//         return curl;
//     };

//     const handleTabChange = (event, newValue) => {
//         setSelectedTab(newValue);
//     };

//     const copyToClipboard = (text, type) => {
//         navigator.clipboard.writeText(text)
//             .then(() => {
//                 setCopied(prev => ({ ...prev, [type]: true }));

//                 setTimeout(() => {
//                     setCopied(prev => ({ ...prev, [type]: false }));
//                 }, 2000);
//             })
//             .catch(err => console.error("Failed to copy: ", err));
//     };

//     console.log("apiDetails in appview"+JSON.stringify(apiDetails));


//     return (
//         <div>
//             {/* <BreadcrumbComponent /> */}
//             <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: '8px' }}>
//                 <Tabs value={selectedTab} onChange={handleTabChange} aria-label="API Tabs"
//                     sx={{
//                         minHeight: "20px",
//                         "& .MuiTabs-indicator": { height: "2px" },
//                     }}
//                 >
//                     <Tab label="App" />
//                     <Tab label="Params" />
//                     <Tab label="Headers" />
//                     <Tab label="Body" />
//                     <Tab label="Authorization" />
//                 </Tabs>
//             </Box>

//             <div className="flex mt-4">
//                 <div className="w-1/2 p-1">
//                     <Box sx={{ padding: 1 }}>
//                         {selectedTab === 0 && <AppTab apiDetails={apiDetails} />}
//                         {selectedTab === 1 && <ParamsTab apiDetails={apiDetails} />}
//                         {selectedTab === 2 && <HeadersTab apiDetails={apiDetails} />}
//                         {selectedTab === 3 && <BodyTab apiDetails={apiDetails} />}
//                         {selectedTab === 4 && <AuthorizationTab apiDetails={apiDetails} />}
//                     </Box>
//                 </div>

//                 <div className="w-1/2 p-4">
//                     {/* API Request */}
//                     <div className="bg-gray-800 p-3 rounded-lg mb-4">
//                         <div className="flex justify-between items-center mb-2">
//                             <h3 className="text-white text-sm font-semibold">API Request</h3>
//                             <button
//                                 className="text-xs bg-gray-700 px-2 py-1 rounded text-white hover:bg-gray-600"
//                                 onClick={() => copyToClipboard(curlCommand, "request")}
//                             >
//                                 {copied.request ? "✅ Copied" : "📋 Copy"}
//                             </button>
//                         </div>
//                         <div className="bg-gray-900 text-yellow-400 p-4 rounded-md text-sm font-mono h-40 overflow-y-auto custom-scrollbar">
//                             <pre className="text-left">{curlCommand}</pre>
//                         </div>
//                     </div>

//                     {/* API Response */}
//                     <div className="bg-gray-800 p-3 rounded-lg mb-4">
//                         <div className="flex justify-between items-center mb-2">
//                             <h3 className="text-white text-sm font-semibold">API Response</h3>
//                             <button
//                                 className="text-xs bg-gray-700 px-2 py-1 rounded text-white hover:bg-gray-600"
//                                 onClick={() => copyToClipboard(apiResponse, "response")}
//                             >
//                                 {copied.response ? "✅ Copied" : "📋 Copy"}
//                             </button>
//                         </div>
//                         <div className="bg-gray-900 text-green-400 p-4 rounded-md text-sm font-mono h-40 overflow-y-auto custom-scrollbar">
//                             <pre className="text-left">{apiResponse}</pre>
//                         </div>
//                     </div>

//                     {/* Error Response */}
//                     <div className="bg-gray-800 p-3 rounded-lg">
//                         <div className="flex justify-between items-center mb-2">
//                             <h3 className="text-white text-sm font-semibold">Error Response</h3>
//                             <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
//                                 <Select
//                                     value={selectedError}
//                                     onChange={(e) => setSelectedError(e.target.value)}
//                                     sx={{
//                                         color: 'white',
//                                         '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
//                                     }}
//                                 >
//                                     {Object.keys(apiDetails?.paths?.[endpoint]?.post?.responses || {}).map((code) => (
//                                         <MenuItem key={code} value={code}>{code}</MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </div>
//                         <div className="bg-gray-900 text-red-400 p-4 rounded-md text-sm font-mono h-40 overflow-y-auto custom-scrollbar">
//                             <pre className="text-left">{errorResponse || "No Error Response"}</pre>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ApiView;

import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, MenuItem, Select, FormControl, Typography, Button } from "@mui/material";
import AppTab from '../../Components/AppTab';
import ParamsTab from '../../Components/ParamsTab';
import HeadersTab from '../../Components/HeadersTab';
import BodyTab from '../../Components/BodyTab';
import AuthorizationTab from '../../Components/AuthorizationTab';
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";

const ApiView = ({ apiId, endpoint }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedError, setSelectedError] = useState("");
    const [copied, setCopied] = useState({ request: false, response: false, error: false });
    const [apiDetails, setApiDetails] = useState(null);
    const [curlCommand, setCurlCommand] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [errorResponse, setErrorResponse] = useState("");
    const axiosPrivate = useAxiosPrivate();

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

    // console.log("apiview" + apiId);

    useEffect(() => {
        const fetchApiDetails = async () => {
            try {
                const token = await getBearerToken();

                // Fetch API details using the provided apiId
                const response = await axiosPrivate.post(
                    // `https://api.kriate.co.in:8344/api/am/publisher/v4/apis/${apiId}/generate-mock-scripts`,
                    // `http://localhost:8084/api/generate-mock-scripts/${apiId}`,
                    `/generate-mock-scripts/${apiId}`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const endpointData = response.data.paths[endpoint];
                console.log("endpointData" + JSON.stringify(endpointData, null, 2));

                if (endpointData) {
                    setApiDetails({ paths: { [endpoint]: endpointData } });
                }

                // Generate cURL command and set API response content for the selected endpoint
                if (endpointData) {
                    const operation = endpointData.post || endpointData.get || endpointData.put;
                    console.log("response.data" + JSON.stringify(response.data, null, 2));

                    const generatedCurl = generateCurlCommand(response.data);
                    console.log("generatedCurl" + generatedCurl);

                    setCurlCommand(generatedCurl);
                    console.log("operation" + JSON.stringify(operation, null, 2));

                    const responseContent = operation?.responses?.["200"]?.content?.["application/json"]?.schema?.properties || {};
                    console.log("responseContent" + JSON.stringify(responseContent, null, 2));

                    setApiResponse(JSON.stringify(responseContent, null, 2));
                }
            } catch (error) {
                console.error("Error fetching API details:", error);
                setErrorResponse(
                    JSON.stringify(error.response?.data || {
                        status: "error",
                        message: error.message || "Unknown error occurred"
                    }, null, 2)
                );
            }
        };

        if (apiId && endpoint) {
            fetchApiDetails();
        }
    }, [apiId, endpoint]);
    console.log("apiDetails above" + JSON.stringify(apiDetails, null, 2));

    useEffect(() => {
        if (apiDetails && selectedError) {
            const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];
            let errorContent = {};

            // Find the first method that has the selected error
            for (const method of httpMethods) {
                const operation = apiDetails.paths[endpoint]?.[method];
                if (operation?.responses?.[selectedError]) {
                    errorContent = operation.responses[selectedError]?.content?.["application/json"]?.schema?.properties || {};
                    break;
                }
            }

            setErrorResponse(JSON.stringify(errorContent, null, 2));
        }
    }, [selectedError, apiDetails, endpoint]);

    // console.log("api details in apiview" + JSON.stringify(apiDetails, null, 2));
    // console.log("curl command" + curlCommand);
    // console.log("apiresponse below" + apiResponse);

    const generateCurlCommand = (details) => {
        const endpointData = details.paths[endpoint];
        // Determine the HTTP method (prioritize in this order: POST, PUT, DELETE, GET)
        const operation = endpointData?.post || endpointData?.put || endpointData?.delete || endpointData?.get;
        let method = "GET";

        if (endpointData?.post) method = "POST";
        else if (endpointData?.put) method = "PUT";
        else if (endpointData?.delete) method = "DELETE";

        let curl = `curl -X ${method} "${endpoint}" \\\n`;

        // console.log("operation" + JSON.stringify(operation, null, 2));

        // Add headers
        const headers = operation?.parameters?.filter((param) => param.in === "header") || [];
        headers.forEach((header) => {
            const headerName = header.name;
            const headerValue = header.schema?.example || "";
            curl += `    -H "${headerName}: ${headerValue}" \\\n`;
        });

        // Add request body (for POST, PUT, and potentially DELETE)
        if (method === "POST" || method === "PUT" || (method === "DELETE" && operation?.requestBody)) {
            const body = operation?.requestBody?.content?.["application/json"]?.schema?.properties || {};
            const requestBody = JSON.stringify(
                Object.fromEntries(Object.entries(body).map(([key, value]) => [key, value.example || ""])),
                null,
                2
            );
            if (requestBody !== "{}") {
                curl += `    -d '${requestBody.replace(/\n/g, '\\n')}'`; 
            }
        }

        return curl;
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(prev => ({ ...prev, [type]: true }));

                setTimeout(() => {
                    setCopied(prev => ({ ...prev, [type]: false }));
                }, 2000);
            })
            .catch(err => console.error("Failed to copy: ", err));
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: '8px' }}>
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="API Tabs">
                    <Tab label="App" />
                    <Tab label="Params" />
                    <Tab label="Headers" />
                    <Tab label="Body" />
                    <Tab label="Authorization" />
                </Tabs>
            </Box>

            <Box sx={{
                display: 'flex',
                mt: 4,
                flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on desktop
                width: '100%'
            }}>
                {/* Left Panel - Tabs Content */}
                <Box sx={{
                    width: { xs: '100%', md: '50%' },
                    p: 1,
                    boxSizing: 'border-box' // Ensures padding is included in width calculation
                }}>
                    <Box sx={{ padding: 1 }}>
                        {selectedTab === 0 && <AppTab apiDetails={apiDetails} />}
                        {selectedTab === 1 && <ParamsTab apiDetails={apiDetails} />}
                        {selectedTab === 2 && <HeadersTab apiDetails={apiDetails} />}
                        {selectedTab === 3 && <BodyTab apiDetails={apiDetails} />}
                        {selectedTab === 4 && <AuthorizationTab apiDetails={apiDetails} />}
                    </Box>
                </Box>

                {/* Right Panel - Request/Response */}
                <Box sx={{
                    width: { xs: '100%', md: '50%' },
                    p: { xs: 1, md: 2 },
                    boxSizing: 'border-box'
                }}>
                    {/* API Request */}
                    <Box sx={{
                        bgcolor: 'grey.800',
                        p: 2,
                        borderRadius: 1,
                        mb: 2,
                        width: '100%',
                        textAlign: 'left'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                API Request
                            </Typography>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => copyToClipboard(curlCommand, "request")}
                                sx={{
                                    bgcolor: 'grey.700',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'grey.600' },
                                    minWidth: 0,
                                    padding: '4px 8px',
                                    fontSize: '0.75rem'
                                }}
                            >
                                {copied.request ? "✅ Copied" : "📋 Copy"}
                            </Button>
                        </Box>
                        <Box sx={{
                            bgcolor: 'grey.900',
                            color: 'warning.light',
                            p: 2,
                            borderRadius: 1,
                            // height: 160,
                            overflow: 'auto'
                        }}>
                            <pre style={{
                                margin: 0,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word' // This ensures long lines wrap
                            }}>
                                {curlCommand}
                            </pre>
                        </Box>
                    </Box>

                    {/* API Response */}
                    <Box sx={{
                        bgcolor: 'grey.800',
                        p: 2,
                        borderRadius: 1,
                        mb: 2,
                        textAlign: 'left'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                API Response
                            </Typography>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => copyToClipboard(apiResponse, "response")}
                                sx={{
                                    bgcolor: 'grey.700',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'grey.600' },
                                    minWidth: 0,
                                    padding: '4px 8px',
                                    fontSize: '0.75rem'
                                }}
                            >
                                {copied.response ? "✅ Copied" : "📋 Copy"}
                            </Button>
                        </Box>
                        <Box sx={{
                            bgcolor: 'grey.900',
                            color: 'success.light',
                            p: 2,
                            borderRadius: 1,
                            // height: 160,
                            overflow: 'auto'
                        }}>
                            <pre style={{
                                margin: 0,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {apiResponse}
                            </pre>
                        </Box>
                    </Box>

                    {/* Error Response */}
                    <Box sx={{
                        bgcolor: 'grey.800',
                        p: 2,
                        borderRadius: 1,
                        textAlign: 'left'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                Error Response
                            </Typography>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
                                <Select
                                    value={selectedError}
                                    onChange={(e) => setSelectedError(e.target.value)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                        '& .MuiSvgIcon-root': { color: 'white' }
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select an error</em>
                                    </MenuItem>
                                    {(() => {
                                        // Get all available HTTP methods for this endpoint
                                        const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];
                                        const allErrorCodes = new Set();

                                        // Collect all error codes from all methods
                                        httpMethods.forEach(method => {
                                            const responses = apiDetails?.paths?.[endpoint]?.[method]?.responses;
                                            if (responses) {
                                                Object.keys(responses)
                                                    .filter(code => code !== "200")
                                                    .forEach(code => allErrorCodes.add(code));
                                            }
                                        });

                                        if (allErrorCodes.size > 0) {
                                            return Array.from(allErrorCodes).map(code => (
                                                <MenuItem key={code} value={code}>{code}</MenuItem>
                                            ));
                                        }
                                        return <MenuItem disabled>No errors available</MenuItem>;
                                    })()}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{
                            bgcolor: 'grey.900',
                            color: 'error.light',
                            p: 2,
                            borderRadius: 1,
                            overflow: 'auto'
                        }}>
                            <pre style={{
                                margin: 0,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {selectedError ? errorResponse : "Please select an error code"}
                            </pre>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ApiView;
