import React, { useEffect, useState } from 'react'
import { createCustomUrl, createUrl, getAllUrls } from './apiClient';
import UrlTable from './UrlTable';
import toast, { Toaster } from 'react-hot-toast';
import { TbCopy, TbCopyCheck } from "react-icons/tb";
import ContextApi from './ContextApi';
const UrlForm = () => {

  const [urlObj, setUrlObj] = useState({
    inputUrl: "",
    outputUrl: "",
    expirationDateTime: "",
  })
  const { inputUrl, outputUrl, expirationDateTime } = urlObj
  const [urls, setUrls] = useState([]);
  const [isCustom, setIsCustom] = useState(false)
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const urlRegEx = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/

  const handleChange = (e) => {
    let { name, value } = e.target
    setUrlObj((prev) => ({ ...prev, [name]: value, }))
    // console.log(urlObj);

  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputUrl != "" && urlRegEx.test(inputUrl)) {
      setIsCopied(false)

      if (!isCustom) {
        console.log(urlObj);

        createUrl(urlObj)
          .then((response) => {
            setUrlObj({ ...urlObj, outputUrl: response.data.data.outputUrl })
            fetchUrls()
            setIsVisible(true)
            toast.success("Shortened!")
          })
          .catch((error) => {
            console.error(error);
          })
      } else {
        if (urlObj.expirationDateTime !== "") {
          urlObj.expirationDateTime = urlObj.expirationDateTime + "T00:00:00";
        }

        console.log(urlObj)
        createCustomUrl(urlObj)
          .then((response) => {
            fetchUrls()
            toast.success("Shortened!")
            setIsCustom(false)
          })
          .catch((error) => {
            console.error(error)
          })
      }
      setUrlObj({
        ...urlObj,
        inputUrl: "",
        expirationDateTime: "",
      })
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

  const handleCustom = (e) => {
    e.preventDefault()
    setIsCustom(!isCustom)
  }


  return (
    <ContextApi.Provider value={{ urls }}>
      <Toaster position='bottom-right' />
      <div className='text-center flex flex-col justify-center text-fontColor'>
        <form onSubmit={handleSubmit} className='mt-4'>
          <div className='form-group w-full'>
            <label htmlFor="inputUrl">
              <h2 className='m-2 text-xl font-bold'>Enter A URL</h2>
            </label>
            <input
              type="text"
              className='w-[40%] m-2 p-3 rounded-md bg-grayish text-center'
              id='inputUrl'
              name='inputUrl'
              value={urlObj.inputUrl}
              onChange={handleChange}
              placeholder='Enter A URL'
            />
            <button type='' onClick={handleCustom}
              className='mx-4 p-3 bg-bluish rounded-md '
            >Custom</button>
            {
              isCustom && (
                <div>
                  <label htmlFor='customShorten' className='text-xl font-bold'>Shortened URL</label>
                  <input type="text"
                    id='customShorten'
                    name='outputUrl'
                    value={urlObj.outputUrl}
                    onChange={handleChange}
                    className='w-[30%] m-2 p-3 rounded-md bg-grayish text-center'
                    placeholder='Enter Shortened URL (MAX. 12 Characters)'
                    maxLength={12}
                  />
                  <br />
                  <label htmlFor="customExpire" className='text-xl font-bold'>Expiration Date</label>
                  <input type="date"
                    id='customExpire'
                    name='expirationDateTime'
                    value={urlObj.expirationDateTime}
                    onChange={handleChange}
                    className='w-[30%] m-2 p-3 bg-grayish text-center'
                    min={new Date(new Date().setDate(new Date().getDate() + 1))
                      .toISOString()
                      .split("T")[0]}
                  />
                </div>
              )
            }
            <br />
            <button
              type='submit'
              className='mx-4 p-3 bg-bluish rounded-md'>
              Generate
            </button>
          </div>
        </form>
        <div className="m-4 w-[30%] bg-grayish rounded-md self-center flex flex-row justify-between">
          {isVisible && (
            <input
              type="text"
              readOnly
              value={outputUrl}
              className='focus:outline-none bg-transparent border-none px-5 py-3'
            />
          )}
          {isVisible && (
            <button className='bg-bluish px-3 rounded-r-md' onClick={handleCopy}>
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