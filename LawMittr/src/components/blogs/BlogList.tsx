import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
} from '@mui/material';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Digital Privacy Laws in 2025',
    summary: 'A comprehensive guide to the latest digital privacy regulations and their implications for individuals and businesses.',
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: 'Sarah Johnson',
    date: 'January 30, 2025',
    category: 'Privacy Law',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'The Future of Smart Contracts',
    summary: 'Exploring how blockchain technology and smart contracts are revolutionizing legal agreements.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    author: 'Michael Chen',
    date: 'January 29, 2025',
    category: 'Technology Law',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Legal Implications of AI in Healthcare',
    summary: 'Analyzing the legal challenges and opportunities presented by AI adoption in healthcare.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: 'Dr. Emily Roberts',
    date: 'January 28, 2025',
    category: 'Healthcare Law',
    readTime: '10 min read',
  },
];

const BlogList = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          mb: 6,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Legal Insights Blog
      </Typography>

      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={4} key={post.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: post.id * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                          color: 'white',
                          mb: 2,
                        }}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {post.date} • {post.readTime}
                      </Typography>
                    </Box>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        minHeight: '3em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.summary}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        By {post.author}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogList;
