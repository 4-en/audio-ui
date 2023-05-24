# contains backend logic for audio manager
import hashlib
from audiotypes import User, AudioContent, Author, UserContent

class AbstractAudioManager:

    def __init__(self):
        self.storeState = 0
        self.userStates = {}

    # database functions to be implemented by child classes
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
    
    def get_store_library(self) -> list:
        """
        Get store library
        """
        raise NotImplementedError
    
    def get_store_item_by_id(self, item_id: int) -> AudioContent:
        """
        Get store item by item id
        """
        raise NotImplementedError
    
    def _create_store_item(self, audioContent:AudioContent) -> AudioContent:
        """
        Create store item
        """
        raise NotImplementedError
    
    def _edit_store_item(self, audioContent:AudioContent) -> bool:
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
    
    def login(self, username: str, password: str) -> User:
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

        return user
    
    def logout(self, session_id) -> bool:
        """
        Logout
        """
        user = self._get_user_by_session_id(session_id)
        if user is None:
            return False
        
        user.session_id = "no_session"
        user.session_timeout = 0
        self.update_session_id(user.user_id, user.session_id, user.session_timeout)
        self.notify_user_change(user.user_id)
        return True
    
    def register(self, username: str, password: str, email:str):
        """
        Register
        """
        user = User.create_new(username, password, email, balance=20000)
        return self._create_user(user)
    
    def _get_user_library_by_id(self, user_id: int) -> list:
        """
        Get user library by user id
        """
        user_content = self._get_user_library(user_id)
        if user_content is None:
            return None
        store_content = self.get_store_library()
        if store_content is None:
            return None
        user_library = []
        store_i = 0
        for item in user_content:
            # find corresponding store item
            while store_i < len(store_content) and store_content[store_i].item_id != item.item_id:
                store_i += 1
            if store_i < len(store_content):
                # create user library item
                audio_user_content = {
                    "rating": item.rating,
                    "progress": item.progress,
                    "purchased": item.purchased,
                    **store_content[store_i].to_dict()
                }
                user_library.append(audio_user_content)
        return user_library
    
    def get_user_library_by_session_id(self, session_id: str) -> list:
        """
        Get user library by session id
        """
        user = self._get_user_by_session_id(session_id)
        if user is None or user.check_session(session_id) is False:
            return None
        return self._get_user_library_by_id(user.user_id)
    
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
            return False
        store_item = self.get_store_item_by_id(item_id)
        if store_item is None:
            return False
        if store_item.price > user.balance:
            return False
        user.balance -= store_item.price
        self.update_user(user)
        user_content = UserContent.create_new(user.user_id, store_item.item_id)
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
        self._update_user_item(user_content)
        self.notify_user_change(user.user_id)
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
        self.update_user_item(user_content)
        self.notify_user_change(user.user_id)
        return True
    

    ### admin functions
    ### always check if user is admin before calling these functions
    def create_store_item(self, session_id: str, item: AudioContent) -> bool:
        """
        Create store item
        Returns true if successful
        """
        # check if user is admin
        if not self.is_admin(session_id):
            return False
        
        ret =  self._create_store_item(item)
        if ret is False:
            return False
        self.notify_store_change()
        return True
    
    def update_store_item(self, session_id: str, item: AudioContent) -> bool:
        """
        Update store item
        Returns true if successful
        """
        # check if user is admin
        if not self.is_admin(session_id):
            return False
        
        ret = self._edit_store_item(item)
        if ret is False:
            return False
        self.notify_store_change()
        return True
    
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
    



    
    
    



