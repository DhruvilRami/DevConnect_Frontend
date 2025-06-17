import React, { useState } from 'react';
import { Search, Filter, Star, Eye, Github, Globe, Calendar, User } from 'lucide-react';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js, featuring secure payment processing, inventory management, and real-time order tracking.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      author: {
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      stars: 24,
      views: 156,
      createdAt: '2024-01-15',
      demoUrl: 'https://ecommerce-demo.example.com',
      githubUrl: 'https://github.com/sarahchen/ecommerce-platform'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React Native', 'Firebase', 'Redux'],
      author: {
        name: 'Alex Rodriguez',
        username: 'alexdev',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      stars: 31,
      views: 203,
      createdAt: '2024-02-01',
      demoUrl: 'https://taskapp-demo.example.com',
      githubUrl: 'https://github.com/alexdev/task-management'
    },
    {
      id: 3,
      title: 'Design System Library',
      description: 'Comprehensive design system with React components, detailed documentation, and Storybook integration for consistent UI development.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'TypeScript', 'Storybook', 'Tailwind'],
      author: {
        name: 'Emma Wilson',
        username: 'emmawilson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      stars: 18,
      views: 89,
      createdAt: '2024-01-28',
      demoUrl: 'https://designsystem.example.com',
      githubUrl: 'https://github.com/emmawilson/design-system'
    },
    {
      id: 4,
      title: 'AI Chat Application',
      description: 'Modern chat application powered by AI with natural language processing, smart responses, and beautiful user interface.',
      image: 'https://images.pexels.com/photos/5077040/pexels-photo-5077040.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'Python', 'OpenAI', 'WebSocket'],
      author: {
        name: 'Michael Chang',
        username: 'michaelchang',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      stars: 42,
      views: 312,
      createdAt: '2024-02-10',
      demoUrl: 'https://aichat.example.com',
      githubUrl: 'https://github.com/michaelchang/ai-chat'
    },
    {
      id: 5,
      title: 'Weather Analytics Dashboard',
      description: 'Beautiful weather dashboard with advanced analytics, historical data visualization, and location-based forecasting.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'TypeScript', 'D3.js', 'API'],
      author: {
        name: 'Lisa Park',
        username: 'lisapark',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      stars: 27,
      views: 145,
      createdAt: '2024-01-20',
      demoUrl: 'https://weather-dashboard.example.com',
      githubUrl: 'https://github.com/lisapark/weather-dashboard'
    },
    {
      id: 6,
      title: 'Cryptocurrency Tracker',
      description: 'Real-time cryptocurrency tracking application with portfolio management, price alerts, and market analysis tools.',
      image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Vue.js', 'Node.js', 'PostgreSQL', 'Chart.js'],
      author: {
        name: 'David Kim',
        username: 'davidkim',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      stars: 35,
      views: 267,
      createdAt: '2024-02-05',
      demoUrl: 'https://crypto-tracker.example.com',
      githubUrl: 'https://github.com/davidkim/crypto-tracker'
    }
  ];

  const allTags = ['All', ...Array.from(new Set(projects.flatMap(project => project.tags)))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Amazing
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Projects
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore innovative projects built by our community of talented developers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, technologies, or developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-slate-800/50 border border-slate-600 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              >
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-white text-sm">
                    <Star className="h-3 w-3" />
                    {project.stars}
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-white text-sm">
                    <Eye className="h-3 w-3" />
                    {project.views}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <img
                    src={project.author.avatar}
                    alt={project.author.name}
                    className="w-8 h-8 rounded-full border-2 border-purple-500 mr-3"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{project.author.name}</p>
                    <p className="text-gray-400 text-xs">@{project.author.username}</p>
                  </div>
                  <div className="ml-auto flex items-center text-gray-400 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(project.createdAt)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
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
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-300"
                      title="View Demo"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 hover:text-white transition-all duration-300"
                      title="View Source"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-12 max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;