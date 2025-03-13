import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";

const AppTab = ({ apiDetails }) => {
  if (!apiDetails) return <Typography>No API Selected</Typography>;

  // Extracting necessary fields from apiDetails
  const endpoint = Object.keys(apiDetails.paths)[0];
  const operation = apiDetails.paths[endpoint].post || apiDetails.paths[endpoint].get;
  const method = operation ? (apiDetails.paths[endpoint].post ? "POST" : "GET") : "N/A";

  const headers = operation?.parameters?.filter((param) => param.in === "header") || [];
  const queryParams = operation?.parameters?.filter((param) => param.in === "query") || [];
  const pathParams = operation?.parameters?.filter((param) => param.in === "path") || [];
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
      {/* API Name */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {apiDetails.info.title}
      </Typography>

      {/* API Description */}
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {operation?.description || "No description available"}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Request Type & Endpoint */}
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <Chip
          label={method.toUpperCase()}
          color={method.toUpperCase() === "GET" ? "success" : "primary"}
          sx={{ fontWeight: "bold", fontSize: "14px" }}
        />
        <Typography variant="body1" fontFamily="monospace">
          {endpoint}
        </Typography>
      </Box>

      {/* Parameters (Headers, Query, Path, Body) */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" fontWeight="bold">
          Request Details
        </Typography>

        {/* Headers */}
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

        {/* Path Params */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Path Parameters:
        </Typography>
        {pathParams.length > 0 ? (
          pathParams.map((param, index) => (
            <Typography key={index} variant="body2" fontFamily="monospace">
              {param.name}: {param.schema?.example || "N/A"}
            </Typography>
          ))
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
          <Typography
            variant="body2"
            fontFamily="monospace"
            component="pre"
            sx={{ mt: 1 }}
          >
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
