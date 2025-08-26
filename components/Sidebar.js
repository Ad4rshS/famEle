function Sidebar({ currentView, setCurrentView, families, onSelectFamily }) {
  try {
    return (
      <aside className="w-64 bg-white border-r border-[var(--border-color)] min-h-screen p-4" data-name="sidebar" data-file="components/Sidebar.js">
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`nav-link w-full ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            <div className="icon-layout-dashboard text-xl"></div>
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setCurrentView('profile')}
            className={`nav-link w-full ${currentView === 'profile' ? 'active' : ''}`}
          >
            <div className="icon-user text-xl"></div>
            <span>My Profile</span>
          </button>
          
          <button
            onClick={() => setCurrentView('memories')}
            className={`nav-link w-full ${currentView === 'memories' ? 'active' : ''}`}
          >
            <div className="icon-heart text-xl"></div>
            <span>Memories</span>
          </button>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 px-4">My Families</h3>
            <div className="space-y-1">
              {families.map((family) => (
                <button
                  key={family.objectId}
                  onClick={() => onSelectFamily(family)}
                  className="nav-link w-full"
                >
                  <div className="w-6 h-6 rounded bg-[var(--secondary-color)] flex items-center justify-center">
                    <div className="icon-users text-sm text-[var(--primary-color)]"></div>
                  </div>
                  <span className="truncate">{family.objectData.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-[var(--border-color)]">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 px-4">AI Tools</h3>
            <div className="space-y-1">
              <button className="nav-link w-full">
                <div className="icon-wand-2 text-xl"></div>
                <span>Face Recognition</span>
              </button>
              <button className="nav-link w-full">
                <div className="icon-copy text-xl"></div>
                <span>Duplicate Finder</span>
              </button>
              <button className="nav-link w-full">
                <div className="icon-image text-xl"></div>
                <span>Smart Collage</span>
              </button>
              <button className="nav-link w-full">
                <div className="icon-video text-xl"></div>
                <span>Video Editor</span>
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[var(--border-color)]">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 px-4">Storage</h3>
            <div className="space-y-1">
              <button className="nav-link w-full">
                <div className="icon-cloud text-xl"></div>
                <span>Cloud Backup</span>
              </button>
              <button className="nav-link w-full">
                <div className="icon-download text-xl"></div>
                <span>Downloads</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return null;
  }
}