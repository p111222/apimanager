import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import Slider from 'react-slick';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

const ApiDashboard = () => {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: apiList, isLoading, error } = useQuery('apiList', async () => {
    // const response = await axiosPrivate.get("http://localhost:8082/api/getAll");
    const response = await axiosPrivate.get("/getAll");
    return response.data.list;
  });

  const { data: categories, isLoading: categoryLoading, error: categoryError } = useQuery('categories', async () => {
    // const response = await axiosPrivate.get("http://localhost:8086/api/categories");
    const response = await axiosPrivate.get("/categories");
    return response.data.list;
  });

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  const getInitial = (name) => name.charAt(0).toUpperCase();

  // if (isLoading) return <div>Loading...</div>;
  if (isLoading || categoryLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return <div>Error fetching APIs: {error.message}</div>;
  if (categoryError) return <div>Error fetching categories: {categoryError.message}</div>;


  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
        Recently Viewed APIs
      </Typography>
      <Slider {...settings}>
        {apiList?.map((api, index) => (
          <Box key={index} sx={{ paddingX: 1.5 }}>
            <Card
              onClick={() => {
                const pathPrefix = user?.roles?.includes("admin") ? "admin" : "user";
                navigate(`/${pathPrefix}/api-details/${api.id}`);
              }}
              sx={{
                textAlign: 'center',
                padding: 3,
                boxShadow: 4,
                borderRadius: 3,
                height: 220,
                transition: '0.3s',
                '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' },
                cursor: 'pointer',
              }}
            >
              <Avatar sx={{ bgcolor: 'orange', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                {getInitial(api.name)}
              </Avatar>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#222' }}>
                  {api.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  API ID: {api.id}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 6, mb: 3, color: '#333' }}>
        Top API Categories
      </Typography>
      <Slider {...settings}>
        {categories?.map((category, index) => (
          <Box key={index} sx={{ paddingX: 1.5 }}>
            <Card
              onClick={() => {
                const pathPrefix = user?.roles?.includes("admin") ? "admin" : "user";
                navigate(`/${pathPrefix}/category-details/${encodeURIComponent(category.name)}`);
              }}
              sx={{
                textAlign: 'center',
                padding: 3,
                boxShadow: 4,
                borderRadius: 3,
                height: 220,
                transition: '0.3s',
                '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' },
                cursor: 'pointer',
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                {getInitial(category.name)}
              </Avatar>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#222' }}>
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ApiDashboard;
