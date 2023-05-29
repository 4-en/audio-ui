from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
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

class StatusResponse(BaseModel):
    status: bool
    message: str

class UserResponse(BaseModel):
    user: dict

class LoginResponse(BaseModel):
    session_id: str
    user: dict

class ItemResponse(BaseModel):
    item: dict

class ItemListResponse(BaseModel):
    items: list


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
        while True:
            try:
                uvicorn.run(self.app, host=self.host, port=self.port)
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
            return StatusResponse(status=True, message="Audio API is running")

        # login with username and password
        @self.app.post("/login/")
        async def login(login_request: LoginRequest) -> LoginResponse:
            user = self.audioManager.login(login_request.username, login_request.password)
            if user is None:
                raise HTTPException(status_code=401, detail="Invalid username or password")
            return LoginResponse(session_id=user["session_id"], user=user)

        # logout with session id
        @self.app.post("/logout/")
        async def logout(auth_request: AuthRequest):
            res = self.audioManager.logout(auth_request.session_id)
            if res is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            return StatusResponse(status=True, message="Logged out")

        # register with username, password and email
        @self.app.post("/register/")
        async def register(register_request: RegisterRequest) -> LoginResponse:
            user = self.audioManager.register(register_request.username, register_request.password, register_request.email)
            if user is None:
                raise HTTPException(status_code=401, detail="Invalid username or email")
            return LoginResponse(session_id=user["session_id"], user=user)

        # get user info with session id
        @self.app.post("/user/")
        async def user(auth_request: AuthRequest) -> UserResponse:
            user = self.audioManager.get_user_by_session_id(auth_request.session_id)
            if user is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            return UserResponse(user=user)
            

        # get user library with session id
        @self.app.post("/library/")
        async def library(auth_request: AuthRequest) -> ItemListResponse:
            library = self.audioManager.get_user_library_by_session_id(auth_request.session_id)
            if library is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            return ItemListResponse(items=library)
        # get store library
        @self.app.get("/store/")
        async def store() -> ItemListResponse:
            store = self.audioManager.get_store_library()
            if store is None:
                raise HTTPException(status_code=500, detail="Internal server error")
            return ItemListResponse(items=store)

        # buy item with session id and item id
        @self.app.post("/buy/")
        async def buy(buy_request: BuyRequest) -> bool:
            res = self.audioManager.buy_item(buy_request.session_id, buy_request.item_id)
            if res is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            if res is False:
                raise HTTPException(status_code=400, detail="Item not found")
            return StatusResponse(status=True, message="Item bought")


