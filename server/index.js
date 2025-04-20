import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { Queue } from 'bullmq';
import { fileURLToPath } from 'url';

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
   
    await queue.add("file-ready",JSON.stringify({
        filename:file.originalname,
        path:file.path,
        destination:file.destination
    }));
    console.log(req.file.originalname)
    return res.json({msg:"file uploaded"})
  })


app.listen(4000,()=>{
    console.log(`server running on port: http://localhost:${4000}`)
})