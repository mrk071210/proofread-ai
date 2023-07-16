import React, { useEffect, useMemo, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import '../style/style.scss'

interface CheckingResultProps {
  uploadTaskId: string
}

function CheckingResult (props: CheckingResultProps) {
  const { uploadTaskId } = props

  const [textParagraph, setTextParagraph] = useState<any[]>([])
  const [status, setStatus] = useState('wait')

  useEffect(() => {
    if (uploadTaskId) {
      setTextParagraph([])
      setStatus('wait')
      getCheckingResult()
    }
  }, [uploadTaskId])

  const getCheckingResult = () => {
    let wsUrl = ''
    // if (location.hostname === '127.0.0.1') {
    // wsUrl = 'http://127.0.0.1:3002'
    // } else {
    wsUrl = 'https://mmmrk.cn'
    // }
    const socket = io(wsUrl, {
      path: '/check'
    })
    socket.on('connect', () => {
      console.log(socket.id)
    })
    socket.emit('getResult', { taskId: uploadTaskId })
    setStatus('loading')
    socket.on(uploadTaskId, (data: any) => { dealCheckResultList(data, socket) })
  }

  const dealCheckResultList = (data: any[], socket: Socket) => {
    console.log(data)
    const _textParagraph = [...textParagraph]
    data.forEach(item => {
      const resultObj = JSON.parse(item)
      if (resultObj.end) {
        socket.emit('getResult', { taskId: uploadTaskId, end: true })
        socket.disconnect()
        setStatus('finished')
      }
      let { result, text, index } = resultObj
      result = JSON.parse(
        decodeURIComponent(escape(window.atob(result)))
      )
      if (!textParagraph.find(textItem => textItem.index === index)) {
        const newResult = heightText({ result, text, index })
        _textParagraph.push(newResult)
      }
    })
    setTextParagraph(_textParagraph)
  }

  const heightText = ({ result, text, index }: { result: Record<string, any[][]>, text: string, index: number }) => {
    const lists = Object.values(result).flat().sort((a, b) => (a[0] - b[0]))
    const textList = text.split('')
    lists.forEach(list => {
      const [startNum, oldText, newText, errType] = list
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const endNum = startNum + oldText.length

      if (startNum === endNum - 1) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        textList[startNum] = `<span class="highlight old-text" id="${index}-${startNum}">${textList[startNum]}</span><span class="highlight new-text">${newText}</span>`
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        textList[startNum] = `<span class="highlight old-text" id="${index}-${startNum}">${textList[startNum]}`
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        textList[endNum - 1] = `${textList[endNum - 1]}</span><span class="highlight new-text">${newText}</span>`
      }
    })
    return { lists, text: textList.join(''), index }
  }

  return (
        <div className='proofread-checking'>
          <div className='text-title'>

          {
            status === 'finished' && <div>文档纠错已完成，请前往纠错记录下载文件</div>
          }
          {
            status === 'loading' && <div>文档纠错中。。。</div>
          }
          {
            status === 'wait' && <div>请上传文档开始纠错</div>
          }
          </div>
          <div className='text-result'>

            {textParagraph.map(item => {
              return <div className='text-item' key={item.index} dangerouslySetInnerHTML={{ __html: item.text }}></div>
            }
            )}
            </div>
        </div>
  )
}
export default CheckingResult
