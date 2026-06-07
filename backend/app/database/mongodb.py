import motor.motor_asyncio

from app.core.config import MONGODB_URL

client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGODB_URL
)

database = client.kalren_db