import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { authConfig } from '../../config/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [userType, setUserType] = useState('consumer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login submitted:', formData);
      setSuccess('Login successful!');
      setTimeout(() => {
        navigate('/'); // Redirect to home page after successful login
      }, 1500);
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      console.log('Google Sign-In Success:', credentialResponse);
      
      // Simulate API call to validate token and get user info
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set user in context
      setUser({
        id: '1',
        name: 'John Doe', // This would come from your backend after validating the Google token
        email: 'john@example.com',
        userType: userType as 'client' | 'lawyer',
        avatar: 'https://lh3.googleusercontent.com/a/default-user'
      });
      
      setSuccess('Google login successful!');
      setTimeout(() => {
        navigate('/'); // Redirect to home page after successful login
      }, 1500);
    } catch (error) {
      setError('Failed to authenticate with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  const handleFacebookLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Implement Facebook login when we have the SDK
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.open('https://facebook.com/login', '_blank');
    } catch (error) {
      setError('Facebook login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
            }}
          >
            Welcome Back
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Tabs
            value={userType}
            onChange={(_, newValue) => setUserType(newValue)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Client" value="consumer" />
            <Tab label="Lawyer" value="lawyer" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                sx: {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1E40AF 0%, #0284C7 100%)',
                },
                position: 'relative',
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Box sx={{ my: 3 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
          </Box>

          <Box sx={{ mb: 2 }}>
            <GoogleOAuthProvider clientId={authConfig.googleClientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                width="100%"
                text="continue_with"
              />
            </GoogleOAuthProvider>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleFacebookLogin}
            startIcon={loading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              <FacebookIcon />
            )}
            disabled={loading}
            sx={{
              py: 1.5,
              backgroundColor: '#1877F2',
              '&:hover': {
                backgroundColor: '#0C63D4',
              },
            }}
          >
            Continue with Facebook
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button
                color="primary"
                onClick={() => navigate('/register')}
                sx={{
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;
