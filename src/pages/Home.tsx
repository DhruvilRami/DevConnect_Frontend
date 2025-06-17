import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Users, MessageSquare, Trophy, ArrowRight, Github, Linkedin, Globe } from 'lucide-react';

const Home: React.FC = () => {
  const featuredDevelopers = [
    {
      id: 1,
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      projects: 12,
      followers: 156
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      username: 'alexdev',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Mobile App Developer',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      projects: 8,
      followers: 203
    },
    {
      id: 3,
      name: 'Emma Wilson',
      username: 'emmawilson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'UI/UX Developer',
      skills: ['React', 'TypeScript', 'Figma', 'Tailwind'],
      projects: 15,
      followers: 89
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      author: 'Sarah Chen',
      likes: 24,
      demo: 'https://demo.example.com',
      github: 'https://github.com/sarahchen/ecommerce'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management with real-time updates',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React Native', 'Firebase', 'Redux'],
      author: 'Alex Rodriguez',
      likes: 31,
      demo: 'https://taskapp.example.com',
      github: 'https://github.com/alexdev/taskapp'
    },
    {
      id: 3,
      title: 'Design System',
      description: 'Comprehensive design system with React components',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['React', 'TypeScript', 'Storybook'],
      author: 'Emma Wilson',
      likes: 18,
      demo: 'https://designsystem.example.com',
      github: 'https://github.com/emmawilson/design-system'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Connect. Create. 
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Collaborate.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the ultimate platform for developers to showcase projects, connect with peers, and build the future together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/projects"
              className="border-2 border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose DevConnect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg w-fit mb-6">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Showcase Projects</h3>
              <p className="text-gray-300 leading-relaxed">
                Display your best work with rich project descriptions, live demos, and detailed documentation.
              </p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg w-fit mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Connect with Peers</h3>
              <p className="text-gray-300 leading-relaxed">
                Build your professional network by following other developers and discovering new talent.
              </p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-lg w-fit mb-6">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-time Chat</h3>
              <p className="text-gray-300 leading-relaxed">
                Collaborate in real-time with instant messaging and project discussions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Developers */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Featured Developers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredDevelopers.map((dev) => (
              <div key={dev.id} className="bg-slate-900/30 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-16 h-16 rounded-full border-2 border-purple-500 mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{dev.name}</h3>
                    <p className="text-gray-400">@{dev.username}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{dev.title}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {dev.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{dev.projects} projects</span>
                  <span>{dev.followers} followers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">by {project.author}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400 text-sm">❤️ {project.likes}</span>
                      <div className="flex space-x-2">
                        <a href={project.demo} className="text-blue-400 hover:text-blue-300">
                          <Globe className="h-4 w-4" />
                        </a>
                        <a href={project.github} className="text-gray-400 hover:text-white">
                          <Github className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start showcasing your projects and connecting with amazing developers today.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 inline-flex items-center group"
          >
            Join DevConnect
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;