import React, { useEffect, useState } from 'react'
import apiClient from './apiClient';

const UrlForm = () => {

  const [inUrl, setInUrl] = useState("");
  const [urls, SetUrls] = useState([]);
  const [outputUrl, setOutputUrl] = useState("");
  const [isVisible, setIsVisible] = useState(false);


  const handleChange = (e) => {
    setInUrl(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
      inUrl: inUrl,
    };

    apiClient
      .post("/createUrl", requestBody)
      .then((response) => {
        console.log(response.data);
        setOutputUrl(response.data);
        fetchUrls();
      })
      .catch((error) => {
        console.error(error);
      })
    setInUrl("")
  }

  const fetchUrls = () => {
    apiClient
      .get("/getAllUrl")
      .then((response) => {
        SetUrls(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUrls();
  }, [urls])

  const handleCopy = () => {
    navigator.clipboard.writeText(outputUrl)
  }


  return (
    <div className='text-center flex flex-col justify-center'>
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className='form-group w-full'>
          <label htmlFor="inUrl">
            <h2 className='m-2 text-xl font-bold'>Enter A URL</h2>
          </label>
          <input
            type="text"
            className='form-control w-[40%] m-2 p-3 rounded-md bg-gray-200 text-center'
            id='inUrl'
            value={inUrl}
            onChange={handleChange}
            placeholder='Enter A URL'
          />
          <br />
          <button
            type='submit'
            onClick={() => { setIsVisible(true) }}
            className='mx-4 p-3 bg-blue-200 rounded-md'
          >
            Generate
          </button>
        </div>
      </form>
      <div className="m-4 w-[30%] bg-gray-100 rounded-md self-center flex flex-row justify-between">
        {isVisible && (
          <input
            type="text"
            readOnly
            value={outputUrl}
            className='bg-transparent border-none px-5 py-3'
          />
        )}
        {isVisible && (
          <button className='bg-gray-300 px-3 rounded-r-md' onClick={handleCopy}>Copy</button>
        )}
      </div>
      <div><p>Note: SHORTENED LINKS EXPIRE AFTER 30 DAYS!</p></div>
      {/* Table container with adjusted width */}
      <div className="w-[80%] self-center flex justify-center">
        <table className='table w-[80%] mt-4 border-2'>
          <thead>
            <tr>
              <th className='p-2' scope='col'>Long URL</th>
              <th className='p-2' scope='col'>Short URL</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr className='odd:bg-gray-200 even:bg-white' key={url.urlId}>
                <td className='p-2 w-5/6 max-w-[1000px] overflow-x-auto truncate'>{url.inputUrl}</td>
                <td className='p-2'>{url.outputUrl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default UrlForm