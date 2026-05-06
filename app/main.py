from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

app = FastAPI()

client = OpenAI(api_key="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")  # ← ЭНД KEY

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_history = []

class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(req: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Чи Монголын хуульч чатбот."},
                {"role": "user", "content": req.message}
            ]
        )

        answer = response.choices[0].message.content

        chat_history.append({
            "question": req.message,
            "answer": answer
        })

        return {"reply": answer}

    except Exception as e:
        return {"reply": f"Алдаа: {str(e)}"}


@app.get("/history")
def history():
    return {"history": chat_history}
    from app.rag import create_vector_db
