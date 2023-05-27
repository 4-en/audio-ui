# classes for data used in audio ui
import time
import hashlib
import random
import uuid

# AudioType
class AudioType:
    Audiobook = 0
    Podcast = 1


# User
class User:
    def __init__(self, user_id:int, username:str, passhash:str, salt:str, email:str, session_id:str, session_timeout:int, created:int, balance:int, admin:bool):
        self.user_id = user_id
        self.username = username
        self.passhash = passhash
        self.salt = salt
        self.email = email
        self.session_id = session_id
        self.session_timeout = session_timeout
        self.created = created
        self.balance = balance
        self.admin = admin

    @staticmethod
    def get_password_hash(password:str, salt:str):
        return hashlib.sha512((password + salt).encode()).hexdigest()

    @classmethod
    def create_new(cls, username:str, password:str, email:str, balance:int=10000, admin:bool=False):
        salt = uuid.uuid4().hex
        passhash = cls.get_password_hash(password, salt)
        return cls(-1, username, passhash, salt, email, "no_session", 0, int(time.time()), balance, admin)
    
    def check_password(self, password:str):
        return self.passhash == self.get_password_hash(password, self.salt)
    
    def create_new_session(self):
        self.session_id = uuid.uuid4().hex
        self.session_timeout = int(time.time()) + 60 * 60 * 24 * 7 # 7 days
        return self.session_id
    
    def check_session(self, session_id:str):
        return self.session_id == session_id and self.session_timeout > int(time.time())
    
    def extend_session(self):
        self.session_timeout = int(time.time()) + 60 * 60 * 24 * 7

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "balance": self.balance,
            "admin": self.admin,
            "created": self.created,
            "session_id": self.session_id
        }
    
class AudioContent:
    def __init__(self, content_id:int, audio_type:int, title:str, author_id:int, categories:str, series:str, duration:int, rating:float, price:int, cover_file:str, releaseDate:int, addedDate:int, series_index:int):
        self.content_id = content_id
        self.title = title
        self.author_id = author_id
        self.categories = categories
        self.series = series
        self.duration = duration
        self.rating = rating
        self.price = price
        self.cover_file = cover_file
        self.releaseDate = releaseDate
        self.addedDate = addedDate
        self.series_index = series_index
        self.audio_type = audio_type
    
    def to_dict(self):
        return {
            "content_id": self.content_id,
            "title": self.title,
            "author_id": self.author_id,
            "categories": self.categories,
            "series": self.series,
            "duration": self.duration,
            "rating": self.rating,
            "price": self.price,
            "cover_file": self.cover_file,
            "releaseDate": self.releaseDate,
            "addedDate": self.addedDate,
            "series_index": self.series_index,
            "audio_type": self.audio_type
        }
    
class Author:
    def __init__(self, author_id:int, first_name:str, last_name:str, bio:str):
        self.author_id = author_id
        self.first_name = first_name
        self.last_name = last_name
        self.bio = bio

    def to_dict(self):
        return {
            "author_id": self.author_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "bio": self.bio
        }
    
class UserContent:
    def __init__(self, user_content_id, user_id:int, content_id:int, rating:float, progress:int, purchased:int, last_played:int):
        self.user_content_id = user_content_id
        self.user_id = user_id
        self.content_id = content_id
        self.rating = rating
        self.progress = progress
        self.purchased = purchased
        self.last_played = last_played

    @classmethod
    def create_new(cls, user_id:int, content_id:int):
        return cls(-1, user_id, content_id, -1, 0, int(time.time()), -1)
    
    def to_dict(self):
        return {
            "user_id": self.user_id,
            "content_id": self.content_id,
            "rating": self.rating,
            "progress": self.progress,
            "purchased": self.purchased
        }
    

    


