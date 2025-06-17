from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['devconnect']

# Collections
users_collection = db['users']
projects_collection = db['projects']
messages_collection = db['messages']
conversations_collection = db['conversations']
follows_collection = db['follows']
stars_collection = db['stars']

# Create indexes for better performance
def create_indexes():
    """Create database indexes for better query performance"""
    
    # Users indexes
    users_collection.create_index([("email", 1)], unique=True)
    users_collection.create_index([("username", 1)], unique=True)
    users_collection.create_index([("fullName", "text"), ("username", "text"), ("skills", "text")])
    
    # Projects indexes
    projects_collection.create_index([("authorId", 1)])
    projects_collection.create_index([("tags", 1)])
    projects_collection.create_index([("createdAt", -1)])
    projects_collection.create_index([("title", "text"), ("description", "text"), ("tags", "text")])
    
    # Messages indexes
    messages_collection.create_index([("conversationId", 1), ("createdAt", 1)])
    messages_collection.create_index([("senderId", 1)])
    
    # Conversations indexes
    conversations_collection.create_index([("participants", 1)])
    conversations_collection.create_index([("lastMessageAt", -1)])
    
    # Follows indexes
    follows_collection.create_index([("followerId", 1), ("followingId", 1)], unique=True)
    follows_collection.create_index([("followerId", 1)])
    follows_collection.create_index([("followingId", 1)])
    
    # Stars indexes
    stars_collection.create_index([("userId", 1), ("projectId", 1)], unique=True)
    stars_collection.create_index([("projectId", 1)])

# User model functions
class UserModel:
    @staticmethod
    def create_user(user_data):
        """Create a new user"""
        user_data['createdAt'] = datetime.utcnow()
        user_data['updatedAt'] = datetime.utcnow()
        result = users_collection.insert_one(user_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return users_collection.find_one({'_id': ObjectId(user_id)})
    
    @staticmethod
    def get_user_by_email(email):
        """Get user by email"""
        return users_collection.find_one({'email': email})
    
    @staticmethod
    def get_user_by_username(username):
        """Get user by username"""
        return users_collection.find_one({'username': username})
    
    @staticmethod
    def update_user(user_id, update_data):
        """Update user data"""
        update_data['updatedAt'] = datetime.utcnow()
        return users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )

# Project model functions
class ProjectModel:
    @staticmethod
    def create_project(project_data):
        """Create a new project"""
        project_data['createdAt'] = datetime.utcnow()
        project_data['updatedAt'] = datetime.utcnow()
        result = projects_collection.insert_one(project_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_project_by_id(project_id):
        """Get project by ID"""
        return projects_collection.find_one({'_id': ObjectId(project_id)})
    
    @staticmethod
    def get_projects_by_author(author_id, page=1, limit=10):
        """Get projects by author"""
        skip = (page - 1) * limit
        projects = list(projects_collection.find({'authorId': ObjectId(author_id)})
                       .sort('createdAt', -1)
                       .skip(skip)
                       .limit(limit))
        total = projects_collection.count_documents({'authorId': ObjectId(author_id)})
        return projects, total
    
    @staticmethod
    def search_projects(query, page=1, limit=12):
        """Search projects"""
        skip = (page - 1) * limit
        search_filter = {}
        
        if query:
            search_filter['$text'] = {'$search': query}
        
        projects = list(projects_collection.find(search_filter)
                       .sort('createdAt', -1)
                       .skip(skip)
                       .limit(limit))
        total = projects_collection.count_documents(search_filter)
        return projects, total

# Message model functions
class MessageModel:
    @staticmethod
    def create_message(message_data):
        """Create a new message"""
        message_data['createdAt'] = datetime.utcnow()
        result = messages_collection.insert_one(message_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_conversation_messages(conversation_id):
        """Get messages for a conversation"""
        return list(messages_collection.find({'conversationId': ObjectId(conversation_id)})
                   .sort('createdAt', 1))

# Conversation model functions
class ConversationModel:
    @staticmethod
    def create_conversation(participants):
        """Create a new conversation"""
        conversation_data = {
            'participants': [ObjectId(p) for p in participants],
            'createdAt': datetime.utcnow(),
            'lastMessageAt': datetime.utcnow(),
            'lastMessage': ''
        }
        result = conversations_collection.insert_one(conversation_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_user_conversations(user_id):
        """Get conversations for a user"""
        return list(conversations_collection.find({'participants': ObjectId(user_id)})
                   .sort('lastMessageAt', -1))

# Follow model functions
class FollowModel:
    @staticmethod
    def follow_user(follower_id, following_id):
        """Follow a user"""
        follow_data = {
            'followerId': ObjectId(follower_id),
            'followingId': ObjectId(following_id),
            'createdAt': datetime.utcnow()
        }
        return follows_collection.insert_one(follow_data)
    
    @staticmethod
    def unfollow_user(follower_id, following_id):
        """Unfollow a user"""
        return follows_collection.delete_one({
            'followerId': ObjectId(follower_id),
            'followingId': ObjectId(following_id)
        })
    
    @staticmethod
    def is_following(follower_id, following_id):
        """Check if user is following another user"""
        return follows_collection.find_one({
            'followerId': ObjectId(follower_id),
            'followingId': ObjectId(following_id)
        }) is not None

# Initialize database indexes
if __name__ == '__main__':
    create_indexes()
    print("Database indexes created successfully!")