# backend/app.py
from flask import Flask, request, jsonify, Response
import requests
from flask_cors import CORS
import logging
#environment
from dotenv import load_dotenv

#langchain
#for scraping the website
from langchain_community.document_loaders import WebBaseLoader
#for spliting docs into difrent chunks
from langchain.text_splitter import RecursiveCharacterTextSplitter
#for storing vectors
from langchain_community.vectorstores import Chroma
#embedings model
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
#prompting
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
#retrieving 
from langchain.chains import create_history_aware_retriever,create_retrieval_chain
#documents
from langchain.chains.combine_documents import create_stuff_documents_chain

load_dotenv()

app = Flask(__name__)
CORS(app,origins="http://localhost:3000", supports_credentials=True)  # Enable CORS for all routes


def get_vectorstore_from_url(url):
    #scraping
    loader=WebBaseLoader(url)
    #take the documents
    document=loader.load()
    #debug
    print(document)
    #split the docmunents into diffrent chunks of text
    text_splitter=RecursiveCharacterTextSplitter()
    document_chunks=text_splitter.split_documents(document)
    print('##############')
    print(document_chunks)
    #create vector store
    #vector_store=Chroma.from_documents(document_chunks,OpenAIEmbeddings())
    #logging.info("Finised vector")
    return ''

def get_context_retriever_chain(vector_store):
     #context retriever chain
    llm=ChatOpenAI()
    retriever=vector_store.as_retriever()

    user_prompt=ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="chat_history"),
        ("user","{input}"),
        ("user", "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation")
    ])

    retriever_chain=create_history_aware_retriever(llm,retriever,user_prompt)
    return retriever_chain
    
def get_conversational_rag_chain(retriever_chain):
    llm = ChatOpenAI()
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Answer the user's questions based on the below context:\n\n{context}"),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
    ])
    
    stuff_documents_chain = create_stuff_documents_chain(llm,prompt)
    
    return create_retrieval_chain(retriever_chain, stuff_documents_chain)
     
def get_response(vector_store,user_input):
    retriever_chain = get_context_retriever_chain(vector_store)
    conversation_rag_chain = get_conversational_rag_chain(retriever_chain)
    
    response = conversation_rag_chain.invoke({
        "chat_history": st.session_state.chat_history,
        "input": user_input
    })
    
    return response['answer']


#flask API
@app.route('/scrape', methods=['POST'])
def scrape():
    try:
        url = request.json.get('url')
        vector_store=get_vectorstore_from_url(url)
        logging.info("Scraping successful.")
        return jsonify({'success': "Stored in chromadb"}),200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/chatting', methods=['POST'])
def chatting(user_input):
        response=get_response(user_input)
        # Combine the contents of all documents into a single string
        #response_content = '\n'.join(doc.page_content for doc in document)

        # Create a Flask Response with the combined content
        response = Response(response, content_type='text/plain')

        return response
    

if __name__ == '__main__':
    app.run(debug=True)
