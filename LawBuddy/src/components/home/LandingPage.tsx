import React from 'react';
import { Box, Button, Container, Grid, Typography, Card, CardContent, Avatar, Chip, Rating } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import GavelIcon from '@mui/icons-material/Gavel';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', overflow: 'hidden' }}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants}
            style={{ opacity, scale }}
          >
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Typography variant="h2" component="h1" gutterBottom>
                  Legal Services Made Simple
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Typography variant="h5" color="text.secondary" paragraph>
                  Connect with expert lawyers and get the legal help you need
                </Typography>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/book-appointment')}
                  startIcon={<CalendarTodayIcon />}
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: '1.2rem',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1E40AF 0%, #0284C7 100%)',
                    },
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.3)',
                  }}
                >
                  Book a Consultation Now
                </Button>
              </motion.div>
            </Box>
          </motion.div>

          {/* Features Section */}
          <Grid container spacing={4} sx={{ my: 4 }}>
            {[
              { icon: GavelIcon, title: "Expert Lawyers", description: "Connect with experienced lawyers specializing in various fields of law" },
              { icon: ArticleIcon, title: "Legal Blogs", description: "Stay informed with our latest legal insights and analysis" },
              { icon: EventIcon, title: "Easy Scheduling", description: "Book appointments with lawyers at your convenience" }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  viewport={{ once: true, amount: 0.8 }}
                >
                  <Card sx={{ height: '100%', transition: 'all 0.3s ease-in-out' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                      >
                        {React.createElement(feature.icon, {
                          sx: { fontSize: 60, color: 'primary.main', mb: 2 }
                        })}
                      </motion.div>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Practice Areas Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ my: 8 }}>
              <Typography variant="h3" component="h2" gutterBottom textAlign="center">
                Our Practice Areas
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
                Specialized legal expertise across multiple domains
              </Typography>
              <Grid container spacing={3}>
                {[
                  { icon: BusinessIcon, area: "Corporate Law", description: "Business formations, contracts, and compliance" },
                  { icon: FamilyRestroomIcon, area: "Family Law", description: "Divorce, custody, and family matters" },
                  { icon: AccountBalanceIcon, area: "Civil Litigation", description: "Dispute resolution and court representation" },
                  { icon: HomeWorkIcon, area: "Real Estate", description: "Property law and transactions" },
                  { icon: AttachMoneyIcon, area: "Tax Law", description: "Tax planning and compliance" },
                  { icon: GavelIcon, area: "Criminal Law", description: "Criminal defense and prosecution" }
                ].map((practice, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { delay: index * 0.1 }
                        }
                      }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': { transform: 'translateY(-8px)', transition: 'transform 0.3s ease-in-out' }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            {React.createElement(practice.icon, {
                              sx: { fontSize: 40, color: 'primary.main', mr: 2 }
                            })}
                            <Typography variant="h6" component="h3">
                              {practice.area}
                            </Typography>
                          </Box>
                          <Typography color="text.secondary">
                            {practice.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Featured Lawyers Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ my: 8, bgcolor: 'background.paper', py: 8, borderRadius: 2 }}>
              <Typography variant="h3" component="h2" gutterBottom textAlign="center">
                Meet Our Expert Lawyers
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
                Highly qualified professionals ready to help you
              </Typography>
              <Grid container spacing={4}>
                {[
                  {
                    name: "Adv. Rajesh Kumar",
                    initials: "RK",
                    specialization: "Corporate Law",
                    experience: "15+ years",
                    rating: 4.8,
                    cases: "500+",
                    expertise: ["Mergers & Acquisitions", "Business Law", "Contracts"],
                    description: "Specializes in corporate restructuring and international business law. Has handled major M&A deals and corporate disputes."
                  },
                  {
                    name: "Adv. Priya Sharma",
                    initials: "PS",
                    specialization: "Family Law",
                    experience: "12+ years",
                    rating: 4.9,
                    cases: "300+",
                    expertise: ["Divorce Law", "Child Custody", "Family Disputes"],
                    description: "Expert in family law matters with a compassionate approach. Focuses on mediation and amicable settlements."
                  },
                  {
                    name: "Adv. Amit Patel",
                    initials: "AP",
                    specialization: "Criminal Law",
                    experience: "18+ years",
                    rating: 4.7,
                    cases: "1000+",
                    expertise: ["Criminal Defense", "White Collar Crime", "Appeals"],
                    description: "Renowned criminal defense attorney with expertise in handling complex criminal cases and appeals."
                  }
                ].map((lawyer, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      viewport={{ once: true }}
                    >
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'visible'
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -40,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: 'primary.main',
                              fontSize: '1.5rem',
                              border: '4px solid white'
                            }}
                          >
                            {lawyer.initials}
                          </Avatar>
                        </Box>
                        <CardContent sx={{ pt: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h5" component="h3" gutterBottom>
                              {lawyer.name}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                              {lawyer.specialization}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating value={lawyer.rating} precision={0.1} readOnly size="small" />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                ({lawyer.rating})
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Experience: {lawyer.experience} | Cases: {lawyer.cases}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              align="center"
                              sx={{ mt: 1, mb: 2 }}
                            >
                              {lawyer.description}
                            </Typography>
                            <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                              {lawyer.expertise.map((exp, i) => (
                                <Chip
                                  key={i}
                                  label={exp}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                              <Button
                                variant="contained"
                                size="small"
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Book Consultation
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                View Profile
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h4" gutterBottom>
                Ready to Get Started?
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paragraph>
                Join thousands of satisfied clients who found the right legal help
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="contained" size="large">
                  Find a Lawyer Now
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LandingPage;
