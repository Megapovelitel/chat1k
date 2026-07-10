import { AppLayout } from '@components/layout'
import { AntdConfigProvider } from '@components/antd-config-provider'
import { Chat } from './pages/chat'

function App() {
    return (
        <AntdConfigProvider>
            <AppLayout>
                <Chat />
            </AppLayout>
        </AntdConfigProvider>
    )
}

export default App
