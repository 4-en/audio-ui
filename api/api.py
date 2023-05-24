from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:80",
    "http://audio.aiko.lol:80",
    "http://audio.aiko.lol:8080",
    "http://audio.aiko.lol"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str

class AuthRequest(BaseModel):
    session_id: str

class BuyRequest(BaseModel):
    session_id: str
    item_id: int



# Routes
@app.get("/")
async def root():
    return {"message": "Hello World"}

# login with username and password
@app.post("/login/")
async def login(login_request: LoginRequest):
    return {"username": login_request.username, "password": login_request.password}

# logout with session id
@app.post("/logout/")
async def logout(auth_request: AuthRequest):
    return {"session_id": auth_request.session_id}

# register with username, password and email
@app.post("/register/")
async def register(register_request: RegisterRequest):
    return {"username": register_request.username, "password": register_request.password, "email": register_request.email}

# get user info with session id
@app.get("/user/")
async def user(auth_request: AuthRequest):
    return {"session_id": auth_request.session_id}

# get user library with session id
@app.get("/library/")
async def library(auth_request: AuthRequest):
    return {"session_id": auth_request.session_id}

# get store library
@app.get("/store/")
async def store():
    return {"store": "store"}

# buy item with session id and item id
@app.post("/buy/")
async def buy(buy_request: BuyRequest):
    return {"session_id": buy_request.session_id, "item_id": buy_request.item_id}

