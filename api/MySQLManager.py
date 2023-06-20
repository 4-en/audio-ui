from audio_manager import AbstractAudioManager
from audiotypes import AudioContent, Author, User, UserContent, AudioType
import json
import random
import mysql.connector

class MySQLManager(AbstractAudioManager):

    def __init__(self):
        super().__init__()

        # try to connect to database
        HOST = "195.37.176.178"
        PORT = 20133
        USERNAME, PASSWORD = self._loadAuthentications()

        self.db = mysql.connector.connect(
            host=HOST,
            port=PORT,
            user=USERNAME,
            password=PASSWORD,
            database="23_DB_Gruppe1"
        )

        self.cursor = self.db.cursor()

        # check if connection is established
        if self.db.is_connected():
            print("Connected to database")
        else:
            print("Could not connect to database")
            print("Please make sure to connect to the VPN and put your username and password in auth.cfg")
            exit(1)

        # print every entry from User table
        self.cursor.execute("SELECT * FROM User")
        for x in self.cursor:
            print(x)


    def _loadAuthentications(self):
        # load username and password from file
        # first line is username
        # second line is password
        filename = "auth.cfg"

        username = ""
        password = ""
        try:
            with open(filename, "r") as f:
                username = f.readline()
                password = f.readline()
        except FileNotFoundError:
            print(f"File {filename} not found\nPlease create file {filename} and write username and password in it\nExample:\nusername\npassword")
            exit(1)
        return username, password

    
    def _save(self):
        """
        Save changes before shutdown
        """
        pass

    def _create_user(self, user:User) -> User:
        """
        Create user
        """
        raise NotImplementedError
    
    def _edit_user(self, user:User) -> bool:
        """
        Edit user
        """
        raise NotImplementedError
    
    def _delete_user(self, user_id: int) -> bool:
        """
        Delete user
        """
        raise NotImplementedError
    
    def _get_user_by_name(self, username: str) -> User:
        """
        Get user by username
        """
        raise NotImplementedError
    
    def _get_user_by_id(self, user_id: int) -> User:
        """
        Get user by user id
        """
        raise NotImplementedError
    
    def _get_user_by_session_id(self, session_id: str) -> User:
        """
        Get user by session id
        """
        raise NotImplementedError
    
    def _create_user_item(self, user_content:UserContent) -> UserContent:
        """
        Create user item
        """
        raise NotImplementedError
    
    def _get_user_library(self, user_id: int) -> list:
        """
        Get user library by user id
        """
        raise NotImplementedError

    def _edit_user_item(self, user_content:UserContent) -> bool:
        """
        Edit user item
        """
        raise NotImplementedError

    def _delete_user_item(self, user_content_id: int) -> bool:
        """
        Delete user item
        """
        raise NotImplementedError
    
    def _get_store_library(self) -> list:
        """
        Get store library
        """
        raise NotImplementedError
    
    def _get_store_item_by_id(self, item_id: int) -> AudioContent:
        """
        Get store item by item id
        """
        raise NotImplementedError
    
    def _create_store_item(self, audioContent:AudioContent) -> AudioContent:
        """
        Create store item
        """
        raise NotImplementedError
    
    def _edit_store_item(self, audioContent:AudioContent) -> AudioContent:
        """
        Edit store item
        """
        raise NotImplementedError
    
    def _delete_store_item(self, item_id: int) -> bool:
        """
        Delete store item
        """
        raise NotImplementedError
    
    def _create_author(self, author:Author) -> Author:
        """
        Create author
        """
        raise NotImplementedError
    
    def _edit_author(self, author:Author) -> bool:
        """
        Edit author
        """
        raise NotImplementedError
    
    def _delete_author(self, author_id: int) -> bool:
        """
        Delete author
        """
        raise NotImplementedError
    
    def get_author_by_id(self, author_id: int) -> Author:
        """
        Get author by author id
        """
        raise NotImplementedError
    
    def get_author_by_name(self, first_name: str, last_name: str) -> Author:
        """
        Get author by name
        """
        raise NotImplementedError
    
    def _update_session_id(self, user_id: int, session_id: str, session_timeout:int) -> bool:
        """
        Update session id
        """
        raise NotImplementedError