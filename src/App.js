import React, { useState, useEffect, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Pages/AuthPages/Login';
import Register from './Pages/AuthPages/Register';
import LandingPage from './Pages/Common/LandingPage';
import NotFound from './Pages/Error/Notfound';
import ApiDashboard from './Pages/CommonPages/ApiDashboard';
import ApiLayout from './Layout/ApiLayout';
import ApiView from './Pages/CommonPages/ApiView';


const App = () => {
  // const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const response = await makeRequest.get('/auth/verify');
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error('Error fetching user details:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (!user) {
  //     fetchUserDetails();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [user, setUser]);

  // const ProtectedRoute = ({ children, layout: Layout }) => {
  //   if (loading) {
  //     return null; 
  //   }

  //   if (!user) {
  //     return <Navigate to="/login" />;
  //   }

  //   if (user.user_type === 'Admin' && Layout === AdminLayout) {
  //     return children
  //   } else if (user.user_type === 'Users' && Layout === UserLayout) {
  //     return children
  //   } else {
  //     return <Navigate to="/login" />; // Redirect to home or handle unauthorized access
  //   }
  // };

  const router = createBrowserRouter([
    {
      path: '/admin',
      element: (
        // <ProtectedRoute layout={AdminLayout}>
        <ApiLayout />
        // </ProtectedRoute>
      ),
      children: [
        {
          path: '/apidashboard',
          element: <ApiDashboard />,
        },
        {
          path: '/apiview',
          element: <ApiView />,
        },
       
      ],
    },
    // {
    //   path: '/user',
    //   element: (
    //     <ProtectedRoute layout={UserLayout}>
    //       <UserLayout />
    //     </ProtectedRoute>
    //   ),
    //   children: [
    //     {
    //       path: '/user/dashboard',
    //       element: <ProjectDashboard />,
    //     },
    //     {
    //       path: '/user/projectdetail/:projectId',
    //       element: <ProjectDetail />,
    //     },
    //     {
    //       path: '/user/ganttchart',
    //       element: <GanttChart />,
    //     },
    //     {
    //       path: '/user/workprogress/:projectId/:type',
    //       element: <WorkProgress />,
    //     },
    //   ],
    // },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;