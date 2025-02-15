import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  categories: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Understanding Your Rights: A Guide to Employment Law",
    excerpt: "Learn about your fundamental rights as an employee and how to protect yourself in the workplace.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Sarah Johnson",
      avatar: "https://via.placeholder.com/100x100?text=Sarah+Johnson",
      role: "Employment Law Specialist"
    },
    date: "January 28, 2025",
    readTime: "5 min read",
    categories: ["Employment Law", "Legal Rights"],
  },
  {
    id: 2,
    title: "Digital Privacy Laws: What You Need to Know in 2025",
    excerpt: "Stay informed about the latest developments in digital privacy legislation and protect your online presence.",
    image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Michael Chen",
      avatar: "https://via.placeholder.com/100x100?text=Michael+Chen",
      role: "Technology Law Expert"
    },
    date: "January 25, 2025",
    readTime: "7 min read",
    categories: ["Privacy Law", "Technology"],
  },
  {
    id: 3,
    title: "Estate Planning: Securing Your Family's Future",
    excerpt: "A comprehensive guide to estate planning and ensuring your family's financial security.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Emily Rodriguez",
      avatar: "https://via.placeholder.com/100x100?text=Emily+Rodriguez",
      role: "Estate Planning Attorney"
    },
    date: "January 22, 2025",
    readTime: "6 min read",
    categories: ["Estate Planning", "Family Law"],
  },
  {
    id: 4,
    title: "Startup Legal Essentials: From Formation to Funding",
    excerpt: "Essential legal considerations for startups at every stage of growth.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "David Park",
      avatar: "https://via.placeholder.com/100x100?text=David+Park",
      role: "Corporate Law Attorney"
    },
    date: "January 20, 2025",
    readTime: "8 min read",
    categories: ["Startup Law", "Business"],
  },
];

const BlogList = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h2"
        component="h1"
        sx={{
          mb: 2,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Legal Insights & Updates
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 6, textAlign: 'center' }}
      >
        Stay informed with our latest articles on law and justice
      </Typography>

      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} sm={6} md={6} key={post.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={post.image}
                  alt={post.title}
                  sx={{
                    objectFit: 'cover',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    console.error(`Failed to load image: ${post.image}`);
                    e.target.src = 'https://via.placeholder.com/800x600?text=Legal+Insights';
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {post.categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        color="primary"
                        sx={{
                          background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
                        }}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      minHeight: 64,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 'auto',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={post.author.avatar}
                        alt={post.author.name}
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: 'primary.main',
                        }}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100x100?text=Author';
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{post.author.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.readTime}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {post.date}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
            px: 4,
          }}
        >
          Load More Articles
        </Button>
      </Box>
    </Container>
  );
};

export default BlogList;
