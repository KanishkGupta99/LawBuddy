import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
  Alert,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser({
        ...user!,
        name: formData.name,
        email: formData.email,
      });
      
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const renderPersonalInfo = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!editing}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!editing}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!editing}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!editing}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            disabled={!editing}
            multiline
            rows={4}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderAppointments = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" color="text.secondary">
        No appointments scheduled
      </Typography>
    </Box>
  );

  const renderPreferences = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" color="text.secondary">
        Coming soon...
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
              }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.userType === 'lawyer' ? 'Legal Professional' : 'Client'}
              </Typography>
            </Box>
            <Box>
              {editing ? (
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    mr: 1,
                    background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setEditing(true)}
                  startIcon={<EditIcon />}
                  sx={{
                    mr: 1,
                    background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                  }}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                color="error"
              >
                Logout
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Personal Info" />
            <Tab label="Appointments" />
            <Tab label="Preferences" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {activeTab === 0 && renderPersonalInfo()}
            {activeTab === 1 && renderAppointments()}
            {activeTab === 2 && renderPreferences()}
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Profile;
