function ProfileCard({ members, family }) {
  const [showInvite, setShowInvite] = React.useState(false);

  try {
    return (
      <div className="card" data-name="profile-card" data-file="components/ProfileCard.js">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Family Members</h2>
          <button 
            onClick={() => setShowInvite(true)}
            className="btn-primary text-sm px-4 py-2"
          >
            <div className="icon-user-plus text-sm mr-1"></div>
            Invite
          </button>
        </div>
        
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.objectId} className="flex items-center space-x-3">
              <img
                src={member.objectData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&q=80`}
                alt={member.objectData.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">{member.objectData.name}</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {member.objectData.role === 'admin' ? 'Admin' : 'Member'}
                </p>
              </div>
              {member.objectData.role === 'admin' && (
                <div className="w-6 h-6 rounded bg-[var(--secondary-color)] flex items-center justify-center">
                  <div className="icon-crown text-sm text-[var(--primary-color)]"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {members.length === 0 && (
          <div className="text-center py-8">
            <div className="icon-users text-4xl text-gray-400 mb-3"></div>
            <p className="text-[var(--text-secondary)]">No members yet</p>
          </div>
        )}
        
        {showInvite && (
          <InviteModal 
            family={family} 
            onClose={() => setShowInvite(false)} 
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('ProfileCard component error:', error);
    return null;
  }
}

function InviteModal({ family, onClose }) {
  const inviteLink = `${window.location.origin}/join?code=${family.objectData.inviteCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Invite Family Members</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Invite Code</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={family.objectData.inviteCode}
                className="input-field flex-1"
                readOnly
              />
              <button onClick={copyLink} className="btn-secondary px-4">Copy</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Share Link</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inviteLink}
                className="input-field flex-1 text-sm"
                readOnly
              />
              <button onClick={copyLink} className="btn-secondary px-4">Copy</button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="btn-primary">Done</button>
        </div>
      </div>
    </div>
  );
}