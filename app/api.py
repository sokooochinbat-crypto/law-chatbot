from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.rag import ask_question

# ✅ 1. app эхлээд үүснэ
app = FastAPI()

# ✅ 2. CORS дараа нь
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 3. schema
class QuestionRequest(BaseModel):
    question: str

# ✅ 4. route хамгийн сүүлд
@app.post("/ask")
def ask(req: QuestionRequest):
    answer = ask_question(req.question)
    return {"answer": answer}
from fastapi import UploadFile, File

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()

    # text болгож хөрвүүлэх
    text = content.decode("utf-8", errors="ignore")

    # AI руу явуулах
    answer = ask_question(text)

    return {"answer": answer}