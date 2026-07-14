import { Alert, Flex, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { createPeerConnection } from '../webrtc'
import { socket } from './services/socket'

type ChatConnectionProps = {
    stream: MediaStream
}

export const ChatConnection = ({ stream }: ChatConnectionProps) => {
    const [connected, setConnected] = useState(false)
    const [connectionError, setConnectionError] = useState<Error | null>(null)

    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const onConnect = () => {
            setConnected(true)
            setConnectionError(null)
        }

        const onDisconnect = () => {
            setConnected(false)
            setConnectionError(null)
        }

        const onError = (error: Error) => {
            setConnectionError(error)
        }

        socket.connect()
        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)
        socket.on('connect_error', onError)

        return () => {
            socket.disconnect()
            socket.off('connect')
            socket.off('disconnect')
            socket.off('connect_error')
        }
    }, [])

    useEffect(() => {
        if (!connected) {
            return
        }

        const peerConnection = createPeerConnection()

        /** Output tracks */
        stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream)
        })

        /** Input tracks */
        const remoteStream = new MediaStream()

        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream
            remoteAudioRef.current.play()
        }

        peerConnection.addEventListener('track', (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track)
            })
        })

        peerConnection.addEventListener('icecandidate', (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate)
            }
        })

        const sendOffer = async () => {
            const offer = await peerConnection.createOffer({
                offerToReceiveVideo: false,
                offerToReceiveAudio: true,
                iceRestart: true
            })

            peerConnection.setLocalDescription(offer)
            socket.emit('offer', offer)
        }

        sendOffer()

        socket.on('offer', async (offer) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)
            socket.emit('answer', answer)
        })

        socket.on('answer', async (answer) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.on('ice-candidate', async (candidate) => {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        })

        return () => {
            socket.off('offer')
            socket.off('answer')
            socket.off('ice-candidate')
        }
    }, [stream, connected])

    if (connectionError) {
        return <Alert type="error" description={connectionError.message} />
    }

    return (
        <>
            <Flex gap="middle" justify="flex-start" align="center">
                <Typography.Title>{'<Chat title="ShowTime" />'}</Typography.Title>
            </Flex>
            <audio ref={remoteAudioRef} />
        </>
    )
}
