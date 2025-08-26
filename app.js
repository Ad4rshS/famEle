class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [currentView, setCurrentView] = React.useState('dashboard');
    const [selectedFamily, setSelectedFamily] = React.useState(null);
    const [user, setUser] = React.useState({
      id: 'user123',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    });
    const [families, setFamilies] = React.useState([]);
    const [showCreateModal, setShowCreateModal] = React.useState(false);

    React.useEffect(() => {
      loadFamilies();
    }, []);

    const loadFamilies = async () => {
      try {
        const result = await trickleListObjects('family', 10, true);
        setFamilies(result.items || []);
      } catch (error) {
        console.error('Failed to load families:', error);
      }
    };

    const renderContent = () => {
      switch (currentView) {
        case 'family':
          return selectedFamily ? (
            <FamilyView 
              family={selectedFamily} 
              user={user}
              onBack={() => setCurrentView('dashboard')}
            />
          ) : null;
        case 'profile':
          return <ProfileView user={user} setUser={setUser} />;
        case 'memories':
          return <MemoriesView user={user} />;
        default:
          return <Dashboard 
            families={families}
            onSelectFamily={(family) => {
              setSelectedFamily(family);
              setCurrentView('family');
            }}
            onCreateFamily={() => setShowCreateModal(true)}
          />;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50" data-name="app" data-file="app.js">
        <Header user={user} />
        <div className="flex">
          <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            families={families}
            onSelectFamily={(family) => {
              setSelectedFamily(family);
              setCurrentView('family');
            }}
          />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
        
        {showCreateModal && (
          <CreateFamilyModal
            user={user}
            onClose={() => setShowCreateModal(false)}
            onCreated={(family) => {
              setFamilies([family, ...families]);
              setShowCreateModal(false);
              setSelectedFamily(family);
              setCurrentView('family');
            }}
          />
        )}
        
        <ChatWidget selectedFamily={selectedFamily} user={user} />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

// Dashboard Component
function Dashboard({ families, onSelectFamily, onCreateFamily }) {
  return (
    <div className="space-y-6" data-name="dashboard" data-file="app.js">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Your Family Hub</h1>
        <button onClick={onCreateFamily} className="btn-primary">
          <div className="icon-plus text-lg mr-2"></div>
          Create Family
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {families.map((family) => (
          <FamilyCard
            key={family.objectId}
            family={family}
            onClick={() => onSelectFamily(family)}
          />
        ))}
      </div>
      
      {families.length === 0 && (
        <div className="text-center py-12">
          <div className="icon-users text-6xl text-gray-400 mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No families yet</h3>
          <p className="text-gray-500 mb-6">Create your first family group to start sharing memories</p>
          <button onClick={onCreateFamily} className="btn-primary">
            Create Your First Family
          </button>
        </div>
      )}
    </div>
  );
}

// Family View Component
function FamilyView({ family, user, onBack }) {
  const [events, setEvents] = React.useState([]);
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    loadFamilyData();
  }, [family]);

  const loadFamilyData = async () => {
    try {
      const eventsResult = await trickleListObjects(`event:${family.objectId}`, 20, true);
      setEvents(eventsResult.items || []);
      
      const membersResult = await trickleListObjects(`member:${family.objectId}`, 50, true);
      setMembers(membersResult.items || []);
    } catch (error) {
      console.error('Failed to load family data:', error);
    }
  };

  return (
    <div className="space-y-6" data-name="family-view" data-file="app.js">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-200">
            <div className="icon-arrow-left text-xl"></div>
          </button>
          <h1 className="text-3xl font-bold">{family.objectData.name}</h1>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <div className="icon-calendar text-lg mr-2"></div>
            Calendar
          </button>
          <button className="btn-primary">
            <div className="icon-plus text-lg mr-2"></div>
            Create Event
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EventCard events={events} familyId={family.objectId} />
          <MediaGrid familyId={family.objectId} />
        </div>
        <div className="space-y-6">
          <ProfileCard members={members} family={family} />
        </div>
      </div>
    </div>
  );
}

// Profile View Component
function ProfileView({ user, setUser }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6" data-name="profile-view" data-file="app.js">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="card">
        <div className="flex items-center space-x-6 mb-6">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <button className="btn-secondary mt-2">Change Photo</button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" className="input-field" defaultValue={user.name} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="input-field" defaultValue="john@example.com" />
          </div>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// Memories View Component
function MemoriesView({ user }) {
  return (
    <div className="space-y-6" data-name="memories-view" data-file="app.js">
      <h1 className="text-3xl font-bold">Memories</h1>
      <div className="card">
        <div className="text-center py-12">
          <div className="icon-heart text-6xl text-gray-400 mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your memories will appear here</h3>
          <p className="text-gray-500">AI will automatically show you past memories and suggest highlight slideshows</p>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);