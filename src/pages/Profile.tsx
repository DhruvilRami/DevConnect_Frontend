import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Github, Linkedin, Globe, Mail, Users, FolderOpen, Star, Eye, Plus, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { username } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  
  // Mock data - in real app, this would come from API
  const profileData = {
    id: '1',
    username: 'johndoe',
    fullName: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Full-stack developer passionate about building innovative solutions that make a difference. Love working with React, Node.js, and modern web technologies.',
    location: 'San Francisco, CA',
    joinDate: 'March 2023',
    githubUrl: 'https://github.com/johndoe',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    portfolioUrl: 'https://johndoe.dev',
    email: 'john@example.com',
    followers: 156,
    following: 89,
    projects: 12,
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'AWS', 'Docker', 'GraphQL']
  };

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      stars: 24,
      views: 156,
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/johndoe/ecommerce'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management with real-time updates',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'Firebase', 'Redux'],
      stars: 31,
      views: 203,
      demoUrl: 'https://taskapp.example.com',
      githubUrl: 'https://github.com/johndoe/taskapp'
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'Beautiful weather dashboard with location-based forecasts',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'TypeScript', 'API'],
      stars: 18,
      views: 89,
      demoUrl: 'https://weather.example.com',
      githubUrl: 'https://github.com/johndoe/weather'
    }
  ];

  const isOwnProfile = isAuthenticated && user?.username === profileData.username;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <img
              src={profileData.avatar}
              alt={profileData.fullName}
              className="w-32 h-32 rounded-full border-4 border-purple-500"
            />
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profileData.fullName}</h1>
                  <p className="text-gray-400 text-lg">@{profileData.username}</p>
                </div>
                
                {isOwnProfile ? (
                  <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                      Follow
                    </button>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                      Message
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-300 mb-4 leading-relaxed">{profileData.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profileData.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {profileData.joinDate}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1 text-gray-300">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">{profileData.followers}</span> followers
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <span className="font-semibold">{profileData.following}</span> following
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <FolderOpen className="h-4 w-4" />
                  <span className="font-semibold">{profileData.projects}</span> projects
                </div>
              </div>
              
              <div className="flex gap-4">
                {profileData.githubUrl && (
                  <a
                    href={profileData.githubUrl}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {profileData.linkedinUrl && (
                  <a
                    href={profileData.linkedinUrl}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {profileData.portfolioUrl && (
                  <a
                    href={profileData.portfolioUrl}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Skills & Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {profileData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30 hover:border-blue-400/50 transition-colors duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="border-b border-slate-700/50">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === 'projects'
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('followers')}
                className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === 'followers'
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Followers ({profileData.followers})
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === 'following'
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Following ({profileData.following})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Projects</h3>
                  {isOwnProfile && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Project
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-slate-800/50 rounded-xl border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-white mb-2">{project.title}</h4>
                        <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {project.stars}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {project.views}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <a href={project.demoUrl} className="text-blue-400 hover:text-blue-300">
                              <Globe className="h-4 w-4" />
                            </a>
                            <a href={project.githubUrl} className="text-gray-400 hover:text-white">
                              <Github className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'followers' && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Followers list will be implemented here</p>
              </div>
            )}

            {activeTab === 'following' && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Following list will be implemented here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;