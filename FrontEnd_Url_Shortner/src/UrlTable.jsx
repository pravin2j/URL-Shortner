import React, { useContext } from 'react'
import ContextApi from './ContextApi';

const UrlTable = () => {
  const {urls} = useContext(ContextApi);
  return (
    <div className="w-[80%] self-center flex justify-center text-fontColor">
      <table className='table-fixed w-full mt-4 border-2 border-grayish'>
        <thead>
          <tr>
            <th className='p-2 w-[70%]' scope='col'>Long URL</th>
            <th className='p-2 w-[30%]' scope='col'>Short URL</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr className='odd:bg-grayish even:bg-backgroundMain' key={url.urlId}>
              <td className='p-2 whitespace-nowrap text-ellipsis truncate'>{url.inputUrl}</td>
              <td className='p-2'>{url.outputUrl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UrlTable