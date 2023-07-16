import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import Routes from './route'
import Header from './components/Header'
import AuthProvider from './components/Auth/authProvider'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <Header></Header>
    <div className='proofread-body'>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </div>
    {/* <Bottom></Bottom> */}
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
