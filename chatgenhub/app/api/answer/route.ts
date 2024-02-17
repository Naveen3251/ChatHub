import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

//pinecone db
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone"

//next
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    
    try{
      //data body
      const question=await req.text();
  
      //fetch current user
      const user=await currentUser();
  
      //extracting all the things we need from body
      //const {Url}=body
  
      //check wether logged in
      if(!user || !user.id || !user.firstName){
          return new NextResponse("Unauthorized",{status:401});
      }
      console.log(question);
  
      //Vector store were we stored embedings
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex }
      );

      //retrive the store
      const retriever = vectorStore.asRetriever();

      //RAG
      const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

      const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });
      //stuff
      const ragChain = await createStuffDocumentsChain({
        llm,
        prompt,
        outputParser: new StringOutputParser(),
      });
      //retrive the fine tuned reply for the question
      const answer=await ragChain.invoke({
        context: await retriever.invoke(question),
        question: question
      });
      console.log(answer)
      return NextResponse.json(answer);
  
    }catch(error){
      console.log("[COMPANION_POST]",error);
      return new NextResponse("Internal Error",{status:500})
    }
  }