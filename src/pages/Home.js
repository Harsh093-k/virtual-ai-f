import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { userDataContext } from '../context/Usercontext';
import axios from 'axios';
import Toast, { toast } from 'react-hot-toast';

function Home() {
  const [cookies, setCookie] = useCookies(['token']);
  const navigate = useNavigate();
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext);

  
  const speak = (text) => {
    return new Promise((resolve) => {
      if (!synth) {
        console.error('Speech synthesis not supported');
        return resolve();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        isSpeakingRef.current = false;
        resolve();
      };
      utterance.onerror = (e) => {
        console.error('Speech error:', e);
        isSpeakingRef.current = false;
        resolve();
      };

      isSpeakingRef.current = true;
      synth.speak(utterance);
    });
  };

  // Reliable URL opening function
  const openUrl = async (url) => {
    try {
      // Method 1: Create and click an anchor tag
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => {
        if (!window.focus) {
         window.open(url, '_blank');
         
        }
      }, 100);
    } catch (e) {
      console.error('Error opening URL:', e);
      await speak(`Please visit ${url} manually`);
    }
  };

  const handleCommand = async (data) => {
  const { type, userInput, response } = data;
  

  if (response) {
    await speak(response);
  }

  const commandHandlers = {
    "google-search": () => openUrl(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`),
    "calculator-open": () => openUrl('https://www.google.com/search?q=calculator'),
    "instagram-open": () => openUrl('https://www.instagram.com'),
    "facebook-open": () => openUrl('https://www.facebook.com'),
    "weather-show": () => openUrl('https://www.google.com/search?q=weather'),
    "youtube-search": () => openUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`),
    "ms-excel-open": () => {
  
    try {
      window.location.href = "ms-excel:";
      setTimeout(() => {
        openUrl("https://office.live.com/start/Excel.aspx");
      }, 1000);
    } catch (e) {
      openUrl("https://office.live.com/start/Excel.aspx");
    }
  },
  "ms-powerpoint-open": () => {
  try {
    window.location.href = "ms-powerpoint:ofe|u|https://www.microsoft.com";
    setTimeout(() => {
      window.location.href = "powerpoint://";
      setTimeout(() => {
        openUrl("https://office.live.com/start/PowerPoint.aspx");
      }, 1000);
    }, 1000);
  } catch (e) {
    openUrl("https://office.live.com/start/PowerPoint.aspx");
  }
},
  
 "ms-word-open": () => {
 
  try {
  
    window.location.href = "ms-word:ofe|u|https://www.microsoft.com";
    
 
    setTimeout(() => {
     
      window.location.href = "word://";
      
    
      setTimeout(() => {
       
        openUrl("https://office.live.com/start/Word.aspx");
      }, 1000);
    }, 1000);
  } catch (e) {
 
    openUrl("https://office.live.com/start/Word.aspx");
  }
},
  "whatsapp-open": () => {

    openUrl("https://web.whatsapp.com");
  },
    "youtube-play": async () => {
      try {
        
        const API_KEY = 'AIzaSyAJ92ORo7bQ_YqshAZ4CmYM427x1MGo-t0';
        
       
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=viewCount&q=${userInput}&type=video&key=${API_KEY}`;
        
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items?.length > 0) {
          const videoId = data.items[0].id.videoId;
          await openUrl(`https://www.youtube.com/watch?v=${videoId}&autoplay=1`);
        } else {
          await speak("No videos found. Showing search results instead.");
          await openUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`);
        }
      } catch (error) {
        console.error("YouTube playback failed:", error);
        await speak("Having trouble playing the video. Showing search results instead.");
        await openUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}&sp=EgIQAQ%3D%3D`);
      }
    }
  };

  try {
    if (commandHandlers[type]) {
      await commandHandlers[type]();
    } 
  } catch (error) {
    console.error(`Error executing command ${type}:`, error);
    await speak("Sorry, I encountered an error while processing your command.");
  }
};

  useEffect(() => {
 
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    const startRecognition = async () => {
      if (!isSpeakingRef.current) {
        try {
          await recognition.start();
          console.log("Recognition started");
        } catch (error) {

          setTimeout(startRecognition, 1000);
        }
      }
    };

    recognition.onresult = async (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.trim();
      toast.success( transcript);
      console.log(transcript);
      // More flexible name matching
      const assistantName = userData?.assistantName?.toLowerCase() || '';
      if (transcript.toLowerCase().includes(assistantName) || 
          (assistantName && transcript.toLowerCase().startsWith(assistantName.split(' ')[0]))) {
        try {
          const data = await getGeminiResponse(transcript);
          console.log("AI Response:", data);
          toast.success(data.response);
          await handleCommand(data);
          
        } catch (error) {
          console.error("AI error:", error);
          await speak("Sorry, I couldn't process that request.");
        }
      }
    };

    recognition.onerror = (event) => {
     consoel.log(even.error)
      if (event.error !== 'no-speech') {
        setTimeout(startRecognition, 1000);
      }
    };

    recognition.onend = () => {
      if (!isSpeakingRef.current) {
        startRecognition();
      }
    };

   
    const init = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        startRecognition();
      } catch (err) {
        console.error("Microphone access denied:", err);
        speak("Please enable microphone access to use voice commands.");
      }
    };

    init();

    return () => {
      recognition.stop();
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [userData?.assistantName, getGeminiResponse]);

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/user/logout`, {}, { withCredentials: true });
      
      setUserData(null);
      navigate("/signup");
    } catch (error) {
      console.error("Logout error:", error);
      setUserData(null);
      navigate("/signup");
    }
  };

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]'>
      <button 
        className="min-w-[150px] h-[60px] mt-[30px] absolute top-[20px] right-[20px] text-black font-semibold bg-white rounded-full text-[19px]" 
        onClick={handleLogout}
      >
        Log out
      </button>
      <button 
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full text-[19px] px-[20px] py-[10px]" 
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="Assistant" className='h-full object-cover'/>
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
    </div>    
  );
}

export default Home;

 
