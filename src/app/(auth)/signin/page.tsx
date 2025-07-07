'use client'

import { Suspense, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button, Col, Row, Typography } from 'antd'
import LoginForm from './LoginForm'

const { Text } = Typography

const LoginPage = () => {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const [loginOption, setLoginOption] = useState<string>('ad')

  useEffect(() => {
    if (error) {
      // console.log('Error:', error)
    }
  }, [error])

  const loginContent = () => {
    if (loginOption === 'credentials') {
      return (
        <>
          <div
            className="my-4 text-left text-sm text-blue-500 cursor-pointer"
            onClick={() => setLoginOption('ad')}
          >
            กลับหน้าหลัก
          </div>
          <LoginForm />
        </>
      )
    }

    return (
      <>
        <div className="my-4">
          <Button
            type="primary"
            size="large"
            onClick={() => signIn('azure-ad', { callbackUrl: '/' })}
          >
            <div className="px-4">เข้าสู่ระบบด้วย Active Directory</div>
          </Button>
        </div>
        <div className="mb-8">
          <Button
            type="primary"
            size="large"
            onClick={() => setLoginOption('credentials')}
          >
            <div className="px-4">เข้าสู่ระบบด้วย login credential</div>
          </Button>
        </div>
      </>
    )
  }

  return (
    <Row className="w-screen h-screen">
      <Col flex={3} className="login-image">
        <div className="h-screen"></div>
      </Col>
      <Col flex={1}>
        <div className="flex justify-center items-center h-screen bg-slate-50">
          <div className="text-center">
            <Image src="/images/logo.png" alt="Logo" width={240} height={52} priority />
            <div className=" my-12">
              <p>ยินดีต้อนรับเข้าสู่ระบบ</p>
              <p>กดปุ่มข้างล่างเพื่อเข้าสู่ระบบ</p>
            </div>
            {loginContent()}
            <Text type="secondary">
              <div>ⓒ 2024 Wedo All right reserved</div>
              <b>Version 1.0.0</b>
            </Text>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default function SuspenseWrapper() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}
