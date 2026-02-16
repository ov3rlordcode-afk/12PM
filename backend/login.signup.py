from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
import sqlite3

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ----------------- DATABASE -----------------
DB_FILE = "users.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute(
        """CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT,
            city TEXT,
            address TEXT
        )"""
    )
    conn.commit()
    conn.close()

init_db()

# ----------------- MODELS -----------------
class SignupModel(BaseModel):
    email: str
    password: str
    role: str
    city: str | None = None
    address: str | None = None

class LoginModel(BaseModel):
    email: str
    password: str

# ----------------- HELPERS -----------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ----------------- ROUTES -----------------
@app.post("/signup")
def signup(user: SignupModel):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    hashed_pw = hash_password(user.password)

    try:
        c.execute(
            "INSERT INTO users (email, password, role, city, address) VALUES (?, ?, ?, ?, ?)",
            (user.email, hashed_pw, user.role, user.city, user.address)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    
    conn.close()
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: LoginModel):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT password, role, city, address FROM users WHERE email = ?", (user.email,))
    row = c.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    hashed_pw, role, city, address = row

    if not verify_password(user.password, hashed_pw):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "email": user.email,
        "role": role,
        "city": city,
        "address": address
    }
