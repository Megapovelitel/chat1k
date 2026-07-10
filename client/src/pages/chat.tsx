import { useEffect, useState } from 'react'
import { Alert, Skeleton, Typography } from 'antd'
import axios from 'axios'

export const Chat = () => {
    const [micAllowed, setMicAllowed] = useState(false)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
            setMicAllowed(true)
            console.log(stream)
            // window.localStream = stream // A
            // window.localAudio.srcObject = stream // B
            // window.localAudio.autoplay = true // C
        })
    }, [])

    const [data, setData] = useState<unknown>()

    useEffect(() => {
        const getHelloWorld = async () => {
            const result = await axios.get(import.meta.env.VITE_API_ROUTE + '/api/v0/hello')
            setData(result.data)
        }
        void getHelloWorld()
    }, [])

    if (!micAllowed) {
        return (
            <>
                <Alert description="Please grant microphone access" />
                <Skeleton />
            </>
        )
    }

    return (
        <>
            <Typography.Text>{'<Chat />'}</Typography.Text>
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </>
    )
}
