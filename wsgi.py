import os
from dotenv import load_dotenv
load_dotenv()
from backend import create_app

app = create_app(os.environ.get("FLASK_ENV", "production"))
