"use client"
//shadcn ui
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react";
import { number } from "zod";
import axios from "axios";
import { useState } from "react";
interface GeneratedScript {
    video_title: string;
    video_description: string;
    scripts: {
        part1: {
            text: string;
            image: string;
        };
        part2: {
            text: string;
            image: string;
        };
        part3: {
            text: string;
            image: string;
        };
        part4: {
            text: string;
            image: string;
        };
        part5: {
            text: string;
            image: string;
        };
    };
}
interface ScriptParts {
    [key: string]: {
        text: string;
        image: string;
    };
}

export const ScriptDisplay=({video_title,video_description,scripts}:GeneratedScript)=>{
    const [audioSrc, setAudioSrc] = useState<string | null>(null); // State to store the audio source
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    console.log(video_title)
    console.log(video_description)
    const script_parts: string[] = [];
    const image_prompts: string[] = [];
    const script:ScriptParts=scripts;
    for (let i = 1; i<=5; i++) {
        const part = `part${i}`;
        script_parts.push(script[part].text);
        image_prompts.push(script[part].image);
    }
    console.log(script_parts)
    console.log(image_prompts)
    const script_para:string=script_parts.join('. ')
    const image_prompt_para:string=image_prompts.join('. ')
    console.log(script_para)

    //1. script generate API cal
    const scriptGenerate=async()=>{
        const audio_src=await axios.post('/api/voice-generate/',script_para);
        console.log(audio_src.data);
        setAudioSrc(audio_src.data)
    }
    //2. Video generate API call
    const videoGenerate=async()=>{
        const video_src=await axios.post('http://localhost:5000/videogenerate',{
            audioSrc: audioSrc,
            scriptPara: script_para,
            imagePromptArray:image_prompts,
            imagePromptPara: image_prompt_para
        })
        console.log(video_src.data)
        setVideoSrc(video_src.data)
        console.log(videoSrc)
        console.log(videoSrc)
    }

    return(
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{video_title}</CardTitle>   
                </CardHeader>
                <CardContent>
                    {video_description}
                </CardContent>
                <CardContent className="grid gap-4">
                    <div>
                        {Object.keys(scripts).map((key, index) => (
                        <div
                                key={index}
                                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                        >
                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {(scripts as any)[key].text}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {(scripts as any)[key].image}
                                </p>
                            </div>
                        </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter> 
                    <Button onClick={()=>scriptGenerate()}className='w-full' size="lg">
                        Generate Audio
                        <Wand2 className="w-4 h-4 ml-2"/>
                    </Button>    
                </CardFooter>
                <CardFooter>
                    <div className="w-full flex justify-center items-center">
                        {audioSrc && <audio controls src={audioSrc} />}
                    </div>
                </CardFooter>
                <CardFooter>      
                    {audioSrc && 
                            <Button onClick={()=>videoGenerate()}className='w-full' size="lg">
                                Generate Video
                                <Wand2 className="w-4 h-4 ml-2"/>
                            </Button> 
                    }
                </CardFooter>
                <CardFooter>
                    {
                        videoSrc && <video controls src={videoSrc}/>
                    }
                </CardFooter>
               
        </Card>
        
        </div>
    )
}
