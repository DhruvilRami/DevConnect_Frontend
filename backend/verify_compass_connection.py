import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import json
from datetime import datetime

def verify_compass_connection():
    """Verify connection to MongoDB that's accessible via Compass"""
    print("🧭 Verifying MongoDB Compass Connection...\n")
    
    # Connection string for local MongoDB (same as Compass uses)
    mongo_uri = "mongodb://localhost:27017/devconnect"
    
    try:
        # Connect to MongoDB
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test the connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # Get database
        db = client['devconnect']
        
        # List all collections
        collections = db.list_collection_names()
        print(f"📋 Collections in devconnect database: {collections}")
        
        # Check each collection
        for collection_name in ['users', 'projects', 'messages', 'conversations', 'follows', 'stars']:
            if collection_name in collections:
                count = db[collection_name].count_documents({})
                print(f"   📊 {collection_name}: {count} documents")
            else:
                print(f"   📝 {collection_name}: Collection will be created when needed")
        
        # Test a simple query
        print("\n🔍 Testing database operations...")
        
        # Insert a test document
        test_collection = db['test_connection']
        test_doc = {
            "test": True,
            "timestamp": datetime.utcnow(),
            "message": "Connection test from Python"
        }
        
        result = test_collection.insert_one(test_doc)
        print(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # Read the test document
        found_doc = test_collection.find_one({"_id": result.inserted_id})
        if found_doc:
            print("✅ Test document retrieved successfully")
        
        # Clean up test document
        test_collection.delete_one({"_id": result.inserted_id})
        print("✅ Test document cleaned up")
        
        # Drop test collection
        test_collection.drop()
        print("✅ Test collection removed")
        
        print("\n🎉 MongoDB connection verified! Your database is ready.")
        print("💡 You can view and manage your data using MongoDB Compass at mongodb://localhost:27017")
        
        return True
        
    except ConnectionFailure as e:
        print(f"❌ Connection failed: {e}")
        print("\n🔧 Troubleshooting steps:")
        print("1. Make sure MongoDB is running locally")
        print("2. Check if MongoDB Compass can connect to mongodb://localhost:27017")
        print("3. Verify no firewall is blocking port 27017")
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
        
    finally:
        if 'client' in locals():
            client.close()

def show_compass_tips():
    """Show tips for using MongoDB Compass with this project"""
    print("\n🧭 MongoDB Compass Tips:")
    print("=" * 50)
    print("📍 Connection String: mongodb://localhost:27017")
    print("🗄️  Database Name: devconnect")
    print("\n📋 Collections you'll see:")
    print("   • users - User profiles and authentication")
    print("   • projects - Project showcases")
    print("   • messages - Chat messages")
    print("   • conversations - Chat conversations")
    print("   • follows - User follow relationships")
    print("   • stars - Project stars/likes")
    print("\n🔍 Useful Compass Features:")
    print("   • Schema tab - View document structure")
    print("   • Indexes tab - Monitor database performance")
    print("   • Explain Plan - Optimize queries")
    print("   • Real-time monitoring - Watch data changes")
    print("\n💡 Pro Tips:")
    print("   • Use filters to search: {username: 'johndoe'}")
    print("   • Export data as JSON for backups")
    print("   • Use aggregation pipeline for complex queries")

if __name__ == "__main__":
    if verify_compass_connection():
        show_compass_tips()
    else:
        print("\n❌ Please ensure MongoDB is running and accessible via Compass")