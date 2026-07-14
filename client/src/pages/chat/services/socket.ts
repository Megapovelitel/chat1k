import { io, Socket } from 'socket.io-client'

export interface ServerToClientEvents {
    offer: (data: RTCSessionDescriptionInit) => void
    answer: (data: RTCSessionDescriptionInit) => void
    'ice-candidate': (data: RTCIceCandidate) => void
}

export interface ClientToServerEvents {
    offer: (data: RTCSessionDescriptionInit) => void
    answer: (data: RTCSessionDescriptionInit) => void
    'ice-candidate': (data: RTCIceCandidate) => void
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    import.meta.env.VITE_WEBSOCKET_HOST,
    {
        autoConnect: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000
    }
)
