import React from 'react'
import UrlForm from './UrlForm'
import "./index.css"
import ToggleButton from './ToggleButton'

const App = () => {

  const toggleTheme = () => {
    const html = document.querySelector('html');
    const currentTheme = html.getAttribute('data-theme');
    html.setAttribute(
      'data-theme',
      currentTheme === 'darktheme' ? 'lighttheme' : 'darktheme'
    );
  };
  

  return (
    <div className='w-full text-fontColor'>
      <div className='text-4xl w-full font-bold p-4 bg-bluish flex items-center justify-between'>
        <h1 className='flex-1 text-center'>URL Shortner</h1>
        <ToggleButton onClick = {toggleTheme} className=""/>
      </div>
      <UrlForm />
    </div>
  )
}

export default App