import React from 'react'
import { Flex, Layout, theme, Typography } from 'antd'

const { Header, Content } = Layout

const containerWidthStyle: React.CSSProperties = {
    maxWidth: '980px',
    width: '100%',
    margin: '0 auto'
}

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    display: 'flex',
    alignItems: 'center'
}

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    paddingBlock: '2rem',
    ...containerWidthStyle
}

const layoutStyle: React.CSSProperties = {
    overflow: 'hidden',
    height: '100vh'
}

const titleStyle = {
    margin: 0
}

type AppLayoutProps = {
    children: React.ReactNode
}

export const AppLayout = (props: AppLayoutProps) => {
    const {
        token: { colorBgContainer }
    } = theme.useToken()

    return (
        <Layout style={layoutStyle}>
            <Header style={{ ...headerStyle, background: colorBgContainer }}>
                <Flex style={containerWidthStyle}>
                    <Typography.Title level={3} style={titleStyle}>
                        Chat1k
                    </Typography.Title>
                </Flex>
            </Header>
            <Content style={contentStyle}>{props.children}</Content>
        </Layout>
    )
}
