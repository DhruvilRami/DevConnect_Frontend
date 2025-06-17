# DevConnect Backend API

A comprehensive Flask-based REST API for the DevConnect developer collaboration platform.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **User Management**: Profile creation, updates, and user discovery
- **Project Management**: Create, read, update projects with tagging and search
- **Social Features**: Follow/unfollow users, star projects
- **Real-time Messaging**: Conversation management and messaging system
- **File Uploads**: Support for project images and user avatars
- **Search & Filtering**: Advanced search capabilities across users and projects

## Tech Stack

- **Framework**: Flask 2.3.3
- **Database**: MongoDB with PyMongo
- **Authentication**: Flask-JWT-Extended
- **File Handling**: Werkzeug, Pillow
- **CORS**: Flask-CORS

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `devconnect`

5. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Initialize Database**
   ```bash
   python models.py
   ```

7. **Run the application**
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users` - Get all users (with pagination and search)
- `GET /api/users/<username>` - Get user by username
- `PUT /api/users/<user_id>` - Update user profile
- `POST /api/users/<user_id>/follow` - Follow/unfollow user

### Projects
- `GET /api/projects` - Get all projects (with pagination, search, filters)
- `POST /api/projects` - Create new project
- `GET /api/projects/<project_id>` - Get project details
- `POST /api/projects/<project_id>/star` - Star/unstar project

### Messaging
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/<conversation_id>/messages` - Get conversation messages
- `POST /api/conversations/<conversation_id>/messages` - Send message

### Health Check
- `GET /api/health` - API health status

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  bio: String,
  avatar: String,
  skills: [String],
  githubUrl: String,
  linkedinUrl: String,
  portfolioUrl: String,
  location: String,
  followers: Number,
  following: Number,
  projects: Number,
  joinDate: Date,
  isActive: Boolean
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  image: String,
  tags: [String],
  authorId: ObjectId,
  author: {
    name: String,
    username: String,
    avatar: String
  },
  demoUrl: String,
  githubUrl: String,
  stars: Number,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,
  senderId: ObjectId,
  senderName: String,
  content: String,
  createdAt: Date,
  isRead: Boolean
}
```

## Security Features

- Password hashing with Werkzeug
- JWT token authentication
- CORS protection
- Input validation and sanitization
- File upload restrictions
- Rate limiting ready (can be added with Flask-Limiter)

## Performance Optimizations

- Database indexing for fast queries
- Pagination for large datasets
- Image compression for uploads
- Efficient aggregation pipelines

## Development

### Running Tests
```bash
# Add your test commands here
python -m pytest tests/
```

### Code Style
```bash
# Format code with black
black .

# Lint with flake8
flake8 .
```

## Deployment

### Environment Variables for Production
```bash
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-production-jwt-secret
MONGO_URI=your-production-mongodb-uri
FLASK_ENV=production
```

### Docker Deployment
```dockerfile
# Dockerfile example
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "run.py"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.