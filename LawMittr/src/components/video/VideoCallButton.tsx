import React, { useState } from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import VideoCall from './VideoCall';
import VideocamIcon from '@mui/icons-material/Videocam';

interface VideoCallButtonProps {
  appointmentId: string;
  lawyerEmail: string;
  userEmail: string;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  appointmentId,
  lawyerEmail,
  userEmail,
}) => {
  const [isCallOpen, setIsCallOpen] = useState(false);

  return (
    <>
      <Button
        component={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variant="contained"
        startIcon={<VideocamIcon />}
        onClick={() => setIsCallOpen(true)}
        sx={{
          background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
          color: 'white',
          textTransform: 'none',
          borderRadius: '12px',
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1E40AF 0%, #0284C7 100%)',
          },
        }}
      >
        Start Video Call
      </Button>

      <VideoCall
        open={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        appointmentId={appointmentId}
        lawyerEmail={lawyerEmail}
        userEmail={userEmail}
      />
    </>
  );
};

export default VideoCallButton;
