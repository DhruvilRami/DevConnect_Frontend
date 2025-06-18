import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from models import create_indexes
import json

def test_mongodb_connection():
    """Test MongoDB connection"""
    print("🔍 Testing MongoDB Connection...")
    
    # Try to connect to MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
        # Test the connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # List databases
        db_list = client.list_database_names()
        print(f"📋 Available databases: {db_list}")
        
        # Check if devconnect database exists
        if 'devconnect' in db_list:
            print("✅ DevConnect database found!")
        else:
            print("📝 DevConnect database will be created automatically")
        
        return True, client
        
    except ConnectionFailure:
        print("❌ MongoDB connection failed! Is MongoDB running?")
        return False, None
    except ServerSelectionTimeoutError:
        print("❌ MongoDB server selection timeout! Check if MongoDB is running on localhost:27017")
        return False, None
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        return False, None

def setup_database():
    """Set up the database with indexes and sample data"""
    print("\n🛠️  Setting up database...")
    
    success, client = test_mongodb_connection()
    if not success:
        return False
    
    try:
        # Create indexes
        print("📊 Creating database indexes...")
        create_indexes()
        print("✅ Database indexes created successfully!")
        
        # Get database
        db = client['devconnect']
        
        # Check collections
        collections = db.list_collection_names()
        print(f"📋 Collections: {collections}")
        
        # Add sample data if collections are empty
        if 'users' not in collections or db.users.count_documents({}) == 0:
            print("📝 Adding sample data...")
            add_sample_data(db)
        
        return True
        
    except Exception as e:
        print(f"❌ Database setup error: {e}")
        return False
    finally:
        if client:
            client.close()

def add_sample_data(db):
    """Add sample data to the database"""
    from werkzeug.security import generate_password_hash
    from datetime import datetime
    from bson import ObjectId
    
    # Sample users
    sample_users = [
        {
            "fullName": "John Doe",
            "username": "johndoe",
            "email": "john@example.com",
            "password": generate_password_hash("password123"),
            "bio": "Full-stack developer passionate about building innovative solutions",
            "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
            "skills": ["React", "Node.js", "Python", "MongoDB", "TypeScript"],
            "githubUrl": "https://github.com/johndoe",
            "linkedinUrl": "https://linkedin.com/in/johndoe",
            "portfolioUrl": "https://johndoe.dev",
            "location": "San Francisco, CA",
            "followers": 0,
            "following": 0,
            "projects": 0,
            "joinDate": datetime.utcnow(),
            "isActive": True
        },
        {
            "fullName": "Sarah Chen",
            "username": "sarahchen",
            "email": "sarah@example.com",
            "password": generate_password_hash("password123"),
            "bio": "Frontend developer specializing in React and modern web technologies",
            "avatar": "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
            "skills": ["React", "TypeScript", "CSS", "JavaScript", "Vue.js"],
            "githubUrl": "https://github.com/sarahchen",
            "linkedinUrl": "https://linkedin.com/in/sarahchen",
            "portfolioUrl": "https://sarahchen.dev",
            "location": "New York, NY",
            "followers": 0,
            "following": 0,
            "projects": 0,
            "joinDate": datetime.utcnow(),
            "isActive": True
        }
    ]
    
    # Insert sample users
    user_results = db.users.insert_many(sample_users)
    print(f"✅ Added {len(user_results.inserted_ids)} sample users")
    
    # Sample projects
    sample_projects = [
        {
            "title": "E-commerce Platform",
            "description": "Full-stack e-commerce solution with React and Node.js",
            "image": "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400",
            "tags": ["React", "Node.js", "MongoDB", "Stripe"],
            "authorId": user_results.inserted_ids[0],
            "author": {
                "name": "John Doe",
                "username": "johndoe",
                "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            "demoUrl": "https://demo.example.com",
            "githubUrl": "https://github.com/johndoe/ecommerce",
            "stars": 0,
            "views": 0,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "title": "Task Management App",
            "description": "Collaborative task management with real-time updates",
            "image": "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
            "tags": ["React", "Firebase", "Redux"],
            "authorId": user_results.inserted_ids[1],
            "author": {
                "name": "Sarah Chen",
                "username": "sarahchen",
                "avatar": "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            "demoUrl": "https://taskapp.example.com",
            "githubUrl": "https://github.com/sarahchen/taskapp",
            "stars": 0,
            "views": 0,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    # Insert sample projects
    project_results = db.projects.insert_many(sample_projects)
    print(f"✅ Added {len(project_results.inserted_ids)} sample projects")
    
    # Update user project counts
    db.users.update_one({"_id": user_results.inserted_ids[0]}, {"$set": {"projects": 1}})
    db.users.update_one({"_id": user_results.inserted_ids[1]}, {"$set": {"projects": 1}})

def check_requirements():
    """Check if all requirements are installed"""
    print("🔍 Checking requirements...")
    
    required_packages = [
        'flask',
        'flask-cors',
        'flask-jwt-extended',
        'pymongo',
        'werkzeug',
        'python-dotenv',
        'pillow'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("💡 Run: pip install -r requirements.txt")
        return False
    else:
        print("✅ All required packages are installed!")
        return True

def main():
    """Main setup function"""
    print("🚀 DevConnect Database Setup\n")
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Setup database
    if setup_database():
        print("\n🎉 Database setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Start the Flask server: python run.py")
        print("2. Test the APIs: python test_api.py")
        print("3. Open your frontend and try logging in with:")
        print("   Email: john@example.com")
        print("   Password: password123")
    else:
        print("\n❌ Database setup failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()