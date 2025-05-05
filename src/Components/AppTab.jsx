// import React, { useState, useContext, useEffect } from "react";
// import { Box, Typography, Paper, Divider, Chip, TextField, IconButton, Button } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import { AuthContext } from '../Context/AuthContext';
// import useAxiosPrivate from "../Hooks/useAxiosPrivate";
// import { useLocation, useParams } from "react-router-dom";

// const AppTab = ({ apiDetails }) => {
//   const { user } = useContext(AuthContext);
//   const isAdmin = user?.roles?.includes("admin");
//   const axiosPrivate = useAxiosPrivate();
//   const location = useLocation();
//   // const queryParam = new URLSearchParams(location.search);
//   // const apiId = queryParam.get('apiId');
//   const { apiId } = useParams();

//   console.log("appTab component for apiDetails"+JSON.stringify(apiDetails));

//   // State for description editing
//   const [editingDescription, setEditingDescription] = useState(false);
//   const [description, setDescription] = useState("");

//   useEffect(() => {
//     if (apiDetails?.description) {
//       setDescription(apiDetails.description);
//     }
//   }, [apiDetails]);


//   // Toggle Edit Mode
//   const toggleEditing = () => setEditingDescription(!editingDescription);

//   // Utility function to get the Bearer token
//   const getBearerToken = async () => {
//     try {
//       const response = await axiosPrivate.get(
//         "http://localhost:8083/token",
//         // "/token",  
//         null,
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         }
//       );
//       console.log("Generated Bearer Token:", response.data.access_token);  // Print the token
//       return response.data.access_token;
//     } catch (error) {
//       console.error("Error fetching Bearer token:", error.response?.data || error.message);
//       throw new Error("Failed to obtain Bearer token");
//     }
//   };

//   // Handle Update
//   const handleUpdate = async () => {
//     if (!apiId) {
//       console.error("API ID is not available.");
//       alert("API ID is missing. Unable to update.");
//       return;
//     }

//     try {
//       const token = await getBearerToken();
//       // Fallback values for essential fields
//       const name = apiDetails?.info?.title || apiDetails?.name || "Default API Name";
//       const version = apiDetails?.info?.version || apiDetails?.version || "1.0.0";
//       const context = apiDetails?.context || "/default-context";
//       const provider = apiDetails?.provider || "default-provider";
//       const lifeCycleStatus = apiDetails?.lifeCycleStatus || "CREATED";

//       // Extracting operations from apiDetails.paths
//       const operations = Object.keys(apiDetails?.paths || {}).flatMap((path) =>
//         Object.keys(apiDetails.paths[path]).map((method) => ({
//           target: path,
//           verb: method.toUpperCase(),
//           authType: "None",
//           throttlingPolicy: "Unlimited",
//         }))
//       );

//       // Check if operations array is not empty
//       if (operations.length === 0) {
//         console.error("No valid operations found for the API.");
//         alert("API must have at least one resource defined.");
//         return;
//       }

//       const updatedData = {
//         name,
//         description,
//         context,
//         version,
//         provider,
//         lifeCycleStatus,
//         operations,
//       };

//       console.log("Updated Data Payload:", updatedData);

//       const response = await axiosPrivate.put(
//         `https://api.kriate.co.in:8344/api/am/publisher/v4/apis/${apiId}`,
//         // `/am/publisher/v4/apis/${apiId}`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("API Updated Successfully:", response.data);
//       alert("API details updated successfully!");

//       // Fetch the updated details to update the UI
//       await fetchDescription();

//       setEditingDescription(false);

//     } catch (error) {
//       console.error("Error updating API:", error.response?.data || error.message);
//       alert("Error updating API details");
//     }
//   };

//   // Function to fetch the description from the new API endpoint
//   const fetchDescription = async () => {
//     try {
//       const fetchResponse = await axiosPrivate.get(
//         `http://localhost:8081/api/getapi/${apiId}`
//         // `/getapi/${apiId}`
//       );

//       const initialDescription = fetchResponse.data?.description || "No description available";
//       setDescription(initialDescription);
//     } catch (error) {
//       console.error("Error fetching API details:", error.response?.data || error.message);
//     }
//   };

//   // Initial description fetch on component mount
//   useEffect(() => {
//     if (apiId) fetchDescription();
//   }, [apiId]);

//   useEffect(() => {
//     console.log("apiDetails (on change):", apiDetails);
//   }, [apiDetails]);

//   if (!apiDetails) return <Typography>No API Selected</Typography>;

//   // Extracting necessary fields from apiDetails
//   const endpoint = Object.keys(apiDetails.paths)[0];
//   const operation = apiDetails.paths[endpoint]?.post || apiDetails.paths[endpoint]?.get;
//   const method = operation ? (apiDetails.paths[endpoint]?.post ? "POST" : "GET") : "N/A";

//   const headers = operation?.parameters?.filter((param) => param.in === "header") || [];
//   const queryParams = operation?.parameters?.filter((param) => param.in === "query") || [];
//   const pathParams = operation?.parameters?.filter((param) => param.in === "path") || [];
//   const requestBody = operation?.requestBody?.content?.["application/json"]?.schema?.properties || {};
//   const responseExample = operation?.responses?.["200"]?.content?.["application/json"]?.schema?.properties || {};

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         p: 3,
//         borderRadius: 2,
//         boxShadow: "0px 6px 16px rgba(0,0,0,0.3)",
//         backgroundColor: "#fff",
//         textAlign: "left",
//       }}
//     >
//       {/* API Name */}
//       <Typography variant="h5" fontWeight="bold" gutterBottom>
//         {apiDetails.info.title}
//       </Typography>

//       {/* API Description */}
//       <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
//         <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
//           {description || "No description available"}
//         </Typography>
//         {/* {editingDescription ? ( */}
//         {/* <> */}
//         {/* <TextField
//               label="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               fullWidth
//               multiline
//               maxRows={4}
//               variant="outlined"
//             /> */}
//         {/* <Button
//               variant="contained"
//               color="primary"
//               onClick={handleUpdate}
//               sx={{ ml: 1 }}
//             >
//               Update
//             </Button>
//           </>
//         ) : (
//           <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
//             {description || "No description available"}
//           </Typography>
//         )}
//         {isAdmin && !editingDescription && (
//           <IconButton onClick={toggleEditing} size="small" sx={{ ml: 1 }}>
//             <EditIcon />
//           </IconButton>
//         )} */}
//       </Box>

//       <Divider sx={{ mb: 2 }} />

//       {/* Request Type & Endpoint */}
//       <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
//         <Chip
//           label={method.toUpperCase()}
//           color={method.toUpperCase() === "GET" ? "success" : "primary"}
//           sx={{ fontWeight: "bold", fontSize: "14px" }}
//         />
//         <Typography variant="body1" fontFamily="monospace">
//           {endpoint}
//         </Typography>
//       </Box>

//       {/* Parameters (Headers, Query, Path, Body) */}
//       <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
//         <Typography variant="h6" fontWeight="bold">
//           Request Details
//         </Typography>

//         {/* Headers */}
//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
//           Headers:
//         </Typography>
//         {headers.length > 0 ? (
//           headers.map((header, index) => (
//             <Typography key={index} variant="body2" fontFamily="monospace">
//               {header.name}: {header.schema?.example || "N/A"}
//             </Typography>
//           ))
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No headers required.
//           </Typography>
//         )}

//         {/* Query Params */}
//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
//           Query Parameters:
//         </Typography>
//         {queryParams.length > 0 ? (
//           queryParams.map((param, index) => (
//             <Typography key={index} variant="body2" fontFamily="monospace">
//               {param.name}={param.schema?.example || "N/A"}
//             </Typography>
//           ))
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No query parameters.
//           </Typography>
//         )}

//         {/* Path Params */}
//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
//           Path Parameters:
//         </Typography>
//         {pathParams.length > 0 ? (
//           pathParams.map((param, index) => (
//             <Typography key={index} variant="body2" fontFamily="monospace">
//               {param.name}: {param.schema?.example || "N/A"}
//             </Typography>
//           ))
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No path parameters.
//           </Typography>
//         )}

//         {/* Request Body */}
//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
//           Request Body:
//         </Typography>
//         {Object.keys(requestBody).length > 0 ? (
//           <Paper sx={{ p: 2, mt: 1, backgroundColor: "#e8f5e9" }}>
//             <Typography variant="body2" fontFamily="monospace" component="pre">
//               {JSON.stringify(requestBody, null, 2)}
//             </Typography>
//           </Paper>
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No request body.
//           </Typography>
//         )}
//       </Paper>

//       {/* Response Example */}
//       <Paper sx={{ p: 2, backgroundColor: "#f3e5f5" }}>
//         <Typography variant="h6" fontWeight="bold">
//           Response Example
//         </Typography>
//         {Object.keys(responseExample).length > 0 ? (
//           <Typography
//             variant="body2"
//             fontFamily="monospace"
//             component="pre"
//             sx={{ mt: 1 }}
//           >
//             {JSON.stringify(responseExample, null, 2)}
//           </Typography>
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No response example available.
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default AppTab;

// import React, { useState, useContext, useEffect } from "react";
// import { Box, Typography, Paper, Divider, Chip } from "@mui/material";
// import { AuthContext } from '../Context/AuthContext';
// import useAxiosPrivate from "../Hooks/useAxiosPrivate";
// import { useLocation, useParams } from "react-router-dom";
// import { ApiEndpointContext } from "../Context/ApiEndpointContext";

// const AppTab = ({ apiDetails }) => {
//   const { user } = useContext(AuthContext);
//   const isAdmin = user?.roles?.includes("admin");
//   const axiosPrivate = useAxiosPrivate();
//   const location = useLocation();
//   const { apiId } = useParams();
//   const [editingDescription, setEditingDescription] = useState(false);
//   const [description, setDescription] = useState("");
//   const { selectedApiName } = useContext(ApiEndpointContext);

//   console.log("apiDetails in app tab: " + JSON.stringify(apiDetails, null, 2));

//   useEffect(() => {
//     if (apiDetails?.description) {
//       setDescription(apiDetails.description);
//     }
//   }, [apiDetails]);

//   const toggleEditing = () => setEditingDescription(!editingDescription);

//   const getBearerToken = async () => {
//     try {
//       const response = await axiosPrivate.get(
//         "http://localhost:8083/token",
//         // "/token",
//         null,
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         }
//       );
//       // console.log("Generated Bearer Token:", response.data.access_token);
//       return response.data.access_token;
//     } catch (error) {
//       console.error("Error fetching Bearer token:", error.response?.data || error.message);
//       throw new Error("Failed to obtain Bearer token");
//     }
//   };

//   // const handleUpdate = async () => {
//   //   if (!apiId) {
//   //     console.error("API ID is not available.");
//   //     alert("API ID is missing. Unable to update.");
//   //     return;
//   //   }

//   //   try {
//   //     const token = await getBearerToken();
//   //     const name = apiDetails?.info?.title || apiDetails?.name || "Default API Name";
//   //     const version = apiDetails?.info?.version || apiDetails?.version || "1.0.0";
//   //     const context = apiDetails?.context || "/default-context";
//   //     const provider = apiDetails?.provider || "default-provider";
//   //     const lifeCycleStatus = apiDetails?.lifeCycleStatus || "CREATED";

//   //     const operations = Object.keys(apiDetails?.paths || {}).flatMap((path) =>
//   //       Object.keys(apiDetails.paths[path]).map((method) => ({
//   //         target: path,
//   //         verb: method.toUpperCase(),
//   //         authType: "None",
//   //         throttlingPolicy: "Unlimited",
//   //       }))
//   //     );

//   //     if (operations.length === 0) {
//   //       console.error("No valid operations found for the API.");
//   //       alert("API must have at least one resource defined.");
//   //       return;
//   //     }

//   //     const updatedData = {
//   //       name,
//   //       description,
//   //       context,
//   //       version,
//   //       provider,
//   //       lifeCycleStatus,
//   //       operations,
//   //     };

//   //     const response = await axiosPrivate.put(
//   //       // `https://api.kriate.co.in:8344/api/am/publisher/v4/apis/${apiId}`,
//   //       // `/am/publisher/v4/apis/${apiId}`,
//   //       `/${apiId}`,
//   //       updatedData,
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     // console.log("API Updated Successfully:", response.data);
//   //     alert("API details updated successfully!");

//   //     await fetchDescription();

//   //     setEditingDescription(false);

//   //   } catch (error) {
//   //     console.error("Error updating API:", error.response?.data || error.message);
//   //     alert("Error updating API details");
//   //   }
//   // };

//   const fetchDescription = async () => {
//     try {
//       const fetchResponse = await axiosPrivate.get(
//         `http://localhost:8081/api/getapi/${apiId}`
//         // `/getapi/${apiId}`
//       );

//       const initialDescription = fetchResponse.data?.description || "No description available";
//       setDescription(initialDescription);
//     } catch (error) {
//       console.error("Error fetching API details:", error.response?.data || error.message);
//     }
//   };

//   useEffect(() => {
//     if (apiId) fetchDescription();
//   }, [apiId]);

//   useEffect(() => {
//   }, [apiDetails]);

//   if (!apiDetails) return <Typography>Please Select an API to view additional details</Typography>;

//   // Extracting necessary fields from apiDetails
//   // const endpoint = Object.keys(apiDetails.paths)[0];
//   // const operation = apiDetails.paths[endpoint]?.post || apiDetails.paths[endpoint]?.get;
//   // const method = operation ? (apiDetails.paths[endpoint]?.post ? "POST" : "GET") : "N/A";

//   const endpointPath = Object.keys(apiDetails.paths)[0];
//   const endpointOperations = apiDetails.paths[endpointPath];
//   const methods = Object.keys(endpointOperations).map(method => method.toUpperCase());
//   const primaryMethod = methods[0] || "GET";

//   // console.log("primaryMethod"+primaryMethod);
  

//   // Get the first operation (POST in your case)
//   const operation = endpointOperations[methods[0].toLowerCase()] || {};

//   const headers = operation?.parameters?.filter((param) => param.in === "header") || [];
//   const queryParams = operation?.parameters?.filter((param) => param.in === "query") || [];
//   const pathParams = operation?.parameters?.filter((param) => param.in === "path") || [];
//   const requestBody = operation?.requestBody?.content?.["application/json"]?.schema?.properties || {};
//   const responseExample = operation?.responses?.["200"]?.content?.["application/json"]?.schema?.properties || {};

//   // console.log("Headers:", JSON.stringify(headers, null, 2));
//   // console.log("Query Params:", JSON.stringify(queryParams, null, 2));
//   // console.log("Path Params:", JSON.stringify(pathParams, null, 2));
//   // console.log("Request Body:", JSON.stringify(requestBody, null, 2));
//   // console.log("Response Example:", JSON.stringify(responseExample, null, 2));
  
  
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         p: 3,
//         borderRadius: 2,
//         boxShadow: "0px 6px 16px rgba(0,0,0,0.3)",
//         backgroundColor: "#fff",
//         textAlign: "left",
//       }}
//     >
//       <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
//         <Chip
//           label={primaryMethod}
//           color={
//             primaryMethod === "GET" ? "success" :
//               primaryMethod === "POST" ? "primary" :
//                 primaryMethod === "PUT" ? "warning" :
//                   primaryMethod === "DELETE" ? "error" :
//                     primaryMethod === "PATCH" ? "secondary" : "default"
//           }
//           sx={{ fontWeight: "bold", fontSize: "14px" }}
//         />
//         <Typography variant="body1" fontFamily="monospace">
//           {Object.keys(apiDetails.paths)[0]}
//         </Typography>
//       </Box>

//       <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
//         <Typography variant="h6" fontWeight="bold">
//           Request Details
//         </Typography>

//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
//           Headers:
//         </Typography>
//         {headers.length > 0 ? (
//           headers.map((header, index) => (
//             <Typography key={index} variant="body2" fontFamily="monospace">
//               {header.name}: {header.schema?.example || "N/A"}
//             </Typography>
//           ))
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No headers required.
//           </Typography>
//         )}

//         {/* Query Params */}
//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
//           Query Parameters:
//         </Typography>
//         {queryParams.length > 0 ? (
//           queryParams.map((param, index) => (
//             <Typography key={index} variant="body2" fontFamily="monospace">
//               {param.name}={param.schema?.example || "N/A"}
//             </Typography>
//           ))
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No query parameters.
//           </Typography>
//         )}

//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
//           Path Parameters:
//         </Typography>
//         {pathParams.length > 0 ? (
//           pathParams.map((param, index) => (
//             <Typography key={index} variant="body2" fontFamily="monospace">
//               {param.name}: {param.schema?.example || "N/A"}
//             </Typography>
//           ))
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No path parameters.
//           </Typography>
//         )}

//         {/* Request Body */}
//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
//           Request Body:
//         </Typography>
//         {Object.keys(requestBody).length > 0 ? (
//           <Paper sx={{ p: 2, mt: 1, backgroundColor: "#e8f5e9" }}>
//             <Typography variant="body2" fontFamily="monospace" component="pre">
//               {JSON.stringify(requestBody, null, 2)}
//             </Typography>
//           </Paper>
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No request body.
//           </Typography>
//         )}
//       </Paper>

//       {/* Response Example */}
//       <Paper sx={{ p: 2, backgroundColor: "#f3e5f5" }}>
//         <Typography variant="h6" fontWeight="bold">
//           Response Example
//         </Typography>
//         {Object.keys(responseExample).length > 0 ? (
//           <Typography variant="body2" fontFamily="monospace" component="pre">
//             {JSON.stringify(responseExample, null, 2)}
//           </Typography>
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No response example available.
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default AppTab;


import React, { useState, useContext, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Chip,
  TextField,
  IconButton,
  Button
} from "@mui/material";
import { AuthContext } from '../Context/AuthContext';
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
import { useLocation, useParams } from "react-router-dom";
import { ApiEndpointContext } from "../Context/ApiEndpointContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const AppTab = ({ apiDetails }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles?.includes("admin");
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const { apiId } = useParams();
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState("");
  const { selectedApiName } = useContext(ApiEndpointContext);
  const [pathParams, setPathParams] = useState([]);

  useEffect(() => {
    if (apiDetails?.description) {
      setDescription(apiDetails.description);
    }
  }, [apiDetails]);

  useEffect(() => {
    if (apiDetails?.paths) {
      const endpointPath = Object.keys(apiDetails.paths)[0];
      const endpointOperations = apiDetails.paths[endpointPath];
      const operation = endpointOperations[Object.keys(endpointOperations)[0]] || {};
      
      // Initialize path parameters
      const extractedPathParams = operation?.parameters?.filter(
        (param) => param.in === "path"
      ) || [];
      
      const formattedPathParams = extractedPathParams.map((param) => ({
        key: param.name,
        value: param.schema?.example || "",
        description: param.description || "",
        required: param.required || false
      }));
      
      setPathParams(formattedPathParams.length > 0 ? formattedPathParams : []);
    }
  }, [apiDetails]);

  const handlePathParamChange = (index, field, value) => {
    const newPathParams = [...pathParams];
    newPathParams[index][field] = value;
    setPathParams(newPathParams);
  };

  const addPathParam = () => {
    setPathParams([...pathParams, { key: "", value: "", description: "", required: false }]);
  };

  const removePathParam = (index) => {
    setPathParams(pathParams.filter((_, i) => i !== index));
  };

  if (!apiDetails) return <Typography>Please Select an API to view additional details</Typography>;

  const endpointPath = Object.keys(apiDetails.paths)[0];
  const endpointOperations = apiDetails.paths[endpointPath];
  const methods = Object.keys(endpointOperations).map(method => method.toUpperCase());
  const primaryMethod = methods[0] || "GET";
  const operation = endpointOperations[methods[0].toLowerCase()] || {};

  const headers = operation?.parameters?.filter((param) => param.in === "header") || [];
  const queryParams = operation?.parameters?.filter((param) => param.in === "query") || [];
  const requestBody = operation?.requestBody?.content?.["application/json"]?.schema?.properties || {};
  const responseExample = operation?.responses?.["200"]?.content?.["application/json"]?.schema?.properties || {};

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 6px 16px rgba(0,0,0,0.3)",
        backgroundColor: "#fff",
        textAlign: "left",
      }}
    >
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <Chip
          label={primaryMethod}
          color={
            primaryMethod === "GET" ? "success" :
              primaryMethod === "POST" ? "primary" :
                primaryMethod === "PUT" ? "warning" :
                  primaryMethod === "DELETE" ? "error" :
                    primaryMethod === "PATCH" ? "secondary" : "default"
          }
          sx={{ fontWeight: "bold", fontSize: "14px" }}
        />
        <Typography variant="body1" fontFamily="monospace">
          {Object.keys(apiDetails.paths)[0]}
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" fontWeight="bold">
          Request Details
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Headers:
        </Typography>
        {headers.length > 0 ? (
          headers.map((header, index) => (
            <Typography key={index} variant="body2" fontFamily="monospace">
              {header.name}: {header.schema?.example || "N/A"}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No headers required.
          </Typography>
        )}

        {/* Query Params */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Query Parameters:
        </Typography>
        {queryParams.length > 0 ? (
          queryParams.map((param, index) => (
            <Typography key={index} variant="body2" fontFamily="monospace">
              {param.name}={param.schema?.example || "N/A"}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No query parameters.
          </Typography>
        )}

        {/* Path Parameters - Updated to match ParamsTab style */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Path Parameters:
        </Typography>
        {pathParams.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            {pathParams.map((param, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Parameter Name"
                    value={param.key}
                    onChange={(e) => handlePathParamChange(index, 'key', e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Value"
                    value={param.value}
                    onChange={(e) => handlePathParamChange(index, 'value', e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <Chip
                    label={param.required ? "Required" : "Optional"}
                    color={param.required ? "error" : "default"}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={() => removePathParam(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                {param.description && (
                  <Typography variant="caption" color="text.secondary">
                    {param.description}
                  </Typography>
                )}
                {index < pathParams.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddCircleOutlineIcon />}
              onClick={addPathParam}
              sx={{ mt: 1 }}
            >
              Add Path Parameter
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No path parameters.
          </Typography>
        )}

        {/* Request Body */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Request Body:
        </Typography>
        {Object.keys(requestBody).length > 0 ? (
          <Paper sx={{ p: 2, mt: 1, backgroundColor: "#e8f5e9" }}>
            <Typography variant="body2" fontFamily="monospace" component="pre">
              {JSON.stringify(requestBody, null, 2)}
            </Typography>
          </Paper>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No request body.
          </Typography>
        )}
      </Paper>

      {/* Response Example */}
      <Paper sx={{ p: 2, backgroundColor: "#f3e5f5" }}>
        <Typography variant="h6" fontWeight="bold">
          Response Example
        </Typography>
        {Object.keys(responseExample).length > 0 ? (
          <Typography variant="body2" fontFamily="monospace" component="pre">
            {JSON.stringify(responseExample, null, 2)}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No response example available.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AppTab;