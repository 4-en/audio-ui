# contains backend logic for audio manager
import hashlib

class IAudioManager:

    def __init__(self):
        self.storeState = 0
        self.userStates = {}

    # database functions to be implemented by child classes
    def _create_user(self, username: str, passhash: str, salt: str, email: str, balance:int, admin: bool) -> dict:
        """
        Create user
        """
        raise NotImplementedError
    
    def edit_user(self, user_id: int, username: str, passhash: str, salt: str, email: str, balance:int, admin: bool) -> bool:
        """
        Edit user
        """
        raise NotImplementedError
    
    def delete_user(self, user_id: int) -> bool:
        """
        Delete user
        """
        raise NotImplementedError
    
    def get_user_by_name(self, username: str) -> dict:
        """
        Get user by username
        """
        raise NotImplementedError
    
    def get_user_by_id(self, user_id: int) -> dict:
        """
        Get user by user id
        """
        raise NotImplementedError
    
    def get_user_by_session_id(self, session_id: str) -> dict:
        """
        Get user by session id
        """
        raise NotImplementedError
    
    def create_user_item(self, user_id: int, item_id: int) -> dict:
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
    
    def get_store_item_by_id(self, item_id: int) -> dict:
        """
        Get store item by item id
        """
        raise NotImplementedError
    
    def create_store_item(self, name: str, price: int, description: str) -> dict:
        """
        Create store item
        """
        raise NotImplementedError
    
    def edit_store_item(self, item_id: int, name: str, price: int, description: str) -> bool:
        """
        Edit store item
        """
        raise NotImplementedError
    
    def delete_store_item(self, item_id: int) -> bool:
        """
        Delete store item
        """
        raise NotImplementedError
    
    def create_author(self, first_name: str, last_name: str) -> dict:
        """
        Create author
        """
        raise NotImplementedError
    
    def edit_author(self, author_id: int, first_name: str, last_name: str) -> bool:
        """
        Edit author
        """
        raise NotImplementedError
    
    def delete_author(self, author_id: int) -> bool:
        """
        Delete author
        """
        raise NotImplementedError
    
    def get_author_by_id(self, author_id: int) -> dict:
        """
        Get author by author id
        """
        raise NotImplementedError
    
    def get_author_by_name(self, first_name: str, last_name: str) -> dict:
        """
        Get author by name
        """
        raise NotImplementedError
    
    
    

    
    # audio manager functions that can use database functions
    def _store_change(self):
        """
        Called when store changes
        Used to update store store in ui
        """
        self.storeState += 1

    def _user_change(self, username: str):
        """
        Called when user changes
        Used to update user lib in ui
        """
        if username not in self.userStates:
            self.userStates[username] = 0
        self.userStates[username] += 1

    def get_store_state(self) -> int:
        """
        Get store state"""
        return self.storeState
    
    def get_user_state(self, username: str) -> int:
        """
        Get user state
        """
        if username not in self.userStates:
            self.userStates[username] = 0
        return self.userStates[username]
    
    
    



