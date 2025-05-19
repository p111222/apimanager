import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import keycloak, { initializeKeycloak } from "./keycloak";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { AuthContext } from "../../Context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import Loader from '../../Assets/loader2.gif';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const Login = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { setUser, setAccessToken, setSessionValidity } = useContext(AuthContext);

  useEffect(() => {
    const performLogin = async () => {
      try {
        console.log("Starting Keycloak login process...");

        // Initialize Keycloak and check authentication
        await initializeKeycloak();
        if (!keycloak.authenticated) {
          console.warn("User is not authenticated");
          return;
        }

        console.log("User authenticated successfully.");
        console.log("Access Token:", keycloak.token);
        console.log("Refresh Token:", keycloak.refreshToken);
        console.log("User Roles:", keycloak.tokenParsed?.realm_access?.roles);

        const accessToken = keycloak.token;
        const refreshToken = keycloak.refreshToken;
        const roles = keycloak.tokenParsed?.realm_access?.roles || [];

        // Prepare the data without wrapping it inside "data"
        const requestData = {
          accessToken: accessToken,
          refreshToken: refreshToken,
        };

        console.log("Sending login request to backend...");
        const response = await axiosPrivate.post("/auth/login", requestData);

        console.log("Login response from backend:", response.data);

        // Update the AuthContext state
        setAccessToken(accessToken);
        setSessionValidity("valid");
        setUser({
          userId: response.data.userId,
          userName: response.data.userName,
          userEmail: response.data.userEmail,
          roles: roles,
        });

        // Navigate based on user role
        if (roles.includes("admin")) {
          console.log("Redirecting to Admin Dashboard...");
          navigate("/admin/apidashboard");
        } else if (roles.includes("itUser")) {
          console.log("Redirecting to User Home...");
          navigate("/user/apidashboard");
        } else {
          console.log("Redirecting to Home...");
          navigate("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    performLogin();
  }, [navigate, setAccessToken, setSessionValidity, setUser]);

  return (
    // <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'background.default' }}>
    //    <CircularProgress /> 
    //    <img 
    //     src={Loader} 
    //     alt="Loading..." 
    //     style={{ 
    //       width: '250px', // Adjust size as needed
    //       height: '250px' // Adjust size as needed
    //     }} 
    //   /> 

    // </Box>
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <DotLottieReact
        src="https://lottie.host/daa52b92-4f61-46f3-b628-4e8763f992f0/uxk1wFWwXN.lottie"
        className="w-[150px] h-[150px]"
        loop
        autoplay
      />
    </div>
  );
};

export default Login;
