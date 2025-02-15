import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Paper,
  Stack,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  ScreenShare,
  StopScreenShare,
  Chat as ChatIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

interface VideoCallProps {
  appointmentId: string;
  lawyerEmail: string;
  userEmail: string;
  onClose: () => void;
  open: boolean;
}

const StyledVideo = styled('video')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transform: scaleX(-1);
`;

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  padding: theme.spacing(1.5),
}));

const VideoCall: React.FC<VideoCallProps> = ({
  appointmentId,
  lawyerEmail,
  userEmail,
  onClose,
  open,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (open) {
      initializeMedia();
    }
    return () => {
      cleanup();
    };
  }, [open]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      initializePeerConnection(stream);
    } catch (err: any) {
      setError('Failed to access camera and microphone: ' + err.message);
    }
  };

  const initializePeerConnection = (stream: MediaStream) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;

    // Add local stream tracks to peer connection
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle connection state changes
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'failed') {
        setError('Connection failed. Please try again.');
      }
    };
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } else {
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        setIsScreenSharing(false);
      }
    } catch (err: any) {
      setError('Failed to share screen: ' + err.message);
    }
  };

  const endCall = () => {
    cleanup();
    onClose();
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#1a1a1a',
          backgroundImage: 'linear-gradient(to bottom right, #2563EB22, #38BDF822)',
        },
      }}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="white">
          Video Consultation
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box sx={{ flex: 1, display: 'flex', gap: 2, position: 'relative' }}>
            {/* Remote Video (Main) */}
            <Paper
              elevation={8}
              sx={{
                flex: 1,
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'black',
                position: 'relative',
              }}
            >
              <StyledVideo
                ref={remoteVideoRef}
                autoPlay
                playsInline
              />
              {!remoteStream && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6">
                    Waiting for lawyer to join...
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Local Video (Picture-in-Picture) */}
            <Paper
              component={motion.div}
              drag
              dragConstraints={{
                top: 0,
                left: 0,
                right: 100,
                bottom: 100,
              }}
              sx={{
                position: 'absolute',
                right: 20,
                top: 20,
                width: 200,
                height: 150,
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'move',
              }}
            >
              <StyledVideo
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
              />
            </Paper>
          </Box>

          {/* Controls */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{
              p: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
              <ControlButton onClick={toggleMute} color="primary">
                {isMuted ? <MicOff /> : <Mic />}
              </ControlButton>
            </Tooltip>

            <Tooltip title={isVideoOff ? 'Turn on video' : 'Turn off video'}>
              <ControlButton onClick={toggleVideo} color="primary">
                {isVideoOff ? <VideocamOff /> : <Videocam />}
              </ControlButton>
            </Tooltip>

            <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
              <ControlButton onClick={toggleScreenShare} color="primary">
                {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
              </ControlButton>
            </Tooltip>

            <Tooltip title="End call">
              <ControlButton
                onClick={endCall}
                sx={{
                  backgroundColor: '#ef4444',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  },
                }}
              >
                <CallEnd />
              </ControlButton>
            </Tooltip>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;
