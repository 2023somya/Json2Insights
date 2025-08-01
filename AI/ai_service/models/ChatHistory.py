from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

class ChatHistory:
    def __init__(self, db):
        self.collection = db["chat_history"]
    
    def create_chat(self, user_id, messages):
        chat_data = {
            "user_id": user_id,
            "messages": messages,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = self.collection.insert_one(chat_data)
        return str(result.inserted_id)
    
    def update_chat(self, chat_id, new_messages):
        self.collection.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$set": {
                    "messages": new_messages,
                    "updated_at": datetime.utcnow()
                }
            }
        )
    
    def get_chat(self, chat_id):
        return self.collection.find_one({"_id": ObjectId(chat_id)})
    
    def get_user_chats(self, user_id):
        return list(self.collection.find({"user_id": user_id}).sort("updated_at", -1))
    
    def delete_chat(self, chat_id):
        self.collection.delete_one({"_id": ObjectId(chat_id)})