function Header({ user }) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  try {
    return (
      <header className="bg-white border-b border-[var(--border-color)] px-6 py-4" data-name="header" data-file="components/Header.js">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
              <div className="icon-home text-xl text-white"></div>
            </div>
            <h1 className="text-2xl font-bold text-gradient">FamilyHub</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <div className="icon-bell text-xl text-[var(--text-secondary)]"></div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--error-color)] rounded-full"></span>
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{user.name}</span>
                <div className="icon-chevron-down text-sm"></div>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--border-color)] py-2">
                  <a href="profile.html" className="block px-4 py-2 hover:bg-gray-50">Profile Settings</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-50">Privacy</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-50">Help</a>
                  <hr className="my-2" />
                  <a href="#" className="block px-4 py-2 hover:bg-gray-50 text-[var(--error-color)]">Sign Out</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}