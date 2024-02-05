# backend/app.py
from flask import Flask, request, jsonify, Response
from langchain_community.document_loaders import WebBaseLoader
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app,origins="http://localhost:3000", supports_credentials=True)  # Enable CORS for all routes

@app.route('/scrape', methods=['POST'])
def scrape():
    try:
        url = request.json.get('url')
        #scraping
        loader=WebBaseLoader(url)
        #take the documents
        documents=loader.load()
        print(documents)
        # Combine the contents of all documents into a single string
        response_content = '\n'.join(doc.page_content for doc in documents)

        # Create a Flask Response with the combined content
        response = Response(response_content, content_type='text/plain')

        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
