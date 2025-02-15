import { io } from 'socket.io-client';
import WebRTCErrorHandler from './webrtcErrorHandler';

class WebRTCService {
    constructor() {
        this.socket = null;
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.roomId = null;
        this.email = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async init(email) {
        this.email = email;
        try {
            this.socket = io('http://localhost:8000', {
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: 1000,
            });
            
            this.setupSocketListeners();
            await this.setupLocalStream();
        } catch (error) {
            throw new Error(WebRTCErrorHandler.handleSocketError(error));
        }
    }

    setupSocketListeners() {
        this.socket.on('connect_error', (error) => {
            console.error(WebRTCErrorHandler.handleSocketError(error));
            if (this.onError) this.onError(WebRTCErrorHandler.handleSocketError(error));
        });

        this.socket.on('disconnect', (reason) => {
            console.warn(`Disconnected: ${reason}`);
            if (this.onDisconnect) this.onDisconnect(reason);
        });

        this.socket.on('user:joined', ({ email, id }) => {
            console.log(`${email} joined the room`);
            if (this.onUserJoined) this.onUserJoined(email, id);
        });

        this.socket.on('incomming:call', async ({ from, offer }) => {
            try {
                await this.handleIncomingCall(from, offer);
            } catch (error) {
                console.error(WebRTCErrorHandler.handleConnectionError(error));
                if (this.onError) this.onError(WebRTCErrorHandler.handleConnectionError(error));
            }
        });

        this.socket.on('call:accepted', async ({ from, ans }) => {
            try {
                await this.handleCallAccepted(from, ans);
            } catch (error) {
                console.error(WebRTCErrorHandler.handleConnectionError(error));
                if (this.onError) this.onError(WebRTCErrorHandler.handleConnectionError(error));
            }
        });

        this.socket.on('peer:nego:needed', async ({ from, offer }) => {
            try {
                await this.handleNegoNeeded(from, offer);
            } catch (error) {
                console.error(WebRTCErrorHandler.handleConnectionError(error));
                if (this.onError) this.onError(WebRTCErrorHandler.handleConnectionError(error));
            }
        });

        this.socket.on('peer:nego:final', async ({ from, ans }) => {
            try {
                await this.handleNegoFinal(from, ans);
            } catch (error) {
                console.error(WebRTCErrorHandler.handleConnectionError(error));
                if (this.onError) this.onError(WebRTCErrorHandler.handleConnectionError(error));
            }
        });

        this.socket.on('call:ended', ({ from }) => {
            this.handleCallEnded(from);
        });

        this.socket.on('chat:message', (message) => {
            if (this.onChatMessage) this.onChatMessage(message);
        });
    }

    async setupLocalStream() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            if (this.onLocalStream) this.onLocalStream(this.localStream);
        } catch (error) {
            throw new Error(WebRTCErrorHandler.handleMediaError(error));
        }
    }

    async joinRoom(roomId) {
        this.roomId = roomId;
        this.socket.emit('room:join', { email: this.email, room: roomId });
    }

    async createPeerConnection(remoteSocketId) {
        try {
            const configuration = {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            };

            this.peerConnection = new RTCPeerConnection(configuration);

            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });

            this.peerConnection.ontrack = ({ streams: [remoteStream] }) => {
                this.remoteStream = remoteStream;
                if (this.onRemoteStream) this.onRemoteStream(remoteStream);
            };

            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    // Handle ICE candidate
                }
            };

            this.peerConnection.oniceconnectionstatechange = () => {
                if (this.peerConnection.iceConnectionState === 'failed') {
                    console.error(WebRTCErrorHandler.handleICEError(new Error('ICE connection failed')));
                    if (this.onError) this.onError(WebRTCErrorHandler.handleICEError(new Error('ICE connection failed')));
                }
            };

            this.peerConnection.onnegotiationneeded = async () => {
                try {
                    const offer = await this.peerConnection.createOffer();
                    await this.peerConnection.setLocalDescription(offer);
                    this.socket.emit('peer:nego:needed', {
                        to: remoteSocketId,
                        offer
                    });
                } catch (error) {
                    console.error(WebRTCErrorHandler.handleConnectionError(error));
                    if (this.onError) this.onError(WebRTCErrorHandler.handleConnectionError(error));
                }
            };
        } catch (error) {
            throw new Error(WebRTCErrorHandler.handleConnectionError(error));
        }
    }

    async makeCall(remoteSocketId) {
        try {
            await this.createPeerConnection(remoteSocketId);
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            this.socket.emit('user:call', { to: remoteSocketId, offer });
        } catch (error) {
            throw new Error(WebRTCErrorHandler.handleConnectionError(error));
        }
    }

    async handleIncomingCall(from, offer) {
        try {
            await this.createPeerConnection(from);
            await this.peerConnection.setRemoteDescription(offer);
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.socket.emit('call:accepted', { to: from, ans: answer });
        } catch (error) {
            throw new Error(WebRTCErrorHandler.handleConnectionError(error));
        }
    }

    async handleCallAccepted(from, ans) {
        try {
            await this.peerConnection.setRemoteDescription(ans);
        } catch (error) {
            throw new Error(WebRTCErrorHandler.handleConnectionError(error));
        }
    }

    async handleNegoNeeded(from, offer) {
        try {
            await this.peerConnection.setRemoteDescription(offer);
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.socket.emit('peer:nego:done', { to: from, ans: answer });
        } catch (error) {
            throw new Error(WebRTCErrorHandler.handleConnectionError(error));
        }
    }

    async handleNegoFinal(from, ans) {
        try {
            await this.peerConnection.setRemoteDescription(ans);
        } catch (error) {
            throw new Error(WebRTCErrorHandler.handleConnectionError(error));
        }
    }

    handleCallEnded(from) {
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        if (this.onCallEnded) this.onCallEnded(from);
    }

    endCall(remoteSocketId) {
        this.socket.emit('call:end', { to: remoteSocketId });
        this.handleCallEnded(remoteSocketId);
    }

    sendChatMessage(to, message) {
        this.socket.emit('chat:message', { to, message });
    }

    cleanup() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default new WebRTCService();
