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
        #self.cursor.execute("SELECT * FROM User")
        #for x in self.cursor:
        #    print(x)

        #init library from json
        #self.load_json_library()

    def load_json_library(self, path: str = "library.json"):
        l = []
        with open(path, "r") as f:
            l = json.load(f)

        getType = lambda x: AudioType.Audiobook if x == "audiobook" else AudioType.Podcast if x == "podcast" else 2
        
        for item in l:
            author_name = item["author"].split(" ")
            author = Author(-1, " ".join(author_name[:-1]), author_name[-1], "no bio")
            author2 = self.get_author_by_name(author.first_name, author.last_name)
            if author2 is None:
                print("Creating new author: ", author.first_name, author.last_name)
                author = self._create_author(author)
            else:
                author = author2
            
            audioContent = AudioContent(
                -1,
                getType(item["type"]),
                item["title"],
                author.author_id,
                item["category"],
                item["series"],
                sum([c["duration"] for c in item["chapters"]]),
                item["rating"],
                int(item["price"]*100),
                item["cover"],
                item["releaseDate"],
                item["addedDate"],
                item["seriesIndex"]
            )
            print("Creating new audioContent: ", audioContent.title)
            audioContent = self._create_store_item(audioContent)


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
        #self.cursor.execute("INSERT INTO User (name, password) VALUES (%s, %s)", 
        #                    (user.username, user.passhash))
        self.cursor.execute("INSERT INTO User (name, password, salt, email, balance, admin, join_date) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
                            (user.username, user.passhash, user.salt, user.email, user.balance, user.admin, user.created))
        self.db.commit()

        return self._get_user_by_name(user.username)
    
    def _edit_user(self, user:User) -> bool:
        """
        Edit user
        """
        self.cursor.execute("UPDATE User SET name = %s, password = %s, salt = %s, email = %s, balance = %s, admin = %s, join_date = %s WHERE user_id = %s", 
                            (user.username, user.passhash, user.salt, user.email, user.balance, user.admin, user.created, user.user_id))
        # check result
        if self.cursor.rowcount == 0:
            return False
        self.db.commit()
        return True
    
    def _delete_user(self, user_id: int) -> bool:
        """
        Delete user
        """
        self.cursor.execute("DELETE FROM User WHERE user_id = %s", (user_id,))
        # check result
        if self.cursor.rowcount == 0:
            return False
        self.db.commit()
        return True
    
    def _result_to_user(self, result) -> User:
        """
        Convert result to user
        """
        user = User(result[0], result[1], result[2], result[3], result[8], result[4], result[5], result[6], result[7], result[9])
        return user
    
    def _get_user_by_name(self, username: str) -> User:
        """
        Get user by username
        """
        self.cursor.execute("SELECT * FROM User WHERE name = %s", (username,))
        result = self.cursor.fetchone()
        if result is None:
            return None
        return self._result_to_user(result)
        
    
    def _get_user_by_id(self, user_id: int) -> User:
        """
        Get user by user id
        """
        self.cursor.execute("SELECT * FROM User WHERE user_id = %s", (user_id,))
        result = self.cursor.fetchone()
        if result is None:
            return None
        return self._result_to_user(result)
    
    def _get_user_by_session_id(self, session_id: str) -> User:
        """
        Get user by session id
        """
        self.cursor.execute("SELECT * FROM User WHERE session_id = %s", (session_id,))
        result = self.cursor.fetchone()
        if result is None:
            return None
        return self._result_to_user(result)

    def _create_user_item(self, user_content:UserContent) -> UserContent:
        """
        Create user item
        """
        self.cursor.execute("SELECT * FROM UserContent WHERE user_id = %s AND content_id = %s", (user_content.user_id, user_content.content_id))
        res = self.cursor.fetchone()
        if res is None:
            self.cursor.execute("INSERT INTO UserContent (user_id, content_id, progress, rating, purchase_date, last_played) VALUES (%s, %s, %s, %s, %s, %s)", (user_content.user_id, user_content.content_id, user_content.progress, user_content.rating, user_content.purchased, user_content.last_played))
            if self.cursor.rowcount == 0:
                return None
            print("Commiting...")
            self.db.commit() 
        return self._get_user_item_by_id(self.cursor.lastrowid)   

    def _result_to_user_item(self, result) -> UserContent:
        """
        Convert result to user item
        """
        uc = UserContent(result[0], result[1], result[2], result[3], result[4], result[5], result[6])
        return uc
    
    def _get_user_item_by_id(self, user_content_id: int) -> UserContent:
        """
        Get user item by id
        """
        self.cursor.execute("SELECT * FROM UserContent WHERE user_content_id = %s", (user_content_id,))
        result = self.cursor.fetchone()
        if result is None:
            return None
        return self._result_to_user_item(result)
    
    def _get_user_library(self, user_id: int) -> list:
        """
        Get user library by user id
        """
        user_library = []
        self.cursor.execute("SELECT * FROM UserContent WHERE user_id = %s", (user_id,))
        for result in self.cursor:
            user_library.append(self._result_to_user_item(result))
        return user_library

    def _edit_user_item(self, user_content:UserContent) -> bool:
        """
        Edit user item
        """
        res = self.cursor.execute("SELECT * FROM UserContent WHERE userContent_id = %s", (user_content.id,))
    
        if self.cursor.rowcount == 0:
            return False
        if res.user_id != user_content.user_id:
            return False
        
        self.cursor.execute("UPDATE UserContent SET user_id = %s, audio_id = %s, progress = %s, rating = %s, status = %s, last_played = %s WHERE userContent_id = %s",user_content.user_id, user_content.audio_id, user_content.progress, user_content.rating, user_content.status, user_content.last_played, user_content.id)
        self.db.commit()
        return True

    def _delete_user_item(self, user_content_id: int) -> bool:
        """
        Delete user item
        """
        res=self.cursor.execute("SELECT * FROM UserContent WHERE userContent_id = %s", (user_content_id,))
        if self.cursor.rowcount == 0:
            return False
        self.cursor.execute("DELETE FROM UserContent WHERE userContent_id = %s", (user_content_id,))
        return True
       
    def _result_to_store_item(self, result) -> AudioContent:
        """
        Convert result to store item
        """
        audioContent = AudioContent(result[0], result[1], result[2], result[5], result[6].split(";"), result[3], result[8], result[10], result[9], result[7], result[11], result[12], result[4])
        return audioContent
    
    def _get_store_library(self) -> list:
        """
        Get store library
        """
        store_library = []
        self.cursor.execute("SELECT * FROM AudioContent")
        for result in self.cursor:
            store_library.append(self._result_to_store_item(result))
        return store_library
    
    def _get_store_item_by_id(self, item_id: int) -> AudioContent:
        """
        Get store item by item id
        """
        self.cursor.execute("SELECT * FROM AudioContent WHERE audio_id = %s", (item_id,))
        result = self.cursor.fetchone()
        if result is None:
            return None
        return self._result_to_store_item(result)
    
    def _create_store_item(self, audioContent:AudioContent) -> AudioContent:
        """
        Create store item
        """
        self.cursor.execute("INSERT INTO AudioContent (audio_type, title, series, series_index, author_id, categories, cover_name, duration, price, rating, releaseDate, addedDate) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                            (audioContent.audio_type, 
                             audioContent.title, 
                             audioContent.series, 
                             audioContent.series_index, 
                             audioContent.author_id, 
                             ";".join(audioContent.categories), 
                             audioContent.cover_file, 
                             audioContent.duration, 
                             audioContent.price, 
                             audioContent.rating, 
                             audioContent.releaseDate, 
                             audioContent.addedDate))
        
        self.db.commit()
        return self._get_store_item_by_id(self.cursor.lastrowid)
    
    def _edit_store_item(self, audioContent:AudioContent) -> AudioContent:
        """
        Edit store item
        """
        self.cursor.execute("UPDATE AudioContent SET audio_type = %s, title = %s, series = %s, series_index = %s, author_id = %s, categories = %s, cover_name = %s, duration = %s, price = %s, rating = %s, releaseDate = %s, addedDate = %s WHERE audio_id = %s",
                            (audioContent.audio_type, 
                             audioContent.title, 
                             audioContent.series, 
                             audioContent.series_index, 
                             audioContent.author_id, 
                             ";".join(audioContent.categories), 
                             audioContent.cover_file, 
                             audioContent.duration, 
                             audioContent.price, 
                             audioContent.rating, 
                             audioContent.releaseDate, 
                             audioContent.addedDate, 
                             audioContent.content_id))
        self.db.commit()
        return self._get_store_item_by_id(audioContent.content_id)
        
    
    def _delete_store_item(self, item_id: int) -> bool:
        """
        Delete store item
        """
        self.cursor.execute("DELETE FROM AudioContent WHERE audio_id = %s", (item_id,))
        if self.cursor.rowcount == 0:
            return False
        self.db.commit()
        return True
    
    def _create_author(self, author:Author) -> Author:
        """
        Create author
        """
        self.cursor.execute("INSERT INTO Authors (first_name, last_name, bio) VALUES (%s, %s, %s)",
                            (author.first_name, author.last_name, author.bio))
        
        if self.cursor.rowcount == 0:
            return None
        self.db.commit()
        return self.get_author_by_id(self.cursor.lastrowid)
    
    def _edit_author(self, author:Author) -> bool:
        """
        Edit author
        """
        self.cursor.execute("UPDATE Authors SET first_name = %s, last_name = %s, bio = %s WHERE author_id = %s",
                            (author.first_name, author.last_name, author.bio, author.id))
        
        if self.cursor.rowcount == 0:
            return False
        self.db.commit()
        return True
    
    def _delete_author(self, author_id: int) -> bool:
        """
        Delete author
        """
        self.cursor.execute("DELETE FROM Authors WHERE author_id = %s", (author_id,))
        if self.cursor.rowcount == 0:
            return False
        self.db.commit()
        return True
    
    def _result_to_author(self, result) -> Author:
        """
        Convert result to author
        """
        author = Author(result[0], result[1], result[2], result[3])
        return author
    
    def get_author_by_id(self, author_id: int) -> Author:
        """
        Get author by author id
        """
        self.cursor.execute("SELECT * FROM Authors WHERE author_id = %s", (author_id,))
        result = self.cursor.fetchone()
        if result is None:
            return None
        return self._result_to_author(result)
    
    def get_authors_by_ids(self, author_ids: list) -> list:
        """
        Get authors by author ids
        """
        authors = []
        self.cursor.execute("SELECT * FROM Authors WHERE author_id IN (%s)" % ",".join(author_ids))
        for result in self.cursor:
            authors.append(self._result_to_author(result))
        return authors
        
    
    def get_author_by_name(self, first_name: str, last_name: str) -> Author:
        """
        Get author by name
        """
        self.cursor.execute("SELECT * FROM Authors WHERE last_name = %s", (last_name,))
        result = self.cursor.fetchone()
        if result is None:
            return None
        
        # clear result
        self.cursor.fetchall()
        a = self._result_to_author(result)
        return a
    
    def _update_session_id(self, user_id: int, session_id: str, session_timeout:int) -> bool:
        """
        Update session id
        """
        user = self._get_user_by_id(user_id)
        if user is None:
            return False
        self.cursor.execute("UPDATE User SET session_id = %s, session_time = %s WHERE user_id = %s", (session_id, session_timeout, user_id))

        if self.cursor.rowcount == 0:
            return False
        self.db.commit()
        return True