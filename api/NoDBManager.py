from audio_manager import AbstractAudioManager
from audiotypes import AudioContent, Author, User, UserContent, AudioType
import json
import random

class NoDBManager(AbstractAudioManager):

    def __init__(self):
        super().__init__()
        self.users = {}
        self.store = {}
        self.userItems = {}
        self.authors = {}
        self.next_user_id = 0
        self.next_item_id = 0
        self.next_author_id = 0
        self.next_user_item_id = 0
        self.load_json_library()
        self.create_test_users()

    def create_test_users(self):
        user1 = User.create_new("Bob", "1234", "bob@example.com", balance=100000)
        user2 = User.create_new("Alice", "1234", "alice@example.com")
        user3 = User.create_new("User", "1234", "user@example.com")
        admin = User.create_new("Admin", "1234", "admin@example.com", admin=True)

        for user in [user1, user2, user3, admin]:
            user.create_new_session()

        self._create_user(user1)
        self._create_user(user2)
        self._create_user(user3)
        self._create_user(admin)

        # create user items
        for i in range(0, 3):
            session_id = self.users[i].session_id
            s = set()
            for _ in range(0, random.randint(5, 20)):
                s.add(random.randint(0, len(self.store)-1))
            for item_id in s:
                self.buy_item(session_id, item_id)


    def load_json_library(self, path: str = "library.json"):
        l = []
        with open(path, "r") as f:
            l = json.load(f)

        getType = lambda x: AudioType.Audiobook if x == "audiobook" else AudioType.Podcast if x == "podcast" else 2
        
        for item in l:
            author_name = item["author"].split(" ")
            author = Author(-1, " ".join(author_name[:-1]), author_name[-1], "no bio")
            author = self._create_author(author)
            
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
            audioContent = self._create_store_item(audioContent)

            

    # implement methods
    def _create_user(self, user:User) -> User:
        """
        Create user
        """
        # check if user already exists
        if self._get_user_by_name(user.username):
            return None
        user.user_id = self.next_user_id
        self.next_user_id += 1
        self.users[user.user_id] = user
        return user

    
    def _edit_user(self, user:User) -> bool:
        """
        Edit user
        """
        if not self._get_user_by_id(user.user_id):
            return False
        self.users[user.user_id] = user
        return True
    
    def _delete_user(self, user_id: int) -> bool:
        """
        Delete user
        """
        if not self._get_user_by_id(user_id):
            return False
        del self.users[user_id]
        return True
    
    def _get_user_by_name(self, username: str) -> User:
        """
        Get user by username
        """
        for user in self.users.values():
            if user.username == username:
                return user
        return None
    
    def _get_user_by_id(self, user_id: int) -> User:
        """
        Get user by user id
        """
        return self.users.get(user_id, None)
    
    def _get_user_by_session_id(self, session_id: str) -> User:
        """
        Get user by session id
        """
        for user in self.users.values():
            if user.session_id == session_id:
                return user
        return None
    
    def _create_user_item(self, user_content:UserContent) -> UserContent:
        """
        Create user item
        """
        user_content.user_content_id = self.next_user_item_id
        self.next_user_item_id += 1
        self.userItems[user_content.user_content_id] = user_content
        return user_content
    
    def _get_user_library(self, user_id: int) -> list:
        """
        Get user library by user id
        """
        return [userContent for userContent in self.userItems.values() if userContent.user_id == user_id]
    
    def _edit_user_item(self, user_content:UserContent) -> bool:
        """
        Edit user item
        """
        if not self._get_user_item_by_id(user_content.user_content_id):
            return False
        self.userItems[user_content.user_content_id] = user_content
        return True

    def _delete_user_item(self, user_content_id: int) -> bool:
        """
        Delete user item
        """
        if not self._get_user_item_by_id(user_content_id):
            return False
        del self.userItems[user_content_id]
        return True

    def _get_store_library(self) -> list:
        """
        Get store library
        """
        return list(self.store.values())
    
    def _get_store_item_by_id(self, item_id: int) -> AudioContent:
        """
        Get store item by item id
        """
        return self.store.get(item_id, None)
    
    def _create_store_item(self, audioContent:AudioContent) -> AudioContent:
        """
        Create store item
        """
        audioContent.content_id = self.next_item_id
        self.next_item_id += 1
        self.store[audioContent.content_id] = audioContent
        return audioContent
    
    def _edit_store_item(self, audioContent:AudioContent) -> AudioContent:
        """
        Edit store item
        """
        if not self._get_store_item_by_id(audioContent.content_id):
            return None
        self.store[audioContent.content_id] = audioContent
        return audioContent
    
    def _delete_store_item(self, item_id: int) -> bool:
        """
        Delete store item
        """
        if not self._get_store_item_by_id(item_id):
            return False
        del self.store[item_id]
        return True
    
    def _create_author(self, author:Author) -> Author:
        """
        Create author
        """
        author.author_id = self.next_author_id
        self.next_author_id += 1
        self.authors[author.author_id] = author
        return author
    
    def _edit_author(self, author:Author) -> bool:
        """
        Edit author
        """
        if not self._get_author_by_id(author.author_id):
            return False
        self.authors[author.author_id] = author
        return True
    
    def _delete_author(self, author_id: int) -> bool:
        """
        Delete author
        """
        if not self._get_author_by_id(author_id):
            return False
        del self.authors[author_id]
        return True
    
    def get_author_by_id(self, author_id: int) -> Author:
        """
        Get author by author id
        """
        return self.authors.get(author_id, None)
    
    def get_author_by_name(self, first_name: str, last_name: str) -> Author:
        """
        Get author by name
        """
        for author in self.authors.values():
            if author.first_name == first_name and author.last_name == last_name:
                return author
        return None
    
    def _update_session_id(self, user_id: int, session_id: str, session_timeout:int) -> bool:
        """
        Update session id
        """
        if not self._get_user_by_id(user_id):
            return False
        self.users[user_id].session_id = session_id
        self.users[user_id].session_timeout = session_timeout
        return True