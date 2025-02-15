import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Stack,
  Tooltip,
  Alert,
  TextField,
  Snackbar,
  Slide,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  Call as CallIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';

interface CallNotificationProps {
  callerEmail: string;
  onAccept: () => void;
  onReject: () => void;
}

const CallNotification: React.FC<CallNotificationProps> = ({
  callerEmail,
  onAccept,
  onReject,
}) => (
  <Slide direction="up" in={true}>
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        minWidth: 300,
        zIndex: 9999,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">
          Incoming Call from {callerEmail}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CallIcon />}
            onClick={onAccept}
            sx={{
              background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
            }}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CallEnd />}
            onClick={onReject}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </Paper>
  </Slide>
);

const DirectVideoCall: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetEmail, setTargetEmail] = useState('');
  const [inCall, setInCall] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [callerEmail, setCallerEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setError(null);
      
      // Get user email (in a real app, this would come from your auth system)
      const email = prompt('Enter your email to start video calls:');
      if (email) {
        setUserEmail(email);
        newSocket.emit('user:register', { email });
        console.log('Registered with email:', email);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to server. Please try again.');
    });

    newSocket.on('incoming:call', async ({ from, offer }) => {
      console.log('Incoming call from:', from);
      setCallerEmail(from);
      setShowNotification(true);
      
      try {
        const pc = await initializePeerConnection();
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          console.log('Set remote description successfully');
        }
      } catch (err) {
        console.error('Error handling incoming call:', err);
        setError('Failed to handle incoming call');
      }
    });

    newSocket.on('call:rejected', () => {
      console.log('Call was rejected');
      setSnackbarMessage('Call was rejected');
      setShowSnackbar(true);
      cleanup();
    });

    newSocket.on('call:accepted', async ({ ans }) => {
      console.log('Call was accepted');
      try {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(ans));
          console.log('Set remote answer successfully');
          setInCall(true);
        }
      } catch (err) {
        console.error('Error handling accepted call:', err);
        setError('Failed to establish connection');
      }
    });

    newSocket.on('ice:candidate', async ({ candidate }) => {
      console.log('Received ICE candidate');
      try {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(candidate);
          console.log('Added ICE candidate successfully');
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.close();
      cleanup();
    };
  }, []);

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
      return stream;
    } catch (err: any) {
      console.error('Error accessing camera and microphone:', err);
      setError('Failed to access camera and microphone: ' + err.message);
      return null;
    }
  };

  const initializePeerConnection = async () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;

    // Add local stream
    const stream = await initializeMedia();
    if (stream) {
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice:candidate', {
          to: targetEmail,
          candidate: event.candidate,
        });
      }
    };

    return pc;
  };

  const makeCall = async () => {
    if (!targetEmail) {
      setError('Please enter the recipient\'s email');
      return;
    }

    if (!userEmail) {
      setError('Please enter your email first');
      return;
    }

    console.log('Initiating call to:', targetEmail);
    setError(null);

    try {
      const pc = await initializePeerConnection();
      if (!pc) {
        throw new Error('Failed to create peer connection');
      }

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      
      await pc.setLocalDescription(offer);
      console.log('Created and set local offer');

      socket?.emit('user:call', {
        to: targetEmail,
        from: userEmail,
        offer,
      });
      
      console.log('Sent call request to server');
      setSnackbarMessage('Calling...');
      setShowSnackbar(true);
    } catch (err: any) {
      console.error('Error making call:', err);
      setError('Failed to make call: ' + err.message);
    }
  };

  const handleAcceptCall = async () => {
    try {
      const pc = await initializePeerConnection();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socket?.emit('call:accepted', {
        to: callerEmail,
        ans: answer,
      });
      
      setShowNotification(false);
      setInCall(true);
    } catch (err: any) {
      console.error('Error accepting call:', err);
      setError('Failed to accept call: ' + err.message);
    }
  };

  const handleRejectCall = () => {
    socket?.emit('call:rejected', { to: callerEmail });
    setShowNotification(false);
    cleanup();
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

  const endCall = () => {
    cleanup();
    setInCall(false);
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
    <Box sx={{ p: 3 }}>
      <AnimatePresence>
        {!inCall && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Make a Video Call
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Enter recipient's email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  variant="outlined"
                />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CallIcon />}
                  onClick={makeCall}
                  sx={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1E40AF 0%, #0284C7 100%)',
                    },
                  }}
                >
                  Start Call
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        fullScreen
        open={inCall}
        onClose={endCall}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            backgroundImage: 'linear-gradient(to bottom right, #2563EB22, #38BDF822)',
          },
        }}
      >
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
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
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
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                  }}
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
                <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                  {isMuted ? <MicOff /> : <Mic />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isVideoOff ? 'Turn on video' : 'Turn off video'}>
                <IconButton onClick={toggleVideo} sx={{ color: 'white' }}>
                  {isVideoOff ? <VideocamOff /> : <Videocam />}
                </IconButton>
              </Tooltip>

              <Tooltip title="End call">
                <IconButton
                  onClick={endCall}
                  sx={{
                    bgcolor: '#ef4444',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#dc2626',
                    },
                  }}
                >
                  <CallEnd />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Incoming Call Notification */}
      {showNotification && (
        <CallNotification
          callerEmail={callerEmail}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {/* Status Messages */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default DirectVideoCall;
