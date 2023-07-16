import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Tabs, type TabsProps } from 'antd'

import '../style/style.scss'
import Record from '../components/record'
import UploadWordFile from '../components/upload'
import CheckingResult from '../components/checkingResult'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '实时纠错'
  },
  {
    key: '2',
    label: '纠错记录'
  }
]

function Proofread () {
  const [activeTab, setActiverTab] = useState('1')
  const [uploadTaskId, setUploadTaskId] = useState('')

  // useEffect(() => {
  //   setTimeout(() => { setUploadTaskId('task-51609982-b703-4511-99b1-72fe58d5e243') }, 1000)
  // }, [])

  return (
      <div className='proofread-container'>
        <div className='proofread-box'>
          <div className='proofread-left'>
            <Tabs defaultActiveKey="1" activeKey={activeTab} items={items} onChange={key => { setActiverTab(key) }} />
            {activeTab === '1' && <CheckingResult uploadTaskId={uploadTaskId}></CheckingResult>}
            {activeTab === '2' && <Record></Record>}
          </div>
          <UploadWordFile setUploadTaskId={setUploadTaskId}></UploadWordFile>
          </div>
        </div>
  )
}

export default Proofread
