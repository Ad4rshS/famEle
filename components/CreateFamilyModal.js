function CreateFamilyModal({ user, onClose, onCreated }) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const family = await trickleCreateObject('family', {
        name: name.trim(),
        description: description.trim(),
        createdBy: user.id,
        admins: [user.id],
        inviteCode: generateInviteCode(),
        settings: {
          allowMemberInvite: true,
          autoFaceRecognition: true,
          cloudBackup: false
        }
      });

      // Add creator as first member
      await trickleCreateObject(`member:${family.objectId}`, {
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        role: 'admin',
        joinedAt: new Date().toISOString()
      });

      onCreated(family);
    } catch (error) {
      console.error('Failed to create family:', error);
      alert('Failed to create family. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  try {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        data-name="create-family-modal" 
        data-file="components/CreateFamilyModal.js"
      >
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Create Family Group</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="icon-x text-xl"></div>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Family Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="e.g., The Smith Family"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field resize-none h-20"
                placeholder="Tell us about your family..."
              />
            </div>
            
            <div className="bg-[var(--secondary-color)] rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="icon-info text-lg text-[var(--primary-color)] mt-0.5"></div>
                <div className="text-sm">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="text-[var(--text-secondary)] space-y-1">
                    <li>• You'll be the admin of this family</li>
                    <li>• Get a shareable invite link</li>
                    <li>• Start creating events and sharing memories</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? 'Creating...' : 'Create Family'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CreateFamilyModal component error:', error);
    return null;
  }
}
