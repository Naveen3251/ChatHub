
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


import { Resemble } from '@resemble/node' // If you are using es modules
// const { Resemble } = require('@resemble/node') // If you are using commonjs
Resemble.setApiKey("rKX2cIQnQKvY1Q1FtWCWYQtt")

interface Response {
    items: any[]; 
}
interface WriteResponseV2<T> {
    item: T;
    
}
interface Clip {
    audio_src: string;
  
}

export async function POST(req:Request) {
    try{
        //data body
        const prompt:string=await req.text();
        console.log(prompt)

        //fetch current user
        const user=await currentUser();

         //check wether logged in
         if(!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorized",{status:401});
        }
        
        
        /*const response = await Resemble.v2.voices.all(1, 10);
        const project_uuid= (response as Response).items[0]['uuid'];
        const voice_uuid= (response as Response).items[1]['uuid'];

        const voice_clip = await Resemble.v2.clips.createSync(project_uuid ,{
            body: prompt,
            voice_uuid: voice_uuid,
            is_public: false,
            is_archived: false
        });
        console.log(voice_clip)
        const audio_src=(voice_clip as WriteResponseV2<Clip>).item.audio_src;*/
        const audio_src=`https://app.resemble.ai/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCRkhBbHcwPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--adfb833e29531e8d97d4db1f8275ff54e58006be/result.wav`
        console.log(audio_src)
        return new NextResponse(audio_src, { status: 200 });
    }catch(error){
        return new NextResponse("An error occured",{status:404});
    }
}