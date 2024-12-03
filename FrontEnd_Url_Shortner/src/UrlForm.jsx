import React, { useEffect, useState } from 'react'
import apiClient, { getAllUrls, postUrl } from './apiClient';
import UrlTable from './UrlTable';
import ContextApi from './ContextApi';
import toast, { Toaster } from 'react-hot-toast';
import { TbCopy, TbCopyCheck } from "react-icons/tb";

const UrlForm = () => {

  const [inUrl, setInUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [outputUrl, setOutputUrl] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const urlRegEx = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/

  const handleChange = (e) => {
    setInUrl(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inUrl != "" && urlRegEx.test(inUrl)) {
      setIsCopied(false)
      const requestBody = {
        inputUrl: inUrl,
      };

      postUrl(requestBody)
        .then((response) => {
          setOutputUrl(response.data.data.outputUrl)
          fetchUrls();
          setIsVisible(true)
          toast.success("Shortened!")
        })
        .catch((error) => {
          console.error(error);
        })
      setInUrl("")
    } else {
      toast.error("Invalid URL! Please try again.")
    }
  }

  const fetchUrls = () => {
    getAllUrls()
      .then((response) => {
        setUrls(response.data.data)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUrls()
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputUrl)
      .then((res) => {
        setIsCopied(true);
        toast.success("Copied!")
      })
  }

  return (
    <ContextApi.Provider value={{ urls }}>
      <Toaster position='bottom-right' />
      <div className='text-center flex flex-col justify-center'>
        <form onSubmit={handleSubmit} className='mt-4'>
          <div className='form-group w-full'>
            <label htmlFor="inUrl">
              <h2 className='m-2 text-xl font-bold'>Enter A URL</h2>
            </label>
            <input
              type="text"
              className='w-[40%] m-2 p-3 rounded-md bg-gray-200 text-center'
              id='inUrl'
              value={inUrl}
              onChange={handleChange}
              placeholder='Enter A URL'
            />
            <br />
            <button
              type='submit'
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
              className='focus:outline-none bg-transparent border-none px-5 py-3'
            />
          )}
          {isVisible && (
            <button className='bg-gray-300 px-3 rounded-r-md' onClick={handleCopy}>
              {isCopied ? <TbCopyCheck size={25} /> : <TbCopy size={25} />}
            </button>
          )}
        </div>
        <div><p>Note: SHORTENED LINKS EXPIRE AFTER 30 DAYS!</p></div>

        <UrlTable />
      </div>
    </ContextApi.Provider>

  )
}

export default UrlForm