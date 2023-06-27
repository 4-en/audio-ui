# contains backend logic for audio manager
import hashlib
from audiotypes import User, AudioContent, Author, UserContent
import time

class AbstractAudioManager:

    def __init__(self):
        self.storeState = 0
        self.userStates = {}

    # database functions to be implemented by child classes
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
    
    def get_authors_by_ids(self, author_ids: list) -> list:
        """
        Get authors by author ids
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
    
    
    

    
    # audio manager functions that are built on top of database functions
    def notify_store_change(self):
        """
        Called when store state changes
        Used to update store store in ui
        """
        self.storeState += 1

    def notify_user_change(self, user_id: int):
        """
        Called when user state changes
        Used to update user lib in ui
        """
        if user_id not in self.userStates:
            self.userStates[user_id] = 0
        self.userStates[user_id] += 1

    def get_store_state(self) -> int:
        """
        Get store state"""
        return self.storeState
    
    def get_user_state(self, user_id: int) -> int:
        """
        Get user state
        """
        if user_id not in self.userStates:
            self.userStates[user_id] = 0
        return self.userStates[user_id]

    def get_user_state_by_session_id(self, session_id: str) -> int:
        """
        Get user state by session id
        """
        user = self._get_user_by_session_id(session_id)
        if user is None:
            return None
        return self.get_user_state(user.user_id)
    
    def get_store_library(self) -> list:
        """
        Get store library
        """
        library = self._get_store_library()
        library = [item.to_dict() for item in library]

        # get authors
        author_ids = set([str(item["author_id"]) for item in library])
        authors = self.get_authors_by_ids(author_ids)
        authors = {author.author_id: author for author in authors}
        for item in library:
            author_id = item["author_id"]
            if author_id not in authors:
                authors[author_id] = self.get_author_by_id(author_id)
            item["author"] = authors[author_id].to_dict()
            del item["author_id"]
        return library

    
    def get_store_item_by_id(self, item_id: int) -> dict:
        """
        Get store item by item id
        """
        item = self._get_store_item_by_id(item_id)

        if item is None:
            return None
        
        # get author
        author = self.get_author_by_id(item.author_id)

        item = item.to_dict()
        item["author"] = author.to_dict()
        del item["author_id"]
        return item

    def get_user_by_session_id(self, session_id: str) -> dict:
        """
        Get user by session id
        """
        user = self._get_user_by_session_id(session_id)
        if user is None:
            return None
        if not user.check_session(session_id):
            return None
        return self._join_user_and_state(user.to_dict())
    
    def _join_user_and_state(self, user: dict) -> dict:
        """
        Join user and state
        """
        user["state"] = self.get_user_state(user["user_id"])
        return user
    
    def login(self, username: str, password: str) -> dict:
        """
        Login
        Returns user with session id if successful
        """
        user = self._get_user_by_name(username)
        if user is None:
            return None
        
        if not user.check_password(password):
            return None
        
        if not user.check_session(user.session_id):
            # generate new session id
            user.create_new_session()
            self._update_session_id(user.user_id, user.session_id, user.session_timeout)
        else:
            # extend session timeout
            user.extend_session()
            self._update_session_id(user.user_id, user.session_id, user.session_timeout)

        return self._join_user_and_state(user.to_dict())
    
    def logout(self, session_id) -> bool:
        """
        Logout
        """
        user = self._get_user_by_session_id(session_id)
        if user is None:
            return False
        
        user.session_id = "no_session"
        user.session_timeout = 0
        self._update_session_id(user.user_id, user.session_id, user.session_timeout)
        self.notify_user_change(user.user_id)
        return True
    
    def register(self, username: str, password: str, email:str) -> dict:
        """
        Register
        """
        user = User.create_new(username, password, email, balance=20000)
        user = self._create_user(user)
        if user is None:
            return None
        return self._join_user_and_state(user.to_dict())
    
    def _get_user_library_by_id(self, user_id: int) -> list:
        """
        Get user library by user id
        """
        user_content = self._get_user_library(user_id)
        if user_content is None:
            return None
        user_content.sort(key=lambda x: x.content_id)
        store_content = self.get_store_library()
        if store_content is None:
            return None
        user_library = []
        authors = {}
        store_i = 0
        for item in user_content:
            # find corresponding store item
            while store_i < len(store_content) and store_content[store_i]["content_id"] != item.content_id:
                store_i += 1
            if store_i < len(store_content):
                # create user library item
                audio_user_content = {
                    "user_rating": item.rating,
                    "progress": item.progress,
                    "purchased": item.purchased,
                    "last_played": item.last_played,
                    **store_content[store_i]
                }

                if "author_id" in audio_user_content:
                    author_id = audio_user_content["author_id"]
                    if author_id not in authors:
                        author = self.get_author_by_id(author_id)
                        if author is None:
                            authors[author_id] = None
                        else:
                            authors[author_id] = author.to_dict()
                    del audio_user_content["author_id"]
                    audio_user_content["author"] = authors[author_id]

                user_library.append(audio_user_content)
        return user_library
    
    def get_user_library_by_session_id(self, session_id: str) -> tuple[int, list]:
        """
        Get user library by session id
        """
        user = self._get_user_by_session_id(session_id)
        if user is None or user.check_session(session_id) is False:
            return None
        return self.get_user_state(user.user_id), self._get_user_library_by_id(user.user_id)

    def get_user_item_by_session_id(self, session_id: str, item_id: int) -> dict:
        """
        Get user item by session id and item id
        """
        user = self._get_user_by_session_id(session_id)
        if user is None or user.check_session(session_id) is False:
            return None
        item = self._get_user_item(user.user_id, item_id)
        if item is None:
            return None
        store_item = self.get_store_item_by_id(item.content_id)
        if store_item is None:
            return None
        return {
            "user_rating": item.rating,
            "progress": item.progress,
            "purchased": item.purchased,
            "last_played": item.last_played,
            **store_item
        }
    
    def is_admin(self, session_id: str) -> bool:
        """
        Check if user is admin
        """
        user = self._get_user_by_session_id(session_id)
        if user is None or user.check_session(session_id) is False:
            return False
        return user.admin
    
    def get_user_library_by_id(self, target_id:int, my_session_id: str) -> list:
        """
        Get user library by user id
        """
        # check if user is admin
        if not self.is_admin(my_session_id):
            return None
        
        return self._get_user_library_by_id(target_id)
    
    def buy_item(self, session_id: str, item_id: int) -> bool:
        """
        Buys item and adds it to user library
        Removes price from user balance
        Returns true if successful
        """
        user = self._get_user_by_session_id(session_id)
        if user is None or user.check_session(session_id) is False:
            return None
        
        # check if user already owns item
        user_library = self._get_user_library(user.user_id)
        if user_library is not None and len(user_library) >0:
            # check if user already owns item
            for item in user_library:
                if item.content_id == item_id:
                    return False


        store_item = self.get_store_item_by_id(item_id)
        if store_item is None:
            return False
        if store_item["price"] > user.balance:
            return False
        user.balance -= store_item["price"]
        self._edit_user(user)
        user_content = UserContent.create_new(user.user_id, store_item["content_id"])
        self._create_user_item(user_content)
        self.notify_user_change(user.user_id)
        return True
    
    def _get_user_item(self, user_id: int, item_id: int) -> UserContent:
        """
        Get user item by user id and item id
        """
        user_library = self._get_user_library(user_id)
        if user_library is None:
            return None
        for item in user_library:
            if item.item_id == item_id:
                return item
        return None
    
    def rate_item(self, session_id: str, item_id: int, rating: int) -> bool:
        """
        Rate item
        Returns true if successful
        """
        user = self._get_user_by_session_id(session_id)
        if user is None or user.check_session(session_id) is False:
            return False
        user_content = self._get_user_item(user.user_id, item_id)
        if user_content is None:
            return False
        user_content.rating = rating
        self._edit_user_item(user_content)
        self.notify_user_change(user.user_id)

        # TODO: recalculate store item rating and notify store change
        return True
    
    def update_progress(self, session_id: str, item_id: int, progress: int) -> bool:
        """
        Update progress
        Returns true if successful
        """
        user = self._get_user_by_session_id(session_id)
        if user is None or user.check_session(session_id) is False:
            return False
        user_content = self._get_user_item(user.user_id, item_id)
        if user_content is None:
            return False
        user_content.progress = progress
        self._edit_user_item(user_content)
        self.notify_user_change(user.user_id)
        return True

    def play_item(self, session_id: str, item_id: int) -> str:
        """
        Play item
        Returns url to static audio file
        """
        user = self._get_user_by_session_id(session_id)
        if user is None or user.check_session(session_id) is False:
            return None
        user_content = self._get_user_item(user.user_id, item_id)
        if user_content is None:
            return None
        # normally we would get the url from the server
        user_content.last_played = int(time.time())
        self._edit_user_item(user_content)
        self.notify_user_change(user.user_id)
        return "https://dorar.at/LARGE/PuretuneMp3/73lbS7hNl1pwN3Tch56zYg/1685383200/201405/171.mp3"
    
    

    ### admin functions
    ### always check if user is admin before calling these functions
    def create_store_item(self, session_id: str, item: AudioContent) -> dict:
        """
        Create store item
        Returns true if successful
        """
        # check if user is admin
        if not self.is_admin(session_id):
            return False
        
        new_item = self._create_store_item(item)
        if new_item is None:
            return None
        self.notify_store_change()
        return new_item.to_dict()
    
    def create_store_item_with_author(
        self,
        session_id: str,
        audio_type: int,
        title: str,
        author_id: int|None,
        author_first_name: str|None,
        author_last_name: str|None,
        author_bio: str|None,
        categories: str,
        series: str,
        duration: int,
        rating: float,
        price: int,
        cover_file: str,
        releaseDate: int,
        series_index: int
    ) -> dict:
        # check if user is admin
        if not self.is_admin(session_id):
            return None
        
        # create author if necessary
        author = None
        if author_id is not None:
            author = self.get_author_by_id(author_id)
        if author is None:
            if author_first_name is None or author_last_name is None:
                return None
            bio = "no bio"
            if author_bio is not None:
                bio = author_bio
            author = Author(-1, author_first_name, author_last_name, bio)
            author = self._create_author(author)
            if author is None:
                return None
            
        # create store item
        item = AudioContent(
            -1,
            audio_type,
            title,
            author.author_id,
            categories,
            series,
            duration,
            rating,
            price,
            cover_file,
            releaseDate,
            int(time.time()),
            series_index
        )
        return self.create_store_item(session_id, item)
            
        
    
    def update_store_item(self, session_id: str, item: AudioContent) -> dict:
        """
        Update store item
        Returns new item if successful
        """
        # check if user is admin
        if not self.is_admin(session_id):
            return None
        
        newItem = self._edit_store_item(item)
        if newItem is None:
            return None
        self.notify_store_change()
        return newItem.to_dict()
    
    def update_store_item_from_changes(self, session_id: str, item_id: int, changes: dict) -> dict:
        """
        Update store item from changes
        Returns new item if successful
        """
        # check if user is admin
        if not self.is_admin(session_id):
            return None
        
        item = self.get_store_item_by_id(item_id)
        if item is None:
            return None
        for key in changes:
            if key in item.to_dict():
                setattr(item, key, changes[key])
        return self.update_store_item(session_id, item)
        
    
    def delete_store_item(self, session_id: str, item_id: int) -> bool:
        """
        Delete store item
        Returns true if successful
        """
        # check if user is admin
        if not self.is_admin(session_id):
            return False
        
        ret = self._delete_store_item(item_id)
        if ret is False:
            return False
        self.notify_store_change()
        return True

    

