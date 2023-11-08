from datetime import datetime
from typing import TypedDict

from fastapi import FastAPI, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import RedirectResponse

from services.database import JSONDatabase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database when starting API server."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []


@app.on_event("shutdown")
def on_shutdown() -> None:
    """Close database when stopping API server."""
    database.close()
    

@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> JSONResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now().replace(microsecond=0)

    quote = Quote(name=name, message=message, time=now.isoformat())
    database["quotes"].insert(0, quote) #only changed so new quotes will be on top for users

    return JSONResponse(content=quote, status_code=status.HTTP_201_CREATED)

@app.get("/quote")
async def get_quotes(skip: int = 0, limit: int = 10):
    """
    Retrieve all quotes from the database with pagination.
    """
    return database["quotes"][skip : skip + limit]

# TODO: add another API route with a query parameter to retrieve quotes based on max age
