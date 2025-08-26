function FamilyCard({ family, onClick }) {
  const [members, setMembers] = React.useState([]);
  const [recentMedia, setRecentMedia] = React.useState([]);

  React.useEffect(() => {
    loadFamilyPreview();
  }, [family]);

  const loadFamilyPreview = async () => {
    try {
      const membersResult = await trickleListObjects(`member:${family.objectId}`, 5, true);
      setMembers(membersResult.items || []);
      
      const mediaResult = await trickleListObjects(`media:${family.objectId}`, 3, true);
      setRecentMedia(mediaResult.items || []);
    } catch (error) {
      console.error('Failed to load family preview:', error);
    }
  };

  try {
    return (
      <div 
        onClick={onClick}
        className="card cursor-pointer hover:shadow-lg transition-shadow"
        data-name="family-card" 
        data-file="components/FamilyCard.js"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{family.objectData.name}</h3>
            <p className="text-[var(--text-secondary)] text-sm">{members.length} members</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[var(--secondary-color)] flex items-center justify-center">
            <div className="icon-users text-xl text-[var(--primary-color)]"></div>
          </div>
        </div>
        
        {family.objectData.description && (
          <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
            {family.objectData.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((member, index) => (
              <img
                key={member.objectId}
                src={member.objectData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&q=80`}
                alt={member.objectData.name}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}
            {members.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium">+{members.length - 4}</span>
              </div>
            )}
          </div>
          
          <span className="text-xs text-[var(--text-secondary)]">
            Updated {new Date(family.updatedAt).toLocaleDateString()}
          </span>
        </div>
        
        {recentMedia.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex space-x-2">
              {recentMedia.slice(0, 3).map((media) => (
                <div
                  key={media.objectId}
                  className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden"
                >
                  <img
                    src={media.objectData.thumbnail || media.objectData.url}
                    alt="Recent media"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('FamilyCard component error:', error);
    return null;
  }
}