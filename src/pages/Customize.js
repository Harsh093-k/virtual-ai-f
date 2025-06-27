import React, { useContext, useRef,useState } from 'react'
import Card from '../components/Card.js';
import image1 from "../assests/images1.jpg";
import image from '../assests/images.jpg';
import image2 from "../assests/images2.jpg";
import image3 from "../assests/images3.jpeg";
import image4 from '../assests/images4.jpeg';
import download from "../assests/download.jpeg";
import { FaUpload } from "react-icons/fa";
import { userDataContext } from '../context/Usercontext.js';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

function Customize() {
  const Navigate=useNavigate()
const { selectedImage,setSelectedImage,backendImage,setBackendImage,frontendImage,setFrontendImage,serverUrl, userData, setUserData } =useContext(userDataContext)
  const inputImage=useRef(null);
  const handleImage=(e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  
  };
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] '>
       <IoMdArrowRoundBack onClick={()=>Navigate("/signup")}  className='absolute cursor-pointer top-[30px] left-[30px] text-white w-[25px] h-[25px]' />
      <h1 className='text-white text-[30px] mb-[40px]'>Select your <span className='text-blue-200'>Assistant Image</span></h1>
      <div className='w-full max-w-[900px]  flex justify-center items-center flex-wrap gap-[15px]'>
        <Card image={image1} />
           <Card image={image2} />
          <Card image={image} />
           <Card image={image3} />
         <Card image={image4} />
          <Card image={download} />
          
      <div
        className={`
          w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]
          bg-[#030326]
          border-2 border-blue-400/40
          rounded-2xl overflow-hidden
          hover:shadow-2xl hover:shadow-blue-950
          cursor-pointer hover:border-4 hover:border-white
          flex justify-center items-center
        ${selectedImage == "input"?' border-4 border-white shadow-2xl shadow-blue-950': null}`}
  onClick={() => {inputImage.current?.click()
    setSelectedImage("input")
  }}
      >{
        !frontendImage && 
      
        <FaUpload className="text-white w-[25px] h-[25px]" />
      }{
        frontendImage && <img src={frontendImage} className='h-full object-cover'/>
      }
      </div>
      <input
  type="file"
  accept="image/*"
  ref={inputImage}
  hidden
  onInput={handleImage}
/>

      </div>
      {selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] text-black front-semibold bg-white rounded-full text-[19px] cursor-pointer'onClick={()=> Navigate("/customizeS")} >Next</button>}
      
    </div>
  )
}

export default Customize
