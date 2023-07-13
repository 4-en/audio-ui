from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel
from audio_manager import AbstractAudioManager
import uvicorn
import time
from audiotypes import AudioContent
import asyncio



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

class PlayRequest(BaseModel):
    session_id: str
    item_id: int

class CreateItemRequest(BaseModel):
    session_id: str
    item_audio_type: int
    item_title: str
    item_author_id: int | None
    item_author_first_name: str | None
    item_author_last_name: str | None
    item_author_bio: str | None
    item_categories: list[str]
    item_series: str | None
    item_duration: int
    item_rating: float
    item_price: int
    item_cover_file: str
    item_release_date: int
    item_series_index: int | None

class EditItemRequest(BaseModel):
    session_id: str
    item_id: int
    changes: dict

class RateItemRequest(BaseModel):
    session_id: str
    item_id: int
    rating: float


class PlayResponse(BaseModel):
    item: dict
    audio_url: str

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
    state: int = -1
    items: list

class UserStateRequest(BaseModel):
    state: int = -1
    session_id: str

class StateResponse(BaseModel):
    state: int = -1

class ChargeRequest(BaseModel):
    session_id: str
    amount: int

class RecommendRequest(BaseModel):
    session_id: str | None = None
    amount: int = 10


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
        
        # test route
        @self.app.get("/test/")
        async def test():
            self.mydb.ping(reconnect=True, attempts=3, delay=5)
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
        
        # rate item with session id and item id and rating
        @self.app.post("/rate/")
        async def rate(rate_request: RateItemRequest) -> StatusResponse:
            res = self.audioManager.rate_item(rate_request.session_id, rate_request.item_id, rate_request.rating)

            if res is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            if res is False:
                raise HTTPException(status_code=400, detail="Item not found")
            return StatusResponse(status=True, message="Item rated")

            

        # get user library with session id
        @self.app.post("/library/")
        async def library(auth_request: AuthRequest) -> ItemListResponse:
            state, library = self.audioManager.get_user_library_by_session_id(auth_request.session_id)
            if library is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            
            return ItemListResponse(items=library, state=state)
        
        # get store library
        @self.app.get("/store/")
        async def store() -> ItemListResponse:
            store = self.audioManager.get_store_library()
            if store is None:
                raise HTTPException(status_code=500, detail="Internal server error")
            state = self.audioManager.get_store_state()
            return ItemListResponse(items=store, state=state)

        # buy item with session id and item id
        @self.app.post("/buy/")
        async def buy(buy_request: BuyRequest) -> StatusResponse:
            res = self.audioManager.buy_item(buy_request.session_id, buy_request.item_id)
            if res is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            if res is False:
                raise HTTPException(status_code=400, detail="Item not found")
            r = StatusResponse(status=True, message="Item bought")
            return r
        
        # "plays" item with session id and item id
        # since this is a demo, we just check if the user owns the item
        # and mark last_played as now, then return url to static audio file
        @self.app.post("/play/")
        async def play(play_request: PlayRequest) -> PlayResponse:
            url = self.audioManager.play_item(play_request.session_id, play_request.item_id)
            if url is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            
            item = self.audioManager.get_user_item_by_session_id(play_request.session_id, play_request.item_id)
            if item is None:
                raise HTTPException(status_code=400, detail="Item not found")
            return PlayResponse(item=item, audio_url=url)
        
        @self.app.post("/store_state/")
        async def store_state(state_request: StateResponse) -> StateResponse:
            # use long polling to wait for state change
            # get store state
            state = self.audioManager.get_store_state()
            max_tries = 60
            while state == state_request.state and max_tries > 0:
                # poll every second
                await asyncio.sleep(1.0)
                state = self.audioManager.get_store_state()
                max_tries -= 1
            return StateResponse(state=state)
            
        
        @self.app.post("/user_state/")
        async def user_state(state_request: UserStateRequest) -> StateResponse:
            # use long polling to wait for state change
            # get user state
            user = self.audioManager.get_user_by_session_id(state_request.session_id)
            if user is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            max_tries = 60
            state = self.audioManager.get_user_state(user["user_id"])
            while state == state_request.state and max_tries > 0:
                # poll every second
                await asyncio.sleep(1.0)
                state = self.audioManager.get_user_state(user["user_id"])
                max_tries -= 1
            return StateResponse(state=state)



        @self.app.post("/create_item/")
        async def create_item(create_item_request: CreateItemRequest) -> ItemResponse:
            item = self.audioManager.create_store_item_with_author(
                create_item_request.session_id,
                create_item_request.item_audio_type,
                create_item_request.item_title,
                create_item_request.item_author_id,
                create_item_request.item_author_first_name,
                create_item_request.item_author_last_name,
                create_item_request.item_author_bio,
                create_item_request.item_categories,
                create_item_request.item_series,
                create_item_request.item_duration,
                create_item_request.item_rating,
                create_item_request.item_price,
                create_item_request.item_cover_file,
                create_item_request.item_release_date,
                create_item_request.item_series_index
            )
            if item is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            return ItemResponse(item=item)
        
        @self.app.post("/edit_item/")
        async def edit_item(edit_item_request: EditItemRequest) -> ItemResponse:
            edit = self.audioManager.update_store_item_from_changes(
                edit_item_request.session_id,
                edit_item_request.item_id,
                edit_item_request.changes
            )
            if edit is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            
            return ItemResponse(item=edit)
        
        @self.app.post("/delete_item/")
        async def delete_item(delete_item_request: PlayRequest) -> StatusResponse:
            delete = self.audioManager.delete_store_item(
                delete_item_request.session_id,
                delete_item_request.item_id
            )
            if delete is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            return StatusResponse(status=delete, message="Item deleted")
        
        @self.app.post("/charge/")
        async def charge(charge_request: ChargeRequest) -> StatusResponse:
            charge = self.audioManager.charge_user(
                charge_request.session_id,
                charge_request.amount
            )
            if charge is None:
                raise HTTPException(status_code=401, detail="Invalid session id")
            return StatusResponse(status=charge, message="User charged")
        
        @self.app.post("/recommend/")
        async def recommend(recommend_request: RecommendRequest) -> ItemListResponse:
            items = self.audioManager.get_recommendations(recommend_request.session_id, recommend_request.amount)
            if items is None:
                # no recommendations found
                return ItemListResponse(items=[])
            return ItemListResponse(items=items)
        
            




            


