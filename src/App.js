import React, { useState, useEffect, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './Pages/AuthPages/Login';
import Register from './Pages/AuthPages/Register';
import LandingPage from './Pages/Common/LandingPage';
import NotFound from './Pages/Error/Notfound';
import ApiDashboard from './Pages/CommonPages/ApiDashboard';
import ApiLayout from './Layout/ApiLayout';
import ApiView from './Pages/CommonPages/ApiView';
import ListofCategories from './Pages/CommonPages/ListofCategories';
import UploadApi from './Pages/AdminPage/UploadApi';
import CreateTeam from './Pages/AdminPage/CreateTeam';
import { AuthContext } from './Context/AuthContext';
import useAxiosPrivate from './Hooks/useAxiosPrivate.js';
import ApiDetailsPage from './Pages/CommonPages/ApiDetailsPage.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import { Modal, Typography, Button } from '@mui/material';

const App = () => {
  const { user, setUser, sessionValidity, setSessionValidity, setAccessToken } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const navigate = useNavigate();

  // Fetch user details on app load or refresh
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const sessionResponse = await axiosPrivate.get('/auth/check-session');
        console.log("sessionResponse.data.valid: " + sessionResponse.data);
        setSessionValidity(sessionResponse.data);

        const regenerateTokenResponse = await axiosPrivate.get('/auth/regenerate-accesstoken');
        console.log("regenerateTokenResponse.data: " + regenerateTokenResponse.data);
        setAccessToken(regenerateTokenResponse.data);

        const userResponse = await axiosPrivate.get('/auth/logged-in-user');
        console.log("userResponse.data: ", JSON.stringify(userResponse.data, null, 2));

        const roles = userResponse.data.roles || [];
        setUser({
          userId: userResponse.data.userId,
          userName: userResponse.data.userName,
          userEmail: userResponse.data.userEmail,
          roles: roles,
        });
      } catch (error) {
        console.log("Error fetching user details: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [user, setUser]);

  // console.log("user app.js", JSON.stringify(user, null, 2));

  useEffect(() => {
    if (sessionValidity === "invalid" && window.location.href.includes("user")) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [sessionValidity]);

  // const handleLogin = () => {
  //   setShowModal(false);
  //   navigate('/login');
  // };


  // console.log("outsideLoading", loading);
  // Protected route component
  const ProtectedRoute = ({ children, layout: Layout }) => {
    // console.log("Inside ProtectedRoute");
    // console.log("User:", user);
    // console.log("Loading:", loading);

    // Wait for loading to complete before rendering the route
    if (loading) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );

    // Redirect to login if no user data is available
    if (!user) {
      console.log("No user found, redirecting to login");
      return <Navigate to="/login" />;
    }

    const isAdmin = user?.roles?.includes("admin");
    const isItUser = user?.roles?.includes("itUser");

    // Admin role redirection
    if (isAdmin && Layout === ApiLayout && !window.location.pathname.startsWith("/admin")) {
      console.log("Redirecting to Admin Dashboard");
      return <Navigate to="/admin/apidashboard" />;
    }

    // IT User role redirection
    if (isItUser && Layout === ApiLayout && !window.location.pathname.startsWith("/user")) {
      console.log("Redirecting to IT User Dashboard");
      return <Navigate to="/user/apidashboard" />;
    }

    // console.log("Rendering children components");
    return children;
  };

  const router = createBrowserRouter([
    {
      path: '/admin',
      element: (
        <ProtectedRoute layout={ApiLayout}>
          <ApiLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/admin/apidashboard', element: <ApiDashboard /> },
        { path: '/admin/apiview', element: <ApiView /> },
        { path: '/admin/allcategories', element: <ListofCategories /> },
        { path: '/admin/uploadapi', element: <UploadApi /> },
        // { path: '/admin/createteam', element: <CreateTeam /> },
        { path: '/admin/api-details/:apiId', element: <ApiDetailsPage /> },
      ],
    },
    {
      path: '/user',
      element: (
        <ProtectedRoute layout={ApiLayout}>
          <ApiLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/user/apidashboard', element: <ApiDashboard /> },
        { path: '/user/apiview', element: <ApiView /> },
        { path: '/user/allcategories', element: <ListofCategories /> },
        { path: '/user/api-details/:apiId', element: <ApiDetailsPage /> },
      ],
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/', element: <LandingPage /> },
    { path: '*', element: <NotFound /> },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
      {/* <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" gutterBottom>
            Invalid User Session
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your session has expired or is invalid. Please log in again.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
            }}
          >
            Login
          </Button>
        </Box>
      </Modal> */}
    </div>
  );
};

export default App;
