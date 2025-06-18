import subprocess
import sys
import platform

def check_mongodb_installation():
    """Check if MongoDB is installed and running"""
    print("🔍 Checking MongoDB Installation...\n")
    
    # Check if MongoDB is installed
    try:
        result = subprocess.run(['mongod', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ MongoDB is installed!")
            version_line = result.stdout.split('\n')[0]
            print(f"   Version: {version_line}")
        else:
            print("❌ MongoDB is not installed or not in PATH")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print("❌ MongoDB is not installed or not in PATH")
        return False
    
    # Check if MongoDB is running
    try:
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=3000)
        client.admin.command('ping')
        print("✅ MongoDB is running!")
        client.close()
        return True
    except Exception as e:
        print("❌ MongoDB is not running!")
        print(f"   Error: {e}")
        return False

def get_mongodb_install_instructions():
    """Get MongoDB installation instructions based on OS"""
    system = platform.system().lower()
    
    print("\n📋 MongoDB Installation Instructions:\n")
    
    if system == "darwin":  # macOS
        print("🍎 macOS:")
        print("1. Install Homebrew (if not installed):")
        print("   /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"")
        print("\n2. Install MongoDB:")
        print("   brew tap mongodb/brew")
        print("   brew install mongodb-community")
        print("\n3. Start MongoDB:")
        print("   brew services start mongodb/brew/mongodb-community")
        
    elif system == "linux":
        print("🐧 Linux (Ubuntu/Debian):")
        print("1. Import MongoDB public key:")
        print("   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -")
        print("\n2. Add MongoDB repository:")
        print("   echo \"deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse\" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list")
        print("\n3. Install MongoDB:")
        print("   sudo apt-get update")
        print("   sudo apt-get install -y mongodb-org")
        print("\n4. Start MongoDB:")
        print("   sudo systemctl start mongod")
        print("   sudo systemctl enable mongod")
        
    elif system == "windows":
        print("🪟 Windows:")
        print("1. Download MongoDB Community Server from:")
        print("   https://www.mongodb.com/try/download/community")
        print("\n2. Run the installer and follow the setup wizard")
        print("\n3. MongoDB should start automatically as a Windows service")
        
    else:
        print("❓ Unknown operating system. Please visit:")
        print("   https://docs.mongodb.com/manual/installation/")
    
    print("\n🌐 Alternative: Use MongoDB Atlas (Cloud)")
    print("1. Go to https://www.mongodb.com/atlas")
    print("2. Create a free account and cluster")
    print("3. Get your connection string")
    print("4. Update MONGO_URI in your .env file")

def main():
    """Main function"""
    if not check_mongodb_installation():
        get_mongodb_install_instructions()
        return False
    return True

if __name__ == "__main__":
    if main():
        print("\n🎉 MongoDB is ready to use!")
    else:
        print("\n⚠️  Please install and start MongoDB before proceeding.")