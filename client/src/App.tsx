import { AppLayout } from '@components/layout'
import { AntdConfigProvider } from '@components/antd-config-provider'
import { ChatPage } from './pages/chat'

function App() {
    return (
        <AntdConfigProvider>
            <AppLayout>
                <ChatPage />
            </AppLayout>
        </AntdConfigProvider>
    )
}

export default App
