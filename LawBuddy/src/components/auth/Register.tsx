import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Tab, Tabs, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { motion } from 'framer-motion';

const Register = () => {
  const [userType, setUserType] = useState('consumer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    lawyerType: '',
    ...(userType === 'lawyer' && {
      barNumber: '',
      specialization: '',
    }),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  const lawyerTypes = ['Criminal', 'Civil', 'Corporate'];

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign Up
          </Typography>

          <Tabs
            value={userType}
            onChange={(_, newValue) => setUserType(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Consumer" value="consumer" />
            <Tab label="Lawyer" value="lawyer" />
          </Tabs>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Full Name"
              autoFocus
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />

            {userType === 'lawyer' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="barNumber"
                  label="Bar Council Number"
                  value={formData.barNumber}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="specialization"
                  label="Specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                />
                <Select
                  fullWidth
                  name="lawyerType"
                  value={formData.lawyerType}
                  label="Type of Lawyer"
                  onChange={handleSelectChange}
                >
                  {lawyerTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register;
