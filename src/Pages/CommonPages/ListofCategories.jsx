import React from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';

const categories = [
  { name: 'Finance', description: 'APIs related to banking, stocks, and investments.' },
  { name: 'Weather', description: 'Climate and real-time weather forecasting APIs.' },
  { name: 'News', description: 'Aggregated news from various sources.' },
  { name: 'Sports', description: 'Live sports data and statistics.' },
  { name: 'E-commerce', description: 'APIs for online shopping and transactions.' },
  { name: 'Healthcare', description: 'Medical and health-related API services.' },
  { name: 'Education', description: 'Learning platforms and academic APIs.' },
  { name: 'Travel', description: 'Tourism, flight, and hotel booking APIs.' },
];

const getInitial = (name) => name.charAt(0).toUpperCase();

const ListofCategories = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">API Categories</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="w-[220px] text-center shadow-lg rounded-xl transition duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            <div className="flex flex-col items-center p-6">
              <Avatar
                sx={{
                  bgcolor: 'orange', // Using MUI's theme color
                  width: 64, // Equivalent to w-16
                  height: 64, // Equivalent to h-16
                  mb: 2, // Equivalent to mb-3 in Tailwind
                  fontSize: 24, // Adjust text size inside Avatar
                  fontWeight: 'bold',
                }}
              >
                {getInitial(category.name)}
              </Avatar>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {category.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {category.description}
                </Typography>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListofCategories;
