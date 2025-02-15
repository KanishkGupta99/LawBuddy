import React, { useEffect, useRef, useState } from 'react';
import webRTCService from '../services/webrtc';
import '../styles/VideoCall.css';

const VideoCall = ({ email, roomId }) => {
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [error, setError] = useState(null);
    const [isReconnecting, setIsReconnecting] = useState(false);
    
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const messagesEndRef = useRef();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const init = async () => {
            try {
                await webRTCService.init(email);
                
                webRTCService.onLocalStream = (stream) => {
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                };

                webRTCService.onRemoteStream = (stream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = stream;
                        setIsCallStarted(true);
                    }
                };

                webRTCService.onUserJoined = (userEmail, socketId) => {
                    setRemoteSocketId(socketId);
                    setError(null);
                };

                webRTCService.onCallEnded = () => {
                    setIsCallStarted(false);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = null;
                    }
                    setError(null);
                };

                webRTCService.onChatMessage = (message) => {
                    setMessages(prev => [...prev, message]);
                };

                webRTCService.onError = (errorMessage) => {
                    setError(errorMessage);
                };

                webRTCService.onDisconnect = (reason) => {
                    if (reason === 'io server disconnect') {
                        setError('Disconnected from server. Please check your internet connection.');
                    } else if (reason === 'transport close') {
                        setIsReconnecting(true);
                        setError('Connection lost. Attempting to reconnect...');
                    }
                };

                await webRTCService.joinRoom(roomId);
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        };

        init();

        return () => {
            webRTCService.cleanup();
        };
    }, [email, roomId]);

    const handleStartCall = async () => {
        try {
            if (remoteSocketId) {
                await webRTCService.makeCall(remoteSocketId);
                setError(null);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEndCall = () => {
        try {
            if (remoteSocketId) {
                webRTCService.endCall(remoteSocketId);
                setError(null);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && remoteSocketId) {
            webRTCService.sendChatMessage(remoteSocketId, messageInput);
            setMessageInput('');
        }
    };

    return (
        <div className="video-call-container">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            {isReconnecting && (
                <div className="reconnecting-message">
                    Attempting to reconnect...
                </div>
            )}
            
            <div className="video-grid">
                <div className="video-wrapper">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="local-video"
                    />
                    <p>You ({email})</p>
                </div>
                <div className="video-wrapper">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="remote-video"
                    />
                    <p>Remote User</p>
                </div>
            </div>

            <div className="controls">
                {!isCallStarted ? (
                    <button 
                        onClick={handleStartCall}
                        disabled={!remoteSocketId}
                        className="call-button"
                    >
                        Start Call
                    </button>
                ) : (
                    <button 
                        onClick={handleEndCall}
                        className="end-call-button"
                    >
                        End Call
                    </button>
                )}
            </div>

            <div className="chat-section">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div 
                            key={index}
                            className={`message ${msg.isSelf ? 'self' : 'remote'}`}
                        >
                            <p className="sender">{msg.senderEmail}</p>
                            <p className="content">{msg.message}</p>
                            <p className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="message-input">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default VideoCall;
