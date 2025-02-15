class WebRTCErrorHandler {
    static handleMediaError(error) {
        switch (error.name) {
            case 'NotFoundError':
            case 'DevicesNotFoundError':
                return 'Required media devices not found. Please check your camera and microphone.';
            case 'NotAllowedError':
            case 'PermissionDeniedError':
                return 'Permission to access media devices was denied. Please allow access to your camera and microphone.';
            case 'NotReadableError':
            case 'TrackStartError':
                return 'Could not access your media devices. Please ensure they are not being used by another application.';
            case 'OverconstrainedError':
            case 'ConstraintNotSatisfiedError':
                return 'Your device does not meet the required media constraints. Please try a different device.';
            case 'TypeError':
                return 'No media constraints specified.';
            default:
                return `An error occurred while accessing media devices: ${error.message}`;
        }
    }

    static handleConnectionError(error) {
        switch (error.name) {
            case 'InvalidStateError':
                return 'The connection is in an invalid state. Please try reconnecting.';
            case 'InvalidSessionDescriptionError':
                return 'Failed to create a valid connection. Please try again.';
            case 'OperationError':
                return 'The requested operation failed. Please check your connection and try again.';
            default:
                return `Connection error: ${error.message}`;
        }
    }

    static handleSocketError(error) {
        if (error.message.includes('connect')) {
            return 'Failed to connect to the signaling server. Please check your internet connection.';
        } else if (error.message.includes('disconnect')) {
            return 'Lost connection to the signaling server. Attempting to reconnect...';
        } else {
            return `Socket error: ${error.message}`;
        }
    }

    static handleICEError(error) {
        return `ICE connection failed: ${error.message}. This might be due to firewall restrictions or network issues.`;
    }
}

export default WebRTCErrorHandler;
