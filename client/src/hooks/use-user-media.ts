import { useEffect, useState } from 'react'

export const useUserMedia = () => {
    const [stream, setStream] = useState<MediaStream | null>(null)

    useEffect(() => {
        void navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((newStream) => {
                setStream(newStream)
            })
    }, [])

    useEffect(() => {
        return () => {
            stream?.getTracks().forEach((track) => {
                track.stop()
            })
        }
    }, [stream])

    return { stream }
}
