function MediaGrid({ familyId }) {
  const [media, setMedia] = React.useState([]);
  const [showUpload, setShowUpload] = React.useState(false);

  React.useEffect(() => {
    loadMedia();
  }, [familyId]);

  const loadMedia = async () => {
    try {
      const result = await trickleListObjects(`media:${familyId}`, 20, true);
      setMedia(result.items || []);
    } catch (error) {
      console.error('Failed to load media:', error);
    }
  };

  try {
    return (
      <div className="card" data-name="media-grid" data-file="components/MediaGrid.js">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Family Media</h2>
          <div className="flex space-x-2">
            <button className="btn-secondary text-sm px-4 py-2">
              <div className="icon-wand-2 text-sm mr-1"></div>
              AI Tools
            </button>
            <button 
              onClick={() => setShowUpload(true)}
              className="btn-primary text-sm px-4 py-2"
            >
              <div className="icon-upload text-sm mr-1"></div>
              Upload
            </button>
          </div>
        </div>
        
        {media.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.objectId} className="relative group">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={item.objectData.thumbnail || item.objectData.url}
                    alt="Family media"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button className="p-2 bg-white rounded-full">
                      <div className="icon-heart text-lg text-[var(--error-color)]"></div>
                    </button>
                    <button className="p-2 bg-white rounded-full">
                      <div className="icon-download text-lg text-[var(--primary-color)]"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="icon-image text-6xl text-gray-400 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No media yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Start uploading photos and videos to share memories</p>
            <button onClick={() => setShowUpload(true)} className="btn-primary">
              Upload First Photo
            </button>
          </div>
        )}
        
        {showUpload && <UploadModal familyId={familyId} onClose={() => setShowUpload(false)} />}
      </div>
    );
  } catch (error) {
    console.error('MediaGrid component error:', error);
    return null;
  }
}

function UploadModal({ familyId, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Upload Media</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="icon-upload text-4xl text-gray-400 mb-4"></div>
          <p className="text-[var(--text-secondary)] mb-4">Drag and drop files here or click to browse</p>
          <button className="btn-primary">Choose Files</button>
        </div>
        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button className="btn-primary flex-1">Upload</button>
        </div>
      </div>
    </div>
  );
}