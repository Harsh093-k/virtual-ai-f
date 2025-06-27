import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const userDataContext = createContext();

function Usercontext({ children }) {
  const serverUrl = "https://virtual-ai.onrender.com";
  const [userData, setUserData] = useState(null);
    const [frontendImage,setFrontendImage]=useState(null);
    const [backendImage,setBackendImage]=useState(null);
    const [selectedImage,setSelectedImage]=useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/userinfo/getuser`, 
        { withCredentials: true }
      );
      setUserData(result.data.user);
      
    } catch (error) {
      console.log(error);
    }
  };
  const getGeminiResponse=async(command)=>{
    try{
       const result = await axios.post(
        `${serverUrl}/api/userinfo/ask`, {command},
        { withCredentials: true }
     
      );
         return result.data
    }catch(error){
       toast.error(error);
    }
  }
  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = { getGeminiResponse,selectedImage,setSelectedImage,backendImage,setBackendImage,frontendImage,setFrontendImage,serverUrl, userData, setUserData };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default Usercontext;

