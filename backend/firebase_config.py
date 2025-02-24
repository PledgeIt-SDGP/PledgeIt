import firebase_admin
from firebase_admin import auth, credentials

cred = credentials.Certificate("path/to/firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

def verify_firebase_token(token: str):
    try:
        return auth.verify_id_token(token)
    except:
        return None
