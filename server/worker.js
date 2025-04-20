
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Worker } from 'bullmq';
import path from 'path';
import { CharacterTextSplitter } from "@langchain/textsplitters";


const textSplitter = new CharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 0,
  });

const worker = new Worker("file-queue", async (job) => {
    // console.log("Received job:", job); 
    const filedata = JSON.parse(job.data)
    try {
       const normalisedpath=path.normalize(filedata.path)
       const loader=new PDFLoader(normalisedpath)
       const pdf=await loader.load()
    //    console.log(pdf)
      
      const texts = await textSplitter.splitText(pdf[0].document);
      console.log(texts)


    } catch (err) {
        console.error("Error loading PDF:", err);
        throw err;  
    }
    
}, {
    connection: {
        host: 'localhost',
        port: 6379
    }
});

