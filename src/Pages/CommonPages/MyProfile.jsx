import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Button
} from '@mui/material';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.roles?.includes("admin");

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        {/* Profile Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 3,
          mb: 4
        }}>
          <Avatar sx={{ 
            width: 120, 
            height: 120, 
            fontSize: '3rem',
            bgcolor: 'primary.main'
          }}>
            {user?.userName?.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {user?.userName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.userEmail}
            </Typography>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              {isAdmin ? 'Administrator' : 'API User'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* User Details */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Account Information
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemText 
                primary="User ID" 
                secondary={user?.userId || 'Not available'}
                secondaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Roles" 
                secondary={user?.roles?.join(', ') || 'No roles assigned'}
                secondaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Account Type" 
                secondary={isAdmin ? 'Admin' : 'Standard User'}
                secondaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(isAdmin ? '/admin/apidashboard' : '/user/apidashboard')}
          >
            Back to Dashboard
          </Button>
          {/* <Button 
            variant="contained"
            onClick={() => navigate(isAdmin ? '/admin/edit-profile' : '/user/edit-profile')}
          >
            Edit Profile
          </Button> */}
        </Box>
      </Paper>
    </Box>
  );
};

export default MyProfile;