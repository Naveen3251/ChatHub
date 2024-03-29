"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import axios from "axios";

export const InputWithButton=()=>{
  //routing 
  const router = useRouter();
  const [Url,setUrl]=useState('');
  const [scrapeSuccess, setScrapeSuccess] = useState(false);
 
  //url validation
  const isValidURL=(url:string):boolean=>{
    const regex = /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return regex.test(url);
  }
  
  //handle submit function
  const handleSubmitUrl=async()=>{
    if(Url.length>0){
        const validUrl:boolean=isValidURL(Url);
        console.log(validUrl)
        if(validUrl){
            try {
                //scraping the data using beatufullsoup at the backend use of python
                //flask end point
                await axios.post(`/api/vector/`,Url)
                console.log("Done!");
                setScrapeSuccess(true);
              
              } 
              catch (error) {
                console.error('Error:', error);
              }
            
               
        }
    }
  }
  // go to next route
  const handleChattingRoute=()=>{
    router.push("/chatform")
    //await axios.post(`/api/answer/`,"Give code for React Click event handling")
    
  }


  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      {!scrapeSuccess && (
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            onChange={(e) => setUrl(e.target.value)}
            value={Url}
            placeholder="WebSite URL"
          />
          <Button onClick={() => handleSubmitUrl()}>Generate</Button>
        </div>
      )}

      {scrapeSuccess && (
        <div>
          <p>Scrape Successful!</p>
          <Button onClick={() => handleChattingRoute()}>Let's Go</Button>
        </div>
      )}
      <div>
          <p>Scrape Successful!</p>
          <Button onClick={() => handleChattingRoute()}>Let's Go</Button>
      </div>
      
     

       
      
    </div>
  )
}