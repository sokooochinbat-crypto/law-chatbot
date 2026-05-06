from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA


# -----------------------------
# 1. VECTOR DB ҮҮСГЭХ
# -----------------------------
def create_vector_db():
    print("🔵 Loading PDF...")

    loader = PyPDFLoader("app/data/Монгол улсын үндсэн хууль pdf text.pdf")
    documents = loader.load()

    print("🟢 PDF loaded:", len(documents))

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    docs = splitter.split_documents(documents)
    print("🟢 Split docs:", len(docs))

    embeddings = OpenAIEmbeddings()

    db = FAISS.from_documents(docs, embeddings)
    db.save_local("faiss_index")

    print("✅ Vector DB амжилттай үүсгэлээ!")


# -----------------------------
# 2. VECTOR DB АЧААЛАХ
# -----------------------------
def load_vector_db():
    print("🔵 Loading FAISS index...")

    embeddings = OpenAIEmbeddings()

    db = FAISS.load_local(
        "faiss_index",
        embeddings,
        allow_dangerous_deserialization=True
    )

    print("🟢 DB loaded")
    return db


# -----------------------------
# 3. АСУУЛТ АСУУХ
# -----------------------------
def ask_question(question: str):
    try:
        print("🟡 QUESTION:", question)

        db = load_vector_db()

        qa = RetrievalQA.from_chain_type(
            llm=ChatOpenAI(temperature=0),
            chain_type="stuff",
            retriever=db.as_retriever(search_kwargs={"k": 3}),
            return_source_documents=True
        )

        print("🔵 Running QA...")
        result = qa.invoke({"query": question})

        print("🟢 RESULT:", result)

        print("------ SOURCE DOCUMENTS ------")
        for doc in result["source_documents"]:
            print(doc.page_content[:200])
            print("------")

        # result key шалгах
        if "result" in result:
            return result["result"]
        elif "answer" in result:
            return result["answer"]
        else:
            return "Хариу олдсонгүй"

    except Exception as e:
        print("🔴 ERROR:", str(e))
        return f"Алдаа гарлаа: {str(e)}"