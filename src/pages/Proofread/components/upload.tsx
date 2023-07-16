import React, { useEffect, useMemo, useRef, useState } from 'react'

// import { useNavigate } from 'react-router-dom'
import { Upload, type UploadProps, message, type UploadFile, Button } from 'antd'
import { InboxOutlined, ReloadOutlined } from '@ant-design/icons'
import { customAlphabet } from 'nanoid'
import { uploadDocCheck } from '../service'
import moment from 'moment'
import { type RcFile } from 'antd/es/upload'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwwxyz', 10)
const { Dragger } = Upload

interface UploadWordFileProps {
  setUploadTaskId: (params: string) => void
}

function UploadWordFile (props: UploadWordFileProps) {
  const { setUploadTaskId } = props
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.set('file', file as RcFile, encodeURI(file.name))
      formData.set('token', nanoid())
    })
    setUploading(true)
    const [res, err] = await uploadDocCheck(formData)
    if (res?.code === 0) {
      message.success('上传成功，文件解析中')
      setFileList([])
      setUploading(false)
      setUploadTaskId(`task-${res.data.taskId}`)
    } else {
      setUploadTaskId('')
      message.error('upload failed.')
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.docx',
    fileList,
    beforeUpload: (file) => {
      const typeList = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const isDoc = typeList.includes(file.type)
      if (!isDoc) {
        message.error(`${file.name} 不是文档文件`)
      }
      setFileList([file])
      return false
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    }
  }

  return (
    <div className='proofread-upload'>
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到这里进行上传</p>
      <p className="ant-upload-hint">
        支持文件类型：.docx
      </p>
    </Dragger>
    <Button onClick={handleUpload} type="primary" disabled={fileList.length < 1}>点击上传</Button>
    </div>
  )
}

export default UploadWordFile
