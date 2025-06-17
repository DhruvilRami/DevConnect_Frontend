from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import os
import uuid
from functools import wraps

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
jwt = JWTManager(app)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['devconnect']

# Collections
users_collection = db['users']
projects_collection = db['projects']
messages_collection = db['messages']
conversations_collection = db['conversations']
follows_collection = db['follows']

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Helper functions
def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc is None:
        return None
    doc['_id'] = str(doc['_id'])
    return doc

def serialize_docs(docs):
    """Convert list of MongoDB documents to JSON serializable format"""
    return [serialize_doc(doc) for doc in docs]

# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['fullName', 'username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if users_collection.find_one({'$or': [{'email': data['email']}, {'username': data['username']}]}):
            return jsonify({'error': 'User with this email or username already exists'}), 400
        
        # Create new user
        user_data = {
            'fullName': data['fullName'],
            'username': data['username'],
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'bio': data.get('bio', ''),
            'avatar': data.get('avatar', ''),
            'skills': data.get('skills', []),
            'githubUrl': data.get('githubUrl', ''),
            'linkedinUrl': data.get('linkedinUrl', ''),
            'portfolioUrl': data.get('portfolioUrl', ''),
            'location': data.get('location', ''),
            'followers': 0,
            'following': 0,
            'projects': 0,
            'joinDate': datetime.utcnow(),
            'isActive': True
        }
        
        result = users_collection.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        # Remove password from response
        del user_data['password']
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user_data,
            'access_token': access_token
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        # Remove password from response
        user = serialize_doc(user)
        del user['password']
        
        return jsonify({
            'message': 'Login successful',
            'user': user,
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user = serialize_doc(user)
        del user['password']
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User routes
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        search = request.args.get('search', '')
        
        skip = (page - 1) * limit
        
        # Build query
        query = {}
        if search:
            query['$or'] = [
                {'fullName': {'$regex': search, '$options': 'i'}},
                {'username': {'$regex': search, '$options': 'i'}},
                {'skills': {'$regex': search, '$options': 'i'}}
            ]
        
        # Get users
        users = list(users_collection.find(query, {'password': 0}).skip(skip).limit(limit))
        total = users_collection.count_documents(query)
        
        return jsonify({
            'users': serialize_docs(users),
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<username>', methods=['GET'])
def get_user_by_username(username):
    try:
        user = users_collection.find_one({'username': username}, {'password': 0})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': serialize_doc(user)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user is updating their own profile
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Fields that can be updated
        allowed_fields = ['fullName', 'bio', 'skills', 'githubUrl', 'linkedinUrl', 'portfolioUrl', 'location']
        update_data = {field: data[field] for field in allowed_fields if field in data}
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        # Update user
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'User not found'}), 404
        
        # Get updated user
        user = users_collection.find_one({'_id': ObjectId(user_id)}, {'password': 0})
        
        return jsonify({
            'message': 'User updated successfully',
            'user': serialize_doc(user)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Project routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 12))
        search = request.args.get('search', '')
        tag = request.args.get('tag', '')
        author = request.args.get('author', '')
        
        skip = (page - 1) * limit
        
        # Build query
        query = {}
        if search:
            query['$or'] = [
                {'title': {'$regex': search, '$options': 'i'}},
                {'description': {'$regex': search, '$options': 'i'}},
                {'tags': {'$regex': search, '$options': 'i'}}
            ]
        
        if tag and tag != 'All':
            query['tags'] = {'$in': [tag]}
        
        if author:
            query['author.username'] = author
        
        # Get projects with author info
        pipeline = [
            {'$match': query},
            {'$lookup': {
                'from': 'users',
                'localField': 'authorId',
                'foreignField': '_id',
                'as': 'authorInfo'
            }},
            {'$unwind': '$authorInfo'},
            {'$addFields': {
                'author.name': '$authorInfo.fullName',
                'author.username': '$authorInfo.username',
                'author.avatar': '$authorInfo.avatar'
            }},
            {'$project': {'authorInfo': 0}},
            {'$sort': {'createdAt': -1}},
            {'$skip': skip},
            {'$limit': limit}
        ]
        
        projects = list(projects_collection.aggregate(pipeline))
        total = projects_collection.count_documents(query)
        
        return jsonify({
            'projects': serialize_docs(projects),
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'tags']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get user info
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Create project
        project_data = {
            'title': data['title'],
            'description': data['description'],
            'image': data.get('image', ''),
            'tags': data['tags'],
            'authorId': ObjectId(user_id),
            'author': {
                'name': user['fullName'],
                'username': user['username'],
                'avatar': user.get('avatar', '')
            },
            'demoUrl': data.get('demoUrl', ''),
            'githubUrl': data.get('githubUrl', ''),
            'stars': 0,
            'views': 0,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = projects_collection.insert_one(project_data)
        project_data['_id'] = str(result.inserted_id)
        
        # Update user's project count
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$inc': {'projects': 1}}
        )
        
        return jsonify({
            'message': 'Project created successfully',
            'project': project_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    try:
        project = projects_collection.find_one({'_id': ObjectId(project_id)})
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Increment view count
        projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$inc': {'views': 1}}
        )
        
        project['views'] += 1
        
        return jsonify({'project': serialize_doc(project)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<project_id>/star', methods=['POST'])
@jwt_required()
def toggle_project_star(project_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if project exists
        project = projects_collection.find_one({'_id': ObjectId(project_id)})
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Check if user already starred this project
        star_exists = db['stars'].find_one({
            'userId': ObjectId(user_id),
            'projectId': ObjectId(project_id)
        })
        
        if star_exists:
            # Remove star
            db['stars'].delete_one({
                'userId': ObjectId(user_id),
                'projectId': ObjectId(project_id)
            })
            projects_collection.update_one(
                {'_id': ObjectId(project_id)},
                {'$inc': {'stars': -1}}
            )
            starred = False
        else:
            # Add star
            db['stars'].insert_one({
                'userId': ObjectId(user_id),
                'projectId': ObjectId(project_id),
                'createdAt': datetime.utcnow()
            })
            projects_collection.update_one(
                {'_id': ObjectId(project_id)},
                {'$inc': {'stars': 1}}
            )
            starred = True
        
        # Get updated project
        updated_project = projects_collection.find_one({'_id': ObjectId(project_id)})
        
        return jsonify({
            'message': 'Star toggled successfully',
            'starred': starred,
            'stars': updated_project['stars']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Follow system routes
@app.route('/api/users/<user_id>/follow', methods=['POST'])
@jwt_required()
def toggle_follow(user_id):
    try:
        current_user_id = get_jwt_identity()
        
        if current_user_id == user_id:
            return jsonify({'error': 'Cannot follow yourself'}), 400
        
        # Check if users exist
        current_user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        target_user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not current_user or not target_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if already following
        follow_exists = follows_collection.find_one({
            'followerId': ObjectId(current_user_id),
            'followingId': ObjectId(user_id)
        })
        
        if follow_exists:
            # Unfollow
            follows_collection.delete_one({
                'followerId': ObjectId(current_user_id),
                'followingId': ObjectId(user_id)
            })
            
            # Update counts
            users_collection.update_one(
                {'_id': ObjectId(current_user_id)},
                {'$inc': {'following': -1}}
            )
            users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$inc': {'followers': -1}}
            )
            
            following = False
        else:
            # Follow
            follows_collection.insert_one({
                'followerId': ObjectId(current_user_id),
                'followingId': ObjectId(user_id),
                'createdAt': datetime.utcnow()
            })
            
            # Update counts
            users_collection.update_one(
                {'_id': ObjectId(current_user_id)},
                {'$inc': {'following': 1}}
            )
            users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$inc': {'followers': 1}}
            )
            
            following = True
        
        return jsonify({
            'message': 'Follow status updated',
            'following': following
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Messaging routes
@app.route('/api/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    try:
        user_id = get_jwt_identity()
        
        # Get conversations for the user
        pipeline = [
            {'$match': {'participants': ObjectId(user_id)}},
            {'$lookup': {
                'from': 'users',
                'localField': 'participants',
                'foreignField': '_id',
                'as': 'participantInfo'
            }},
            {'$addFields': {
                'otherParticipant': {
                    '$arrayElemAt': [
                        {'$filter': {
                            'input': '$participantInfo',
                            'cond': {'$ne': ['$$this._id', ObjectId(user_id)]}
                        }},
                        0
                    ]
                }
            }},
            {'$sort': {'lastMessageAt': -1}}
        ]
        
        conversations = list(conversations_collection.aggregate(pipeline))
        
        return jsonify({'conversations': serialize_docs(conversations)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations', methods=['POST'])
@jwt_required()
def create_conversation():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        participant_id = data.get('participantId')
        if not participant_id:
            return jsonify({'error': 'Participant ID is required'}), 400
        
        if user_id == participant_id:
            return jsonify({'error': 'Cannot create conversation with yourself'}), 400
        
        # Check if conversation already exists
        existing_conversation = conversations_collection.find_one({
            'participants': {'$all': [ObjectId(user_id), ObjectId(participant_id)]}
        })
        
        if existing_conversation:
            return jsonify({'conversation': serialize_doc(existing_conversation)}), 200
        
        # Create new conversation
        conversation_data = {
            'participants': [ObjectId(user_id), ObjectId(participant_id)],
            'createdAt': datetime.utcnow(),
            'lastMessageAt': datetime.utcnow(),
            'lastMessage': ''
        }
        
        result = conversations_collection.insert_one(conversation_data)
        conversation_data['_id'] = str(result.inserted_id)
        
        return jsonify({
            'message': 'Conversation created successfully',
            'conversation': conversation_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations/<conversation_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(conversation_id):
    try:
        user_id = get_jwt_identity()
        
        # Verify user is part of the conversation
        conversation = conversations_collection.find_one({
            '_id': ObjectId(conversation_id),
            'participants': ObjectId(user_id)
        })
        
        if not conversation:
            return jsonify({'error': 'Conversation not found'}), 404
        
        # Get messages
        messages = list(messages_collection.find({
            'conversationId': ObjectId(conversation_id)
        }).sort('createdAt', 1))
        
        return jsonify({'messages': serialize_docs(messages)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations/<conversation_id>/messages', methods=['POST'])
@jwt_required()
def send_message(conversation_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        content = data.get('content')
        if not content:
            return jsonify({'error': 'Message content is required'}), 400
        
        # Verify user is part of the conversation
        conversation = conversations_collection.find_one({
            '_id': ObjectId(conversation_id),
            'participants': ObjectId(user_id)
        })
        
        if not conversation:
            return jsonify({'error': 'Conversation not found'}), 404
        
        # Get sender info
        sender = users_collection.find_one({'_id': ObjectId(user_id)})
        
        # Create message
        message_data = {
            'conversationId': ObjectId(conversation_id),
            'senderId': ObjectId(user_id),
            'senderName': sender['fullName'],
            'content': content,
            'createdAt': datetime.utcnow(),
            'isRead': False
        }
        
        result = messages_collection.insert_one(message_data)
        message_data['_id'] = str(result.inserted_id)
        
        # Update conversation
        conversations_collection.update_one(
            {'_id': ObjectId(conversation_id)},
            {
                '$set': {
                    'lastMessage': content,
                    'lastMessageAt': datetime.utcnow()
                }
            }
        )
        
        return jsonify({
            'message': 'Message sent successfully',
            'messageData': message_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow()}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)