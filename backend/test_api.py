import requests
import json
from datetime import datetime

# API base URL
BASE_URL = 'http://localhost:5000/api'

class APITester:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.project_id = None
        
    def test_health_check(self):
        """Test if the API is running"""
        print("🔍 Testing Health Check...")
        try:
            response = requests.get(f'{BASE_URL}/health')
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health Check: {data['status']} at {data['timestamp']}")
                return True
            else:
                print(f"❌ Health Check Failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health Check Error: {e}")
            return False
    
    def test_user_registration(self):
        """Test user registration"""
        print("\n👤 Testing User Registration...")
        
        user_data = {
            "fullName": "Test User",
            "username": f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "email": f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
            "password": "testpassword123",
            "bio": "This is a test user for API testing",
            "skills": ["Python", "Flask", "React", "MongoDB"],
            "githubUrl": "https://github.com/testuser",
            "linkedinUrl": "https://linkedin.com/in/testuser",
            "portfolioUrl": "https://testuser.dev",
            "location": "San Francisco, CA"
        }
        
        try:
            response = requests.post(f'{BASE_URL}/auth/register', json=user_data)
            if response.status_code == 201:
                data = response.json()
                self.token = data['access_token']
                self.user_id = data['user']['_id']
                print(f"✅ Registration Successful: {data['user']['fullName']} (@{data['user']['username']})")
                print(f"   User ID: {self.user_id}")
                return True
            else:
                print(f"❌ Registration Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Registration Error: {e}")
            return False
    
    def test_user_login(self):
        """Test user login with existing credentials"""
        print("\n🔐 Testing User Login...")
        
        # Use a test account (you might need to create this manually first)
        login_data = {
            "email": "test@example.com",
            "password": "testpassword123"
        }
        
        try:
            response = requests.post(f'{BASE_URL}/auth/login', json=login_data)
            if response.status_code == 200:
                data = response.json()
                self.token = data['access_token']
                self.user_id = data['user']['_id']
                print(f"✅ Login Successful: {data['user']['fullName']}")
                return True
            else:
                print(f"❌ Login Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Login Error: {e}")
            return False
    
    def test_get_current_user(self):
        """Test getting current user info"""
        print("\n👤 Testing Get Current User...")
        
        if not self.token:
            print("❌ No token available")
            return False
        
        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            response = requests.get(f'{BASE_URL}/auth/me', headers=headers)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Current User: {data['user']['fullName']} (@{data['user']['username']})")
                return True
            else:
                print(f"❌ Get Current User Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Get Current User Error: {e}")
            return False
    
    def test_create_project(self):
        """Test creating a project"""
        print("\n📁 Testing Create Project...")
        
        if not self.token:
            print("❌ No token available")
            return False
        
        project_data = {
            "title": f"Test Project {datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "description": "This is a test project created via API testing. It demonstrates the project creation functionality.",
            "tags": ["React", "Node.js", "MongoDB", "API"],
            "demoUrl": "https://demo.example.com",
            "githubUrl": "https://github.com/testuser/test-project"
        }
        
        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            response = requests.post(f'{BASE_URL}/projects', json=project_data, headers=headers)
            if response.status_code == 201:
                data = response.json()
                self.project_id = data['project']['_id']
                print(f"✅ Project Created: {data['project']['title']}")
                print(f"   Project ID: {self.project_id}")
                return True
            else:
                print(f"❌ Create Project Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Create Project Error: {e}")
            return False
    
    def test_get_projects(self):
        """Test getting projects list"""
        print("\n📋 Testing Get Projects...")
        
        try:
            response = requests.get(f'{BASE_URL}/projects?page=1&limit=5')
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Projects Retrieved: {len(data['projects'])} projects")
                print(f"   Total: {data['total']}, Pages: {data['pages']}")
                if data['projects']:
                    print(f"   First project: {data['projects'][0]['title']}")
                return True
            else:
                print(f"❌ Get Projects Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Get Projects Error: {e}")
            return False
    
    def test_get_users(self):
        """Test getting users list"""
        print("\n👥 Testing Get Users...")
        
        try:
            response = requests.get(f'{BASE_URL}/users?page=1&limit=5')
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Users Retrieved: {len(data['users'])} users")
                print(f"   Total: {data['total']}, Pages: {data['pages']}")
                if data['users']:
                    print(f"   First user: {data['users'][0]['fullName']} (@{data['users'][0]['username']})")
                return True
            else:
                print(f"❌ Get Users Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Get Users Error: {e}")
            return False
    
    def test_star_project(self):
        """Test starring a project"""
        print("\n⭐ Testing Star Project...")
        
        if not self.token or not self.project_id:
            print("❌ No token or project ID available")
            return False
        
        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            response = requests.post(f'{BASE_URL}/projects/{self.project_id}/star', headers=headers)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Project Star Toggled: Starred={data['starred']}, Stars={data['stars']}")
                return True
            else:
                print(f"❌ Star Project Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Star Project Error: {e}")
            return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting API Tests...\n")
        
        tests = [
            self.test_health_check,
            self.test_user_registration,
            self.test_get_current_user,
            self.test_create_project,
            self.test_get_projects,
            self.test_get_users,
            self.test_star_project
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print(f"\n📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Your API is working correctly.")
        else:
            print("⚠️  Some tests failed. Check the output above for details.")
        
        return passed == total

if __name__ == "__main__":
    tester = APITester()
    tester.run_all_tests()