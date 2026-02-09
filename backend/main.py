from fastapi import FastAPI
from routes import auth, data, governance

app = FastAPI(title="DataCommons API")

app.include_router(auth.router, prefix="/auth")
app.include_router(data.router, prefix="/data")
app.include_router(governance.router, prefix="/governance")

@app.get("/")
def root():
    return {"message": "DataCommons Cooperative API"}
