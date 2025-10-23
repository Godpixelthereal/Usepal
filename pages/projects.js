import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import Layout from '../components/Layout';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockProjects = [
      { id: 1, name: 'The Base app', type: 'Mobile app design', date: '02/08/2025', color: 'bg-blue-500' },
      { id: 2, name: 'Onboard', type: '', date: '', color: 'bg-gray-800' },
      { id: 3, name: 'Paypal AI', type: '', date: '', color: 'bg-blue-400' },
      { id: 4, name: 'Busy Easy', type: '', date: '', color: 'bg-teal-700' }
    ];
    
    setProjects(mockProjects);
  }, []);

  return (
    <Layout>
      <div className="p-4 pb-20">
        <div className="flex items-center mb-2">
          <div className="flex-1">
            <h1 className="text-4xl font-bold">All Projects,</h1>
            <h1 className="text-4xl font-bold flex items-center">
              Folders
              <span className="text-gray-400 ml-1">(10)</span>
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
            <span className="text-xl">👤</span>
          </div>
        </div>
        
        <p className="text-gray-400 mb-8">
          Swipe down to view or search for previous projects.
        </p>
        
        <div className="relative mt-16" style={{ height: '300px' }}>
          {/* Stacked project cards */}
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className={`project-card ${project.color} text-white shadow-lg`}
              style={{
                top: `${index * 40}px`,
                zIndex: projects.length - index,
                transform: index === 0 ? 'scale(1)' : `scale(${1 - index * 0.05})`,
                opacity: index === 0 ? 1 : 1 - index * 0.2
              }}
            >
              <h2 className="text-2xl font-bold mb-1">{project.name}</h2>
              {index === 0 && (
                <>
                  <p className="text-xl mb-8">{project.type}</p>
                  <div className="absolute bottom-6 right-6 text-sm">
                    {project.date}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Floating action button */}
        <div className="fixed bottom-24 right-4 z-50">
          <button className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg">
            <FiPlus size={24} />
          </button>
        </div>
        
        {/* Points indicator */}
        <div className="fixed top-4 left-4 bg-white rounded-full py-2 px-4 flex items-center shadow-md">
          <span className="text-purple-500 mr-2">✦</span>
          <span className="font-bold">100</span>
        </div>
      </div>
    </Layout>
  );
}