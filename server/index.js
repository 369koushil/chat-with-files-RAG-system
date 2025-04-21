import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { Queue } from 'bullmq';
import { fileURLToPath } from 'url';
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI  } from "@langchain/google-genai";
import { ChatPromptTemplate } from '@langchain/core/prompts';

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "models/gemini-1.5-pro-002",
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queue = new Queue("file-queue",
    {
        connection:{
            host:'localhost',
            port:6379
        }
    }
    
);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
      },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  const app=express()
  app.use(express.json())
  app.use(cors())

  app.get("/",(req,res)=>{
    return res.json({msg:"hello world"})
  })

  app.post("/uploadfile",upload.single('file'),async(req,res)=>{
    
    const file=req.file
   console.log(JSON.stringify(file))
    await queue.add("file-ready",JSON.stringify({
        filename:file.originalname,
        path:file.path,
        destination:file.destination
    }));
    console.log(req.file.originalname)
    return res.json({msg:"file uploaded"})
  })



  app.get("/query",async(req,res)=>{
      const query=decodeURIComponent(req.query.message)
      console.log(query,"----------------------------------------------------")
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
      });
      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-testing",
      });


      const retriever = vectorStore.asRetriever({
        k: 3,
      });
      const ans=await retriever.invoke(query);
      const context = ans.map(doc => doc.pageContent).join("\n");
      
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are an AI assistant that answers questions based on the context below.\n\nContext:\n${context}`],
        ["user", query]
      ]);

      const chain = prompt.pipe(llm);
      const result = await chain.invoke({
        input_language: "English",
        output_language: "English",
        input: query,
      });

      console.log(result.content)
      return res.json(result)
  })

app.listen(4000,()=>{
    console.log(`server running on port: http://localhost:${4000}`)
})