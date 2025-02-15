import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
  ];

  const quickLinks = [
    { text: 'About Us', url: '/about' },
    { text: 'Services', url: '/services' },
    { text: 'Book Consultation', url: '/book-appointment' },
    { text: 'FAQs', url: '/faqs' },
    { text: 'Terms & Conditions', url: '/terms' },
    { text: 'Privacy Policy', url: '/privacy' },
  ];

  const practiceAreas = [
    'Family Law',
    'Criminal Defense',
    'Corporate Law',
    'Real Estate Law',
    'Immigration Law',
    'Intellectual Property',
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontWeight: 700,
              }}
            >
              LawMittr
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your trusted platform for legal services. Connect with expert lawyers and get the legal support you need.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    component={Link}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        background: 'rgba(79, 70, 229, 0.1)',
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </motion.div>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Practice Areas */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
              Practice Areas
            </Typography>
            <Stack spacing={1}>
              {practiceAreas.map((area, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    '&:hover': {
                      color: 'primary.main',
                      cursor: 'pointer',
                    },
                  }}
                >
                  {area}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  123 Legal Street, Courthouse District
                  <br />
                  New Delhi, India 110001
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                <Link
                  href="mailto:support@LawMittr.com"
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  support@LawMittr.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                <Link
                  href="tel:+911234567890"
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  +91 123 456 7890
                </Link>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
          }}
        >
          © {currentYear} LawMittr. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
