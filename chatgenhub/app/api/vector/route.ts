//langchain
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

//pinecone db
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone"

//import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(req:Request){
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!)
  try{
      //data body
      const body=await req.text();

      //fetch current user
      const user=await currentUser();

      //extracting all the things we need from body
      //const {Url}=body

      //check wether logged in
      if(!user || !user.id || !user.firstName){
          return new NextResponse("Unauthorized",{status:401});
      }
       
      console.log(body);
      //step 1: Scrape the data
      const loader = new PuppeteerWebBaseLoader(body)
      const docs = await loader.load();
      console.log(docs)
      
      

     
      // STEP 2: Split the data into chunks
      const textSplitter = new RecursiveCharacterTextSplitter();
      const doc_chunks=await textSplitter.splitDocuments(docs);
      console.log(doc_chunks)

      // STEP 3: Generate embeddings from documents
      await PineconeStore.fromDocuments(doc_chunks, new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }), {
        pineconeIndex,
        maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      });
      
      console.log("hi")
      
    return NextResponse.json('');


  }catch(error){
      console.log("[COMPANION_POST]",error);
      return new NextResponse("Internal Error",{status:500})
  }
}
