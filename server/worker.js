import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Worker } from 'bullmq';
import path from 'path';
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";


const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey:process.env.GOOGLE_API_KEY,
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: "http://localhost:6333",
  collectionName: "langchainjs-testing",
});

const worker = new Worker("file-queue", async (job) => {
  const filedata = JSON.parse(job.data);

  try {
    const normalizedPath = path.normalize(filedata.path);
    const loader = new PDFLoader(normalizedPath);

    const documents = await loader.load();

    const allDocs = documents.map(doc => new Document({
      pageContent: doc.pageContent,
      metadata: doc.metadata
    }));

    await vectorStore.addDocuments(allDocs);

    console.log("Embeddings successfully stored in Qdrant.");
  } catch (err) {
    console.error("Error loading PDF or storing embeddings:", err);
    throw err;
  }
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});
