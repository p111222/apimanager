// import React, { useState, useEffect } from "react";
// import { TextField, MenuItem, Select, FormControl, Button, Box, Typography } from "@mui/material";

// const AuthorizationTab = ({ apiDetails }) => {
//   const [authType, setAuthType] = useState("none");
//   const [authDetails, setAuthDetails] = useState({
//     apiKey: "",
//     apiKeyLocation: "header",
//     token: "",
//     username: "",
//     password: ""
//   });

//   // Extracting authorization details from apiDetails
//   useEffect(() => {
//     if (apiDetails && apiDetails.components?.securitySchemes) {
//       const securitySchemes = apiDetails.components.securitySchemes;
//       const schemeName = Object.keys(securitySchemes)[0];
//       const securityScheme = securitySchemes[schemeName];

//       if (securityScheme.type === "apiKey") {
//         setAuthType("apiKey");
//         setAuthDetails({
//           apiKey: "",
//           apiKeyLocation: securityScheme.in || "header"
//         });
//       } else if (securityScheme.type === "http" && securityScheme.scheme === "bearer") {
//         setAuthType("bearer");
//         setAuthDetails({ token: "" });
//       } else if (securityScheme.type === "http" && securityScheme.scheme === "basic") {
//         setAuthType("basic");
//         setAuthDetails({ username: "", password: "" });
//       } else {
//         setAuthType("none");
//       }
//     }
//   }, [apiDetails]);

//   const handleAuthChange = (event) => {
//     setAuthType(event.target.value);
//   };

//   const handleInputChange = (event) => {
//     setAuthDetails({ ...authDetails, [event.target.name]: event.target.value });
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 600,
//         mx: "auto",
//         p: 2,
//         borderRadius: 2,
//         boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
//         backgroundColor: "#fff"
//       }}
//     >
//       <Typography variant="h6" sx={{ mb: 2 }} fontWeight="bold">
//         Authorization
//       </Typography>

//       <FormControl fullWidth sx={{ mb: 3 }}>
//         <Select value={authType} onChange={handleAuthChange}>
//           <MenuItem value="none">No Auth</MenuItem>
//           <MenuItem value="apiKey">API Key</MenuItem>
//           <MenuItem value="bearer">Bearer Token</MenuItem>
//           <MenuItem value="basic">Basic Auth</MenuItem>
//         </Select>
//       </FormControl>

//       {authType === "apiKey" && (
//         <>
//           <TextField
//             fullWidth
//             label="API Key"
//             name="apiKey"
//             variant="outlined"
//             size="small"
//             value={authDetails.apiKey}
//             onChange={handleInputChange}
//             sx={{ mb: 2 }}
//           />
//           <FormControl fullWidth>
//             <Select
//               name="apiKeyLocation"
//               value={authDetails.apiKeyLocation}
//               onChange={handleInputChange}
//             >
//               <MenuItem value="header">Header</MenuItem>
//               <MenuItem value="query">Query Parameter</MenuItem>
//             </Select>
//           </FormControl>
//         </>
//       )}

//       {authType === "bearer" && (
//         <TextField
//           fullWidth
//           label="Bearer Token"
//           name="token"
//           variant="outlined"
//           size="small"
//           value={authDetails.token}
//           onChange={handleInputChange}
//         />
//       )}

//       {authType === "basic" && (
//         <>
//           <TextField
//             fullWidth
//             label="Username"
//             name="username"
//             variant="outlined"
//             size="small"
//             value={authDetails.username}
//             onChange={handleInputChange}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             type="password"
//             label="Password"
//             name="password"
//             variant="outlined"
//             size="small"
//             value={authDetails.password}
//             onChange={handleInputChange}
//           />
//         </>
//       )}

//       <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
//         Save Authorization
//       </Button>
//     </Box>
//   );
// };

// export default AuthorizationTab;


import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Select, FormControl, Button, Box, Typography } from "@mui/material";

const AuthorizationTab = ({ apiDetails }) => {
  const [authType, setAuthType] = useState("none");
  const [authDetails, setAuthDetails] = useState({
    apiKey: "",
    apiKeyLocation: "header",
    token: "",
    username: "",
    password: ""
  });

  // Extracting authorization details from apiDetails
  useEffect(() => {
    if (apiDetails && apiDetails.paths) {
      const endpoint = Object.keys(apiDetails.paths)[0];
      const operation = apiDetails.paths[endpoint]?.put; // Using PUT to match your API
      
      // Check for OAuth in security schemes
      if (operation?.security) {
        // Your API uses OAuth based on the Excel data
        setAuthType("bearer");
        setAuthDetails({
          token: "Bearer <access_token>" // Default value matching your API spec
        });
      }
      // Check for headers that indicate auth type
      else if (operation?.parameters) {
        const headers = operation.parameters.filter(param => param.in === "header");
        const authHeader = headers.find(header => header.name.toLowerCase() === "authorization");
        
        if (authHeader) {
          setAuthType("bearer");
          setAuthDetails({
            token: authHeader.schema?.example || "Bearer <access_token>"
          });
        }
        else if (headers.find(header => header.name.toLowerCase() === "x-api-key")) {
          setAuthType("apiKey");
          setAuthDetails({
            apiKey: "",
            apiKeyLocation: "header"
          });
        }
      }
    }
  }, [apiDetails]);

  const handleAuthChange = (event) => {
    setAuthType(event.target.value);
  };

  const handleInputChange = (event) => {
    setAuthDetails({ ...authDetails, [event.target.name]: event.target.value });
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 2,
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
        backgroundColor: "#fff"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }} fontWeight="bold">
        Authorization
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <Select value={authType} onChange={handleAuthChange}>
          <MenuItem value="none">No Auth</MenuItem>
          <MenuItem value="apiKey">API Key</MenuItem>
          <MenuItem value="bearer">Bearer Token</MenuItem>
          <MenuItem value="basic">Basic Auth</MenuItem>
        </Select>
      </FormControl>

      {authType === "apiKey" && (
        <>
          <TextField
            fullWidth
            label="API Key"
            name="apiKey"
            variant="outlined"
            size="small"
            value={authDetails.apiKey}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <Select
              name="apiKeyLocation"
              value={authDetails.apiKeyLocation}
              onChange={handleInputChange}
            >
              <MenuItem value="header">Header</MenuItem>
              <MenuItem value="query">Query Parameter</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      {authType === "bearer" && (
        <TextField
          fullWidth
          label="Bearer Token"
          name="token"
          variant="outlined"
          size="small"
          value={authDetails.token}
          onChange={handleInputChange}
          helperText="Example: Bearer <your_access_token>"
        />
      )}

      {authType === "basic" && (
        <>
          <TextField
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            size="small"
            value={authDetails.username}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            variant="outlined"
            size="small"
            value={authDetails.password}
            onChange={handleInputChange}
          />
        </>
      )}

      <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
        Save Authorization
      </Button>
    </Box>
  );
};

export default AuthorizationTab;