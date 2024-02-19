import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req:Request){
    const genAI = new GoogleGenerativeAI("AIzaSyCRk03hn4aNJVrI_cCbbXzA0Q3wiYXSgwE");
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    try{
        //data body
        const body=await req.json();
  
        //fetch current user
        const user=await currentUser();
  
        //extracting all the things we need from body
        //const {Url}=body
  
        //check wether logged in
        if(!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorized",{status:401});
        }
         
        console.log(body);
        const pdfPath="C:/Users/91882/Downloads/NAVEEN_KUMAR_S.pdf";
        console.log(pdfPath)
        
        const loader = new PDFLoader(pdfPath);

        const docs = await loader.load();
        console.log(docs);

        // Process each Document object
        const processedDocuments = docs.map(document => {
            // Remove newline characters and additional characters
            const cleanedPageContent = document.pageContent
            .replace(/\n/g, ' ') // Replace newline characters with space
            .replace(/\s+/g, ' ') // Replace multiple consecutive spaces with a single space
            .trim(); // Remove leading and trailing spaces
             return cleanedPageContent;
        });
        console.log(processedDocuments)

        //validation
        const jd=body.jd;
        console.log(jd);
        const prompt=`
        Hey Act Like a skilled or very experience ATS(Application Tracking System)
        with a deep understanding of tech field,software engineering,data science ,data analyst
        and big data engineer. Your task is to evaluate the resume based on the given job description.
        You must consider the job market is very competitive and you should provide 
        best assistance for improving thr resumes. Assign the percentage Matching based 
        on Jd and
        the missing keywords with high accuracy
        resume:${processedDocuments}
        description:${jd}
        
        I want the response in one single string having the structure
        {{"JD Match":"%","MissingKeywords:[]","Profile Summary":""}}
        `
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log(text);

        return new NextResponse("Success",{status:200})
    }catch(error){
       
        return new NextResponse("Internal Error",{status:500})
    }
}
