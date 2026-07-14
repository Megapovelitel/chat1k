import { Alert, Skeleton } from 'antd'

import { ChatConnection } from './chat-connection'
import { useUserMedia } from '../../hooks'

export const ChatPage = () => {
    const { stream } = useUserMedia()

    if (!stream) {
        return (
            <>
                <Alert description="Please grant microphone access" />
                <Skeleton />
            </>
        )
    }

    return <ChatConnection stream={stream} />
}
