from api import AudioAPI
from NoDBManager import NoDBManager
from MySQLManager import MySQLManager

def main():
    audioManager = MySQLManager()
    api = AudioAPI(audioManager)
    api.run()

if __name__ == "__main__":
    main()