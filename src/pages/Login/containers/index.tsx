import React from 'react'

import { useNavigate } from 'react-router-dom'
import { Input, Form, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import '../style/style.scss'
import { login } from '../service'
import { get } from 'lodash'
import { useAuth } from '../../../components/Auth/authProvider'

function Login () {
  const { setToken } = useAuth()
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    const [res, err] = await login(values)
    if (res?.code === 0 && res?.data?.token) {
      setToken(res?.data?.token)
      navigate('/proofread', { replace: true })
    } else if (err != null) {
      return await messageApi.error(get(err, 'message'))
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
      <div className='login-container'>
        {contextHolder}
        <div className='login-box'>
        <Form
          name="basic"
          className='login-form'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请填写账号' }]}
          >
            <Input size="large" placeholder="账号" prefix={<UserOutlined />} bordered={true} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请填写密码' }]}
          >
            <Input size="large" placeholder="密码" type="password" prefix={<LockOutlined />} bordered={false} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size='large'>
              登录
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>
  )
}

export default Login
