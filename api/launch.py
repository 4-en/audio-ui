from api import AudioAPI
from NoDBManager import NoDBManager

def main():
    audioManager = NoDBManager()
    api = AudioAPI(audioManager)
    api.run()

if __name__ == "__main__":
    main()