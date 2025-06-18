const API_BASE_URL = 'http://localhost:5000/api';

// API response types
export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  location?: string;
  followers: number;
  following: number;
  projects: number;
  joinDate: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  authorId: string;
  demoUrl?: string;
  githubUrl?: string;
  stars: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  otherParticipant?: {
    _id: string;
    fullName: string;
    username: string;
    avatar?: string;
  };
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  // Authentication APIs
  async register(userData: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    bio?: string;
    skills?: string[];
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    location?: string;
  }): Promise<{ user: User; access_token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    const data = await this.handleResponse<{ user: User; access_token: string }>(response);
    
    // Store token
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
    }
    
    return data;
  }

  async login(email: string, password: string): Promise<{ user: User; access_token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    
    const data = await this.handleResponse<{ user: User; access_token: string }>(response);
    
    // Store token
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
    }
    
    return data;
  }

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<{ user: User }>(response);
  }

  // User APIs
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    pages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async getUserByUsername(username: string): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<{ user: User }>(response);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    return this.handleResponse<{ user: User }>(response);
  }

  async toggleFollow(userId: string): Promise<{ following: boolean }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<{ following: boolean }>(response);
  }

  // Project APIs
  async getProjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    author?: string;
  }): Promise<{
    projects: Project[];
    total: number;
    page: number;
    pages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.author) queryParams.append('author', params.author);

    const response = await fetch(`${API_BASE_URL}/projects?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async createProject(projectData: {
    title: string;
    description: string;
    tags: string[];
    image?: string;
    demoUrl?: string;
    githubUrl?: string;
  }): Promise<{ project: Project }> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    
    return this.handleResponse<{ project: Project }>(response);
  }

  async getProject(projectId: string): Promise<{ project: Project }> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<{ project: Project }>(response);
  }

  async toggleProjectStar(projectId: string): Promise<{ starred: boolean; stars: number }> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/star`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<{ starred: boolean; stars: number }>(response);
  }

  // Messaging APIs
  async getConversations(): Promise<{ conversations: Conversation[] }> {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<{ conversations: Conversation[] }>(response);
  }

  async createConversation(participantId: string): Promise<{ conversation: Conversation }> {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ participantId })
    });
    
    return this.handleResponse<{ conversation: Conversation }>(response);
  }

  async getMessages(conversationId: string): Promise<{ messages: Message[] }> {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<{ messages: Message[] }>(response);
  }

  async sendMessage(conversationId: string, content: string): Promise<{ messageData: Message }> {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    
    return this.handleResponse<{ messageData: Message }>(response);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse(response);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
  }
}

export const apiService = new ApiService();
export default apiService;