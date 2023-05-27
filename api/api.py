from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from audio_manager import AbstractAudioManager
import uvicorn
import time


origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:80",
    "http://audio.aiko.lol:80",
    "http://audio.aiko.lol:8080",
    "http://audio.aiko.lol"
]




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


class AudioAPI:
    def __init__(self, audioManager:AbstractAudioManager, host:str="localhost", port:int=3456) -> None:
        self.app = FastAPI()
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["POST", "GET"],
            allow_headers=["*"],
        )

        self.audioManager = audioManager
        self.host = host
        self.port = port

        self.create_routes()

    def run(self):
        MAX_TRIES = -1
        THREADS = 4
        while True:
            try:
                uvicorn.run(self.app, host=self.host, port=self.port, workers=THREADS)
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(e)
                MAX_TRIES -= 1
                if MAX_TRIES == 0:
                    raise e
                print("Retrying in 5 seconds...")
                time.sleep(5)
                continue
            break
        print("Shutting down...")
        self.audioManager._save()


                    

    def create_routes(self):
        # Routes
        @self.app.get("/")
        async def root():
            return {"message": "Hello World"}

        # login with username and password
        @self.app.post("/login/")
        async def login(login_request: LoginRequest):
            return {"username": login_request.username, "password": login_request.password}

        # logout with session id
        @self.app.post("/logout/")
        async def logout(auth_request: AuthRequest):
            return {"session_id": auth_request.session_id}

        # register with username, password and email
        @self.app.post("/register/")
        async def register(register_request: RegisterRequest):
            return {"username": register_request.username, "password": register_request.password, "email": register_request.email}

        # get user info with session id
        @self.app.get("/user/")
        async def user(auth_request: AuthRequest):
            return {"session_id": auth_request.session_id}

        # get user library with session id
        @self.app.get("/library/")
        async def library(auth_request: AuthRequest):
            return {"session_id": auth_request.session_id}

        # get store library
        @self.app.get("/store/")
        async def store():
            return {"store": "store"}

        # buy item with session id and item id
        @self.app.post("/buy/")
        async def buy(buy_request: BuyRequest):
            return {"session_id": buy_request.session_id, "item_id": buy_request.item_id}


