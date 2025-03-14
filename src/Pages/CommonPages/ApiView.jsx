import React, { useState, useEffect } from 'react';
import BreadcrumbComponent from '../../Components/BreadcrumbComponent';
import { Tabs, Tab, Box, MenuItem, Select, FormControl } from "@mui/material";
import AppTab from '../../Components/AppTab';
import ParamsTab from '../../Components/ParamsTab';
import HeadersTab from '../../Components/HeadersTab';
import BodyTab from '../../Components/BodyTab';
import AuthorizationTab from '../../Components/AuthorizationTab';
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import axios from 'axios';

const ApiView = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedError, setSelectedError] = useState("400");
    const [copied, setCopied] = useState({ request: false, response: false, error: false });
    const [apiDetails, setApiDetails] = useState(null);
    const [curlCommand, setCurlCommand] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [errorResponse, setErrorResponse] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const endpoint = queryParams.get('endpoint');
    const apiId = queryParams.get('apiId');
    const axiosPrivate = useAxiosPrivate();

    // Utility function to get the Bearer token
    const getBearerToken = async () => {
        try {
          const response = await axiosPrivate.get(
            "http://localhost:8083/token",  // Updated URL
            null,  // No request body needed
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          console.log("Generated Bearer Token:", response.data.access_token);  // Print the token
          return response.data.access_token;
        } catch (error) {
          console.error("Error fetching Bearer token:", error.response?.data || error.message);
          throw new Error("Failed to obtain Bearer token");
        }
      };      


    useEffect(() => {
        const fetchApiDetails = async () => {
            try {

                const token = await getBearerToken();

                const response = await axiosPrivate.post(
                    `https://api.kriate.co.in:8344/api/am/publisher/v4/apis/${apiId}/generate-mock-scripts`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setApiDetails(response.data);
                console.log("Fetched API Details:", response.data);

                // Get the first error code available and set it as default
                const endpoint = Object.keys(response.data.paths)[0];
                const operation = response.data.paths[endpoint]?.post || response.data.paths[endpoint]?.get;
                const errorCodes = Object.keys(operation?.responses || {});
                if (errorCodes.length > 0) {
                    setSelectedError(errorCodes[0]);
                }

                // Generate the cURL command
                const generatedCurl = generateCurlCommand(response.data);
                setCurlCommand(generatedCurl);

                // Simulate API response
                setApiResponse(JSON.stringify(response.data, null, 2));
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

        if (apiId) fetchApiDetails();
    }, [apiId]);

    useEffect(() => {
        if (apiDetails) {
            const endpoint = Object.keys(apiDetails.paths)[0];
            const operation = apiDetails.paths[endpoint]?.post || apiDetails.paths[endpoint]?.get;

            // Fetching the actual response body for the API Response section
            const responseContent = operation?.responses?.["200"]?.content?.["application/json"]?.schema?.properties || {};
            setApiResponse(JSON.stringify(responseContent, null, 2));

            // Fetching the error response for the selected error code
            const errorContent = operation?.responses?.[selectedError]?.content?.["application/json"]?.schema?.properties || {};
            setErrorResponse(JSON.stringify(errorContent, null, 2));
        }
    }, [selectedError, apiDetails]);


    // Generate cURL command based on API details
    const generateCurlCommand = (details) => {
        const endpoint = Object.keys(details.paths)[0];
        const operation = details.paths[endpoint]?.post || details.paths[endpoint]?.get;
        const method = operation ? (details.paths[endpoint].post ? "POST" : "GET") : "GET";

        let curl = `curl -X ${method} "${endpoint}" \\\n`;

        // Add headers
        const headers = operation?.parameters?.filter((param) => param.in === "header") || [];
        headers.forEach((header) => {
            const headerName = header.name;
            const headerValue = header.schema?.example || "";
            curl += `    -H "${headerName}: ${headerValue}" \\\n`;
        });

        // Add request body (for POST or PUT)
        if (method === "POST" || method === "PUT") {
            const body = operation?.requestBody?.content?.["application/json"]?.schema?.properties || {};
            const requestBody = JSON.stringify(
                Object.fromEntries(Object.entries(body).map(([key, value]) => [key, value.example || ""])),
                null,
                2
            );
            curl += `    -d '${requestBody}'`;
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
        <div>
            <BreadcrumbComponent />
            <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: '8px' }}>
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="API Tabs"
                    sx={{
                        minHeight: "20px",
                        "& .MuiTabs-indicator": { height: "2px" },
                    }}
                >
                    <Tab label="App" />
                    <Tab label="Params" />
                    <Tab label="Headers" />
                    <Tab label="Body" />
                    <Tab label="Authorization" />
                </Tabs>
            </Box>

            <div className="flex h-[calc(100vh-140px)] mt-4">
                <div className="w-1/2 p-1">
                    <Box sx={{ padding: 1 }}>
                        {selectedTab === 0 && <AppTab apiDetails={apiDetails} />}
                        {selectedTab === 1 && <ParamsTab apiDetails={apiDetails} />}
                        {selectedTab === 2 && <HeadersTab apiDetails={apiDetails} />}
                        {selectedTab === 3 && <BodyTab apiDetails={apiDetails} />}
                        {selectedTab === 4 && <AuthorizationTab apiDetails={apiDetails} />}
                    </Box>
                </div>

                <div className="w-1/2 p-4">
                    {/* API Request */}
                    <div className="bg-gray-800 p-3 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white text-sm font-semibold">API Request</h3>
                            <button
                                className="text-xs bg-gray-700 px-2 py-1 rounded text-white hover:bg-gray-600"
                                onClick={() => copyToClipboard(curlCommand, "request")}
                            >
                                {copied.request ? "✅ Copied" : "📋 Copy"}
                            </button>
                        </div>
                        <div className="bg-gray-900 text-yellow-400 p-4 rounded-md text-sm font-mono h-40 overflow-y-auto custom-scrollbar">
                            <pre className="text-left">{curlCommand}</pre>
                        </div>
                    </div>

                    {/* API Response */}
                    <div className="bg-gray-800 p-3 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white text-sm font-semibold">API Response</h3>
                            <button
                                className="text-xs bg-gray-700 px-2 py-1 rounded text-white hover:bg-gray-600"
                                onClick={() => copyToClipboard(apiResponse, "response")}
                            >
                                {copied.response ? "✅ Copied" : "📋 Copy"}
                            </button>
                        </div>
                        <div className="bg-gray-900 text-green-400 p-4 rounded-md text-sm font-mono h-40 overflow-y-auto custom-scrollbar">
                            <pre className="text-left">{apiResponse}</pre>
                        </div>
                    </div>

                    {/* Error Response */}
                    <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white text-sm font-semibold">Error Response</h3>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
                                <Select
                                    value={selectedError}
                                    onChange={(e) => setSelectedError(e.target.value)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    }}
                                >
                                    {Object.keys(apiDetails?.paths?.[endpoint]?.post?.responses || {}).map((code) => (
                                        <MenuItem key={code} value={code}>{code}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="bg-gray-900 text-red-400 p-4 rounded-md text-sm font-mono h-40 overflow-y-auto custom-scrollbar">
                            <pre className="text-left">{errorResponse || "No Error Response"}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiView;
