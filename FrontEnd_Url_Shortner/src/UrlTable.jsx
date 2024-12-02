import React, { useContext } from 'react'
import ContextApi from './ContextApi'

const UrlTable = (props) => {
    let {urls} = useContext(ContextApi)
  return (
    <div className="w-[80%] self-center flex justify-center">
        <table className='table-fixed w-full mt-4 border-2'>
          <thead>
            <tr>
              <th className='p-2 w-[70%]' scope='col'>Long URL</th>
              <th className='p-2 w-[30%]' scope='col'>Short URL</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr className='odd:bg-gray-200 even:bg-white' key={url.urlId}>
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