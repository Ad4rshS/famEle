function MediaEditorModal({ media, onClose, onUpdate }) {
  const [editMode, setEditMode] = React.useState('filters');
  const [selectedFilter, setSelectedFilter] = React.useState('none');
  const isVideo = media.objectData.type === 'video';

  const filters = [
    { name: 'none', label: 'Original' },
    { name: 'vintage', label: 'Vintage' },
    { name: 'bw', label: 'Black & White' },
    { name: 'warm', label: 'Warm' },
    { name: 'cool', label: 'Cool' },
    { name: 'vibrant', label: 'Vibrant' }
  ];

  const applyChanges = async () => {
    try {
      await trickleUpdateObject(`media:${media.objectId.split(':')[0]}`, media.objectId, {
        ...media.objectData,
        filter: selectedFilter,
        editedAt: new Date().toISOString()
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
        <div className="bg-white rounded-xl w-full max-w-4xl mx-4 h-4/5 flex">
          <div className="w-64 border-r border-[var(--border-color)] p-4">
            <h3 className="text-lg font-bold mb-4">{isVideo ? 'Video' : 'Photo'} Editor</h3>
            <div className="space-y-2">
              {!isVideo && (
                <>
                  <button
                    onClick={() => setEditMode('filters')}
                    className={`nav-link w-full ${editMode === 'filters' ? 'active' : ''}`}
                  >
                    <div className="icon-palette text-lg"></div>
                    <span>Filters</span>
                  </button>
                  <button
                    onClick={() => setEditMode('crop')}
                    className={`nav-link w-full ${editMode === 'crop' ? 'active' : ''}`}
                  >
                    <div className="icon-crop text-lg"></div>
                    <span>Crop</span>
                  </button>
                  <button
                    onClick={() => setEditMode('adjust')}
                    className={`nav-link w-full ${editMode === 'adjust' ? 'active' : ''}`}
                  >
                    <div className="icon-sliders text-lg"></div>
                    <span>Adjust</span>
                  </button>
                </>
              )}
              {isVideo && (
                <>
                  <button
                    onClick={() => setEditMode('trim')}
                    className={`nav-link w-full ${editMode === 'trim' ? 'active' : ''}`}
                  >
                    <div className="icon-scissors text-lg"></div>
                    <span>Trim</span>
                  </button>
                  <button
                    onClick={() => setEditMode('effects')}
                    className={`nav-link w-full ${editMode === 'effects' ? 'active' : ''}`}
                  >
                    <div className="icon-sparkles text-lg"></div>
                    <span>Effects</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {editMode === 'filters' && 'Apply Filters'}
                {editMode === 'crop' && 'Crop Image'}
                {editMode === 'adjust' && 'Adjust Colors'}
                {editMode === 'trim' && 'Trim Video'}
                {editMode === 'effects' && 'Video Effects'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <div className="icon-x text-lg"></div>
              </button>
            </div>
            
            <div className="flex-1 p-4 flex">
              <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                {isVideo ? (
                  <video
                    src={media.objectData.url}
                    className="max-h-full max-w-full"
                    controls
                    poster={media.objectData.thumbnail}
                  />
                ) : (
                  <img
                    src={media.objectData.url}
                    alt="Editor preview"
                    className={`max-h-full max-w-full ${selectedFilter !== 'none' ? `filter-${selectedFilter}` : ''}`}
                  />
                )}
              </div>
              
              <div className="w-64 space-y-4">
                {editMode === 'filters' && !isVideo && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Choose Filter</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {filters.map(filter => (
                        <button
                          key={filter.name}
                          onClick={() => setSelectedFilter(filter.name)}
                          className={`p-2 text-sm border rounded ${
                            selectedFilter === filter.name ? 'border-[var(--primary-color)] bg-[var(--secondary-color)]' : 'border-gray-300'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {editMode === 'crop' && !isVideo && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Crop Ratio</h3>
                    <div className="space-y-2">
                      <button className="btn-secondary w-full text-sm">Square (1:1)</button>
                      <button className="btn-secondary w-full text-sm">Portrait (4:5)</button>
                      <button className="btn-secondary w-full text-sm">Landscape (16:9)</button>
                      <button className="btn-secondary w-full text-sm">Custom</button>
                    </div>
                  </div>
                )}
                
                {editMode === 'adjust' && !isVideo && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Adjust Image</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Brightness</label>
                        <input type="range" className="w-full" min="-50" max="50" defaultValue="0" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Contrast</label>
                        <input type="range" className="w-full" min="-50" max="50" defaultValue="0" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Saturation</label>
                        <input type="range" className="w-full" min="-50" max="50" defaultValue="0" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] flex justify-end space-x-3">
              <button onClick={onClose} className="btn-secondary">Cancel</button>
              <button onClick={applyChanges} className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MediaEditorModal component error:', error);
    return null;
  }
}
