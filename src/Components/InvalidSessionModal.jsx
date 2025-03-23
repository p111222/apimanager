import React from 'react';
import { Modal, Button, Box, Typography } from '@mui/material';

const InvalidSessionModal = ({ open, onClose, onNavigate }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          maxWidth: 400,
          width: '90%',
        }}
      >
        <Typography variant="h5" gutterBottom color="error">
          ⚠️ Session Expired
        </Typography>
        <Typography variant="body1" mb={3}>
          Your session has expired. Please log in again to continue.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onNavigate}
          sx={{ mt: 2, width: '100%' }}
        >
          Go to Login
        </Button>
      </Box>
    </Modal>
  );
};

export default InvalidSessionModal;
