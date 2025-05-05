// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Typography,
//   IconButton,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import DeleteIcon from "@mui/icons-material/Delete";

// const ParamsTab = ({ apiDetails }) => {
//   const [queryParams, setQueryParams] = useState([]);
//   const [pathParams, setPathParams] = useState([]);
//   const [cookieParams, setCookieParams] = useState([]);

//   // Initialize parameters from apiDetails
//   useEffect(() => {
//     if (apiDetails) {
//       const endpoint = Object.keys(apiDetails.paths)[0];
//       const operation = apiDetails.paths[endpoint]?.post || apiDetails.paths[endpoint]?.get;

//       const queryParamsFromApi = operation?.parameters?.filter((param) => param.in === "query") || [];
//       const pathParamsFromApi = operation?.parameters?.filter((param) => param.in === "path") || [];
//       const cookieParamsFromApi = operation?.parameters?.filter((param) => param.in === "cookie") || [];

//       const formattedQueryParams = queryParamsFromApi.map((param) => ({
//         key: param.name,
//         value: param.schema?.example || "",
//       }));

//       const formattedPathParams = pathParamsFromApi.map((param) => ({
//         key: param.name,
//         value: param.schema?.example || "",
//       }));

//       const formattedCookieParams = cookieParamsFromApi.map((param) => ({
//         key: param.name,
//         value: param.schema?.example || "",
//       }));

//       setQueryParams(formattedQueryParams);
//       setPathParams(formattedPathParams);
//       setCookieParams(formattedCookieParams);
//     }
//   }, [apiDetails]);

//   const handleInputChange = (index, field, value, type) => {
//     const newParams =
//       type === "query" ? [...queryParams] :
//       type === "path" ? [...pathParams] :
//       [...cookieParams];

//     newParams[index][field] = value;

//     if (type === "query") setQueryParams(newParams);
//     else if (type === "path") setPathParams(newParams);
//     else setCookieParams(newParams);
//   };

//   const addParam = (type) => {
//     const newParam = { key: "", value: "" };
//     if (type === "query") setQueryParams([...queryParams, newParam]);
//     else if (type === "path") setPathParams([...pathParams, newParam]);
//     else setCookieParams([...cookieParams, newParam]);
//   };

//   const removeParam = (index, type) => {
//     const newParams =
//       type === "query" ? queryParams.filter((_, i) => i !== index) :
//       type === "path" ? pathParams.filter((_, i) => i !== index) :
//       cookieParams.filter((_, i) => i !== index);

//     if (type === "query") setQueryParams(newParams);
//     else if (type === "path") setPathParams(newParams);
//     else setCookieParams(newParams);
//   };

//   // Function to render each parameter section
//   const renderParams = (title, params, type) => (
//     <Accordion
//       defaultExpanded
//       sx={{
//         backgroundColor: "#f5f5f5",
//         boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
//         borderRadius: "8px",
//         marginTop: "20px",
//       }}
//     >
//       <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#f5f5f5" }}>
//         <Typography variant="h6" fontWeight="bold">{title}</Typography>
//       </AccordionSummary>
//       <AccordionDetails>
//         {params.length > 0 ? (
//           params.map((param, index) => (
//             <div
//               key={index}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 marginBottom: "10px",
//               }}
//             >
//               <TextField
//                 label="Key"
//                 variant="outlined"
//                 size="small"
//                 value={param.key}
//                 onChange={(e) => handleInputChange(index, "key", e.target.value, type)}
//                 sx={{ flex: 1 }}
//               />
//               <TextField
//                 label="Value"
//                 variant="outlined"
//                 size="small"
//                 value={param.value}
//                 onChange={(e) => handleInputChange(index, "value", e.target.value, type)}
//                 sx={{ flex: 1 }}
//               />
//               <IconButton color="error" onClick={() => removeParam(index, type)}>
//                 <DeleteIcon />
//               </IconButton>
//             </div>
//           ))
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No {title.toLowerCase()} available.
//           </Typography>
//         )}
//         <Button
//           variant="contained"
//           startIcon={<AddCircleOutlineIcon />}
//           onClick={() => addParam(type)}
//           sx={{ marginTop: "10px" }}
//         >
//           Add {title.replace(" Parameters", "")} Param
//         </Button>
//       </AccordionDetails>
//     </Accordion>
//   );

//   return (
//     <div style={{ padding: "0px", maxWidth: "600px" }}>
//       {renderParams("Query Parameters", queryParams, "query")}
//       {renderParams("Path Parameters", pathParams, "path")}
//       {renderParams("Cookie Parameters", cookieParams, "cookie")}
//     </div>
//   );
// };

// export default ParamsTab;



import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Divider,
  Chip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const ParamsTab = ({ apiDetails }) => {
  const [queryParams, setQueryParams] = useState([]);
  const [pathParams, setPathParams] = useState([]);
  const [cookieParams, setCookieParams] = useState([]);
  const [requestBodyFields, setRequestBodyFields] = useState([]);

  // Initialize parameters from apiDetails
  useEffect(() => {
    if (apiDetails) {
      const endpoint = Object.keys(apiDetails.paths)[0];
      const operation = apiDetails.paths[endpoint]?.put || 
                        apiDetails.paths[endpoint]?.post || 
                        apiDetails.paths[endpoint]?.get;

      // URL Parameters
      const queryParamsFromApi = operation?.parameters?.filter(
        (param) => param.in === "query"
      ) || [];
      
      const pathParamsFromApi = operation?.parameters?.filter(
        (param) => param.in === "path"
      ) || [];
      
      const cookieParamsFromApi = operation?.parameters?.filter(
        (param) => param.in === "cookie"
      ) || [];

      // Request Body Fields (separate from URL params)
      const requestBodySchema = operation?.requestBody?.content?.["application/json"]?.schema?.properties;
      let bodyFieldsFromApi = [];
      
      if (requestBodySchema) {
        bodyFieldsFromApi = Object.entries(requestBodySchema).map(
          ([fieldName, fieldSchema]) => ({
            key: fieldName,
            value: fieldSchema.example || "",
            type: fieldSchema.type || "string",
            description: fieldSchema.description || ""
          })
        );
      }

      setQueryParams(queryParamsFromApi.map(formatParam));
      setPathParams(pathParamsFromApi.map(formatParam));
      setCookieParams(cookieParamsFromApi.map(formatParam));
      setRequestBodyFields(bodyFieldsFromApi);
    }
  }, [apiDetails]);

  const formatParam = (param) => ({
    key: param.name,
    value: param.schema?.example || "",
    description: param.description || "",
    required: param.required || false
  });

  const handleParamChange = (index, field, value, paramType) => {
    const updateParams = (params, setParams) => {
      const newParams = [...params];
      newParams[index][field] = value;
      setParams(newParams);
    };

    switch (paramType) {
      case 'query': updateParams(queryParams, setQueryParams); break;
      case 'path': updateParams(pathParams, setPathParams); break;
      case 'cookie': updateParams(cookieParams, setCookieParams); break;
      case 'body': updateParams(requestBodyFields, setRequestBodyFields); break;
      default: break;
    }
  };

  const addParam = (paramType) => {
    const newParam = { 
      key: "", 
      value: "", 
      description: "",
      ...(paramType === 'body' ? { type: "string" } : { required: false })
    };

    switch (paramType) {
      case 'query': setQueryParams([...queryParams, newParam]); break;
      case 'path': setPathParams([...pathParams, newParam]); break;
      case 'cookie': setCookieParams([...cookieParams, newParam]); break;
      case 'body': setRequestBodyFields([...requestBodyFields, newParam]); break;
      default: break;
    }
  };

  const removeParam = (index, paramType) => {
    switch (paramType) {
      case 'query': setQueryParams(queryParams.filter((_, i) => i !== index)); break;
      case 'path': setPathParams(pathParams.filter((_, i) => i !== index)); break;
      case 'cookie': setCookieParams(cookieParams.filter((_, i) => i !== index)); break;
      case 'body': setRequestBodyFields(requestBodyFields.filter((_, i) => i !== index)); break;
      default: break;
    }
  };

  const renderParamSection = (title, params, paramType) => (
    <Accordion defaultExpanded sx={{ mb: 2, boxShadow: 3 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
          <Chip label={`${params.length}`} size="small" sx={{ ml: 2 }} />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {params.length > 0 ? (
          params.map((param, index) => {
            // Check if this is an original API-defined parameter
            const isOriginalParam = index < params.length - 1 || params.length === 1;
            
            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Name"
                    value={param.key}
                    onChange={(e) => handleParamChange(index, 'key', e.target.value, paramType)}
                    size="small"
                    sx={{ flex: 1 }}
                    InputProps={{
                      readOnly: isOriginalParam && paramType !== 'body'
                    }}
                  />
                  <TextField
                    label="Value"
                    value={param.value}
                    onChange={(e) => handleParamChange(index, 'value', e.target.value, paramType)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  {paramType !== 'body' && (
                    <Chip
                      label={param.required ? "Required" : "Optional"}
                      color={param.required ? "error" : "default"}
                      size="small"
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => removeParam(index, paramType)}
                    disabled={isOriginalParam && paramType !== 'body'}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                {param.description && (
                  <Typography variant="caption" color="text.secondary">
                    {param.description}
                  </Typography>
                )}
                {paramType === 'body' && param.type && (
                  <Chip label={`Type: ${param.type}`} size="small" sx={{ ml: 1 }} />
                )}
                {index < params.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No parameters defined
          </Typography>
        )}
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => addParam(paramType)}
          sx={{ mt: 1 }}
        >
          Add Parameter
        </Button>
      </AccordionDetails>
    </Accordion>
  );
  
  return (
    <Box sx={{ p: 2 }}>
      {renderParamSection("Query Parameters", queryParams, 'query')}
      {renderParamSection("Path Parameters", pathParams, 'path')}
      {renderParamSection("Cookie Parameters", cookieParams, 'cookie')}
      {renderParamSection("Request Body Fields", requestBodyFields, 'body')}
    </Box>
  );
};

export default ParamsTab;