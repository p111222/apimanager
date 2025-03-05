import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";

const AppTab = () => {
  const apiDetails = {
    name: "Create New User",
    description:
      "This API allows you to create a new user by sending user details in the request body.",
    method: "POST",
    endpoint: "/api/users",
    headers: [
      { key: "Content-Type", value: "application/json" },
      { key: "Authorization", value: "Bearer <token>" }
    ],
    queryParams: [{ key: "referrer", value: "app_dashboard" }],
    pathParams: [],
    body: {
      username: "john_doe",
      email: "john.doe@example.com",
      password: "securepassword123"
    },
    response: {
      success: true,
      message: "User created successfully",
      userId: "12345"
    }
  };

  if (!apiDetails) return <Typography>No API Selected</Typography>;

  return (
    <Box
      sx={{
        width: "100%", // Full width
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 6px 16px rgba(0,0,0,0.3)",
        backgroundColor: "#fff",
        textAlign: "left", // Ensure all text is left-aligned
      }}
    >
      {/* API Name */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {apiDetails.name}
      </Typography>

      {/* API Description */}
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {apiDetails.description}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Request Type & Endpoint */}
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <Chip
          label={apiDetails.method}
          color={apiDetails.method === "GET" ? "success" : "primary"}
          sx={{ fontWeight: "bold", fontSize: "14px" }}
        />
        <Typography variant="body1" fontFamily="monospace">
          {apiDetails.endpoint}
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
        {apiDetails.headers.length > 0 ? (
          apiDetails.headers.map((header, index) => (
            <Typography key={index} variant="body2" fontFamily="monospace">
              {header.key}: {header.value}
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
        {apiDetails.queryParams.length > 0 ? (
          apiDetails.queryParams.map((param, index) => (
            <Typography key={index} variant="body2" fontFamily="monospace">
              {param.key}={param.value}
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
        {apiDetails.pathParams.length > 0 ? (
          apiDetails.pathParams.map((param, index) => (
            <Typography key={index} variant="body2" fontFamily="monospace">
              {param.key}: {param.value}
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
        {apiDetails.body ? (
          <Paper sx={{ p: 2, mt: 1, backgroundColor: "#e8f5e9" }}>
            <Typography variant="body2" fontFamily="monospace" component="pre">
              {JSON.stringify(apiDetails.body, null, 2)}
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
        <Typography
          variant="body2"
          fontFamily="monospace"
          component="pre"
          sx={{ mt: 1 }}
        >
          {JSON.stringify(apiDetails.response, null, 2)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AppTab;
