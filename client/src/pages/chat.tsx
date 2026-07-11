import { useEffect, useRef, useState } from 'react'
import { Alert, Skeleton, Typography } from 'antd'

import { createPeerConnection } from './webrtc'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_WEBSOCKET_HOST)

export const Chat = () => {
    const [micAllowed, setMicAllowed] = useState(false)

    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const init = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            setMicAllowed(true)

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
        }

        void init()

        /** TODO: add cleanup */
    }, [])

    const renderContent = () => {
        if (!micAllowed) {
            return (
                <>
                    <Alert description="Please grant microphone access" />
                    <Skeleton />
                </>
            )
        }
        return <Typography.Title>{'<Chat title="ShowTime" />'}</Typography.Title>
    }

    return (
        <div>
            {renderContent()}
            <audio ref={remoteAudioRef} />
        </div>
    )
}
