import React, { useState } from 'react'
import BreadcrumbComponent from '../../Components/BreadcrumbComponent';
import { Tabs, Tab, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import AppTab from '../../Components/AppTab';
import ParamsTab from '../../Components/ParamsTab';
import HeadersTab from '../../Components/HeadersTab';
import BodyTab from '../../Components/BodyTab';
import AuthorizationTab from '../../Components/AuthorizationTab';

const ApiView = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedError, setSelectedError] = useState("400"); // Default error response
    const [copied, setCopied] = useState({ request: false, response: false, error: false });

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const curlCommand = `curl -X POST "https://api.example.com/data" \\
    -H "Content-Type: application/json" \\
    -d '{"key": "value"}'`;

    const responseJson = `{
        "status": "success",
        "message": "Data received successfully",
        "data": {
            "id": 12345,
            "name": "Sample Name"
        }
    }`;

    const errorResponses = {
        "400": `{
            "status": "error",
            "code": 400,
            "message": "Bad Request",
            "details": "Invalid input parameters"
        }`,
        "404": `{
            "status": "error",
            "code": 404,
            "message": "Not Found",
            "details": "The requested resource was not found"
        }`,
        "500": `{
            "status": "error",
            "code": 500,
            "message": "Internal Server Error",
            "details": "Something went wrong on our end"
        }`
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied((prev) => ({ ...prev, [type]: true }));

        setTimeout(() => {
            setCopied((prev) => ({ ...prev, [type]: false }));
        }, 2000);
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
                    <Tab label="App" sx={{ fontWeight: 500, fontSize: "0.75rem", padding: "16px 16px", minHeight: "32px", minWidth: "60px" }} />
                    <Tab label="Params" sx={{ fontWeight: 500, fontSize: "0.75rem", padding: "16px 16px", minHeight: "45px", minWidth: "60px" }} />
                    <Tab label="Headers" sx={{ fontWeight: 500, fontSize: "0.75rem", padding: "16px 16px", minHeight: "45px", minWidth: "60px" }} />
                    <Tab label="Body" sx={{ fontWeight: 500, fontSize: "0.75rem", padding: "16px 16px", minHeight: "45px", minWidth: "60px" }} />
                    <Tab label="Authorization" sx={{ fontWeight: 500, fontSize: "0.75rem", padding: "16px 16px", minHeight: "45px", minWidth: "60px" }} />
                </Tabs>
            </Box>

            <div className="flex h-[calc(100vh-140px)] mt-4">
                <div className="w-1/2  p-1">
                    <Box sx={{ padding: 1 }}>
                        {selectedTab === 0 && <AppTab />}
                        {selectedTab === 1 && <ParamsTab />}
                        {selectedTab === 2 && <HeadersTab />}
                        {selectedTab === 3 && <BodyTab />}
                        {selectedTab === 4 && <AuthorizationTab />}
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
                                onClick={() => copyToClipboard(responseJson, "response")}
                            >
                                {copied.response ? "✅ Copied" : "📋 Copy"}
                            </button>
                        </div>
                        <div className="bg-gray-900 text-green-400 p-4 rounded-md text-sm font-mono h-40 overflow-y-auto custom-scrollbar">
                            <pre className="text-left">{responseJson}</pre>
                        </div>
                    </div>

                    {/* Error Response */}
                    <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white text-sm font-semibold">Error Response</h3>
                            <div className="flex items-center gap-2">
                                <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
                                    <Select
                                        value={selectedError}
                                        onChange={(e) => setSelectedError(e.target.value)}
                                        sx={{
                                            color: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
                                        }}
                                    >
                                        <MenuItem value="400">400 Bad Request</MenuItem>
                                        <MenuItem value="404">404 Not Found</MenuItem>
                                        <MenuItem value="500">500 Internal Server Error</MenuItem>
                                    </Select>
                                </FormControl>

                                <button
                                    className="text-xs bg-gray-700 px-3 py-1 rounded text-white hover:bg-gray-600"
                                    onClick={() => copyToClipboard(errorResponses[selectedError], "error")}
                                >
                                    {copied.error ? "✅ Copied" : "📋 Copy"}
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-900 text-red-400 p-4 rounded-md text-sm font-mono h-40 overflow-y-auto custom-scrollbar">
                            <pre className="text-left">{errorResponses[selectedError]}</pre>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ApiView;
