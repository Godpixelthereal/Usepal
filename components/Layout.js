import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiMessageSquare } from 'react-icons/fi';

const Layout = ({ children }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="app-container">
      {/* Main Content */}
      <main>{children}</main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link href="/overview" className={`bottom-nav-item ${currentPath === '/overview' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="bottom-nav-text">Home</span>
          {currentPath === '/overview' && <div className="bottom-nav-indicator"></div>}
        </Link>
        
        <Link href="/projects" className={`bottom-nav-item ${currentPath === '/projects' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5Z" fill="currentColor"/>
              <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="bottom-nav-text">Projects</span>
          {currentPath === '/projects' && <div className="bottom-nav-indicator"></div>}
        </Link>
        
        <Link href="/assistant" className={`bottom-nav-item ${currentPath === '/assistant' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span className="bottom-nav-text">Pal</span>
          {currentPath === '/assistant' && <div className="bottom-nav-indicator"></div>}
        </Link>
        
        <Link href="/wallet" className={`bottom-nav-item ${currentPath === '/wallet' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <path d="M2 9h20"></path>
            </svg>
          </div>
          <span className="bottom-nav-text">Wallet</span>
          {currentPath === '/wallet' && <div className="bottom-nav-indicator"></div>}
        </Link>
      </nav>
    </div>
  );
};

export default Layout;