'use client'

import React, { useState } from 'react'
import { signOut as nextAuthSignOut, useSession } from 'next-auth/react'
import { Dropdown } from 'antd'
import { Avatar, Layout, theme } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { signout } from '@/services/auth.service'

const { Header } = Layout

const HeaderBar = () => {
  const [visible, setVisible] = useState(false)
  const { data: session } = useSession()

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag)
  }

  const items = [
    {
      key: '1',
      label: (
        <div
          className="flex items-center gap-2 px-4 py-2"
          onClick={() => signout(nextAuthSignOut)}
        >
          <LogoutOutlined className="w-5 h-5 text-gray-600 transform -rotate-90" />
          <span className="text-base">ออกจากระบบ</span>
        </div>
      ),
    },
  ]

  return (
    <Header
      className="flex justify-between items-center shadow"
      style={{
        padding: '0px 24px',
        background: colorBgContainer,
      }}
    >
      <div className="font-bold text-xl text-primary">Sample Home Page</div>
      <Dropdown
        menu={{ items }}
        onOpenChange={handleVisibleChange}
        open={visible}
        trigger={['hover']}
        placement="bottomRight"
        dropdownRender={(menu) => (
          <div className="bg-white rounded-lg py-1 min-w-[160px]">{menu}</div>
        )}
      >
        <div className="flex justify-center items-center gap-3 cursor-pointer">
          <div className="text-sm text-right">
            <div className="font-bold text-primary">
              {session?.user?.name || 'Anonymous'}
            </div>
            <div className="text-xs text-c-sub">{'Role Name'}</div>
          </div>
          <Avatar icon={<UserOutlined />} className="bg-gray-200" />
        </div>
      </Dropdown>
    </Header>
  )
}

export default HeaderBar
