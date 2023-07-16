import React, { useEffect, useMemo, useRef, useState } from 'react'

// import { useNavigate } from 'react-router-dom'
import { message, Button, Table, Tag } from 'antd'
import { InboxOutlined, ReloadOutlined } from '@ant-design/icons'
import { queryTask } from '../service'
import moment from 'moment'

const defaultStatus = { color: 'default', label: '未知' }

const taskStatusMap = [
  {
    status: 1,
    color: 'processing',
    label: '纠错中'
  },
  {
    status: 2,
    color: 'success',
    label: '纠错完成'
  },
  {
    status: 3,
    color: 'error',
    label: '纠错失败'
  }
]

function Record () {
  const [taskList, setTaskList] = useState([])
  const [taskCount, setTaskCount] = useState(0)
  const [recordHeight, setRecordHeight] = useState(0)
  const recordRef = useRef(null)

  useEffect(() => {
    queryList()
  }, [])

  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName'
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      render: (taskStatus: number) => {
        const statusObj = taskStatusMap.find(item => item.status === taskStatus) ?? defaultStatus
        return <Tag color={statusObj?.color}>{statusObj?.label}</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime: string) => moment(createTime).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: { taskStatus: number, fileToken: string, fileName: string }) => {
        if (record.taskStatus === 2) {
          return <Button type="link" onClick={async () => { await downloadFile(record) }}>下载</Button>
        } else {
          return <Button type="text" disabled>-</Button>
        }
      }
    }
  ]

  const queryList = async () => {
    const [res, err] = await queryTask({})
    if (res) {
      setTaskList(res.data.list)
      setTaskCount(res.data.total)
    }
  }

  const downloadFile = async (record: { fileToken: string, fileName: string }) => {
    const { fileToken, fileName } = record
    const fullName = `${fileToken}_${fileName}`
    if (location.hostname === '127.0.0.1') {
      window.open(`//127.0.0.1:3001/proofread/download?token=${fullName}`)
    } else {
      window.open(`/api/proofread/download?token=${fullName}`)
    }
  }

  const observer = useMemo(
    () =>
      new ResizeObserver((entries, observer) => {
        for (const entry of entries) {
          const contentRect = entry.contentRect
          const height = Math.trunc(contentRect?.height || 0)
          setRecordHeight(height)
        }
      }), [recordRef.current]
  )

  useEffect(() => {
    observer.observe((recordRef?.current as any)?.parentNode)
    return () => {
      observer.disconnect()
    }
  }, [observer])

  return (
        <div className='proofread-record' ref={recordRef}>
            <div className='refresh-btn'>
            <Button type='primary' onClick={async () => { await queryList() }}>刷新列表</Button>
            </div>
            <Table columns={columns} dataSource={taskList} scroll={{ y: `calc(${recordHeight}px - 170px)` }} />
          </div>
  )
}

export default Record
