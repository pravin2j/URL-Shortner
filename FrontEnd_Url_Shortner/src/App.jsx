import React from 'react'
import UrlForm from './UrlForm'
import "./index.css"
const App = () => {
  return (
    <div className='w-full'>
      <h1 className='text-4xl w-full font-bold text-center p-4 bg-blue-200'>URL Shortner</h1>
      <UrlForm/>
    </div>
  )
}

export default App