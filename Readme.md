
# 🧠 RAG System: Chat with PDF

A minimal Retrieval-Augmented Generation (RAG) system that allows users to chat with PDF documents. This project uses a combination of modern tools like **Next.js**, **Express.js**, **Langchain**, **QdrantDB**, **BullMQ**, and **Gemini Pro** to provide fast and intelligent AI responses based on your uploaded documents.

---

## 🚀 Features

- Upload PDF files and interact with them in a chat format.
- Documents are split into embeddings using **Langchain**.
- Embeddings are stored and searched from **QdrantDB**.
- Queue-based file processing using **BullMQ** (powered by **Valkey**).
- Relevant document chunks are sent to **Gemini Pro** LLM for context-based answers.
- Local development with Docker Compose for **QdrantDB** and **Valkey**.
- The UI interface is minimal still need to improve

---

## 🧱 Tech Stack

| Layer     | Tech                |
|-----------|---------------------|
| Frontend  | Next.js             |
| Backend   | Express.js          |
| Embedding | Langchain           |
| Vector DB | QdrantDB            |
| Queue     | BullMQ + Valkey     |
| LLM       | Gemini Pro          |
| Infra     | Docker, Docker Compose |

---

## 📂 Project Structure

```


├── client/              # Next.js frontend
|   └── app
│       └── page.tsx
|       └── layout.tsx
│       └── components/
|       └── middleware.tsx
│       └── ...
│
├── server/               # Express backend
│   ├── index.js          # Main API and logic
│   ├── worker.js         # BullMQ worker for processing files
|   ├──docker-compose.yml # Spins up QdrantDB and Valkey    
│
└── README.md
```

---

## 🏁 Getting Started

### 🐳 Run QdrantDB & Valkey Locally

In the project root:

```bash
docker-compose up
```

This will start:
- QdrantDB on `http://localhost:6333`
- Valkey (Redis-compatible) on default port `6379`

---

### ⚙️ Start the Server (Express)

Navigate to the `server/` directory:

```bash
cd server
npm install
```

- Start the main Express server:
  ```bash
  npm run dev
  ```
  The main backend will be available at `http://localhost:4000`

- Start the BullMQ worker:
  ```bash
  npm run dev:worker
  ```

---

### 🧑‍💻 Start the Client (Next.js)

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 📈 Future Improvements

- ✅ Add support for `.csv`, `.doc`, and image files.
- ✅ Improve and polish the chat UI.
- ✅ Persist user chat history in a database.
- ✅ Add user authentication for personalized sessions.

---

## 📬 Feedback & Contribution

Have an new improvements or architecture to scale this up feel free to open issue

---
