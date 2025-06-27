import React, { useContext, useState } from 'react'
import Usercontext, { userDataContext } from '../context/Usercontext'
import axios from 'axios';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function Customize2() {
    const navigate=useNavigate();
    const {userData,setUserData,backendImage,selectedImage,serverUrl}=useContext(userDataContext);
    const [assistantName,setAssistantName]=useState(userData?.AssistantName || "")
   
    const handleupdateAssistant = async () => {
     
  try {
    let formData = new FormData();
    formData.append("assistantName", assistantName);
    if (backendImage) {
      formData.append("assistantImage", backendImage);
    } else {
      formData.append("imageUrl", selectedImage);
    }

  

    const result = await axios.post(
      `${serverUrl}/api/userinfo/updateUser`,
      formData,
      {
        withCredentials: true,
      }
    );

    console.log(result.data);
    setUserData(result.data);
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] '>
      
      <IoMdArrowRoundBack onClick={()=>navigate("/customize")}  className='absolute cursor-pointer top-[30px] left-[30px] text-white w-[25px] h-[25px]' />
      <h1 className='text-white text-[30px] mb-[40px]'>Enter your <span className='text-blue-200'>Assistant Name</span></h1>
      <input
            type="text"
        
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            required
            className="w-full h-[50px] mb-4 px-4 rounded-lg bg-transparent
                       border border-gray-300 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter your Assistant Name"
          />

          
          {assistantName && <button className='min-w-[150px] h-[60px] mt-[30px] text-black front-semibold bg-white rounded-full text-[19px] cursor-pointer' onClick={()=>{
           navigate("/");
            handleupdateAssistant();
               
          
          }} >Create Assestant</button>}
          
    </div>
  )
}

export default Customize2
