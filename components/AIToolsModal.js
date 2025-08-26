function AIToolsModal({ media, onClose }) {
  const [activeTool, setActiveTool] = React.useState('face-detection');
  const [processing, setProcessing] = React.useState(false);
  const [results, setResults] = React.useState(null);

  const runFaceDetection = async () => {
    setProcessing(true);
    try {
      const photoMedia = media.filter(m => m.objectData.type === 'image');
      const faces = await AITools.detectAllFaces(photoMedia);
      setResults({ type: 'faces', data: faces });
    } catch (error) {
      console.error('Face detection failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const findDuplicates = async () => {
    setProcessing(true);
    try {
      const duplicates = await AITools.findDuplicates(media);
      setResults({ type: 'duplicates', data: duplicates });
    } catch (error) {
      console.error('Duplicate detection failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const createSmartCollage = async () => {
    setProcessing(true);
    try {
      const photoMedia = media.filter(m => m.objectData.type === 'image');
      const collage = await AITools.createCollage(photoMedia.slice(0, 9));
      setResults({ type: 'collage', data: collage });
    } catch (error) {
      console.error('Collage creation failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
        <div className="bg-white rounded-xl w-full max-w-4xl mx-4 h-4/5 flex">
          <div className="w-64 border-r border-[var(--border-color)] p-4">
            <h3 className="text-lg font-bold mb-4">AI Tools</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTool('face-detection')}
                className={`nav-link w-full ${activeTools === 'face-detection' ? 'active' : ''}`}
              >
                <div className="icon-user-check text-lg"></div>
                <span>Face Detection</span>
              </button>
              <button
                onClick={() => setActiveTool('duplicates')}
                className={`nav-link w-full ${activeTool === 'duplicates' ? 'active' : ''}`}
              >
                <div className="icon-copy text-lg"></div>
                <span>Find Duplicates</span>
              </button>
              <button
                onClick={() => setActiveTool('collage')}
                className={`nav-link w-full ${activeTool === 'collage' ? 'active' : ''}`}
              >
                <div className="icon-image text-lg"></div>
                <span>Smart Collage</span>
              </button>
              <button
                onClick={() => setActiveTool('quality')}
                className={`nav-link w-full ${activeTool === 'quality' ? 'active' : ''}`}
              >
                <div className="icon-star text-lg"></div>
                <span>Quality Enhance</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {activeTool === 'face-detection' && 'Face Detection & Tagging'}
                {activeTool === 'duplicates' && 'Duplicate Photo Finder'}
                {activeTool === 'collage' && 'Smart Photo Collage'}
                {activeTool === 'quality' && 'Quality Enhancement'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
            
            {activeTool === 'face-detection' && (
              <FaceDetectionTool 
                media={media} 
                processing={processing} 
                onRun={runFaceDetection}
                results={results?.type === 'faces' ? results.data : null}
              />
            )}
            
            {activeTool === 'duplicates' && (
              <DuplicateFinderTool 
                media={media} 
                processing={processing} 
                onRun={findDuplicates}
                results={results?.type === 'duplicates' ? results.data : null}
              />
            )}
            
            {activeTool === 'collage' && (
              <SmartCollageTool 
                media={media} 
                processing={processing} 
                onRun={createSmartCollage}
                results={results?.type === 'collage' ? results.data : null}
              />
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AIToolsModal component error:', error);
    return null;
  }
}

function FaceDetectionTool({ media, processing, onRun, results }) {
  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        Automatically detect and tag family members in your photos using AI face recognition.
      </p>
      
      <div className="flex space-x-4">
        <button 
          onClick={onRun} 
          disabled={processing}
          className="btn-primary"
        >
          {processing ? 'Detecting Faces...' : 'Start Face Detection'}
        </button>
        <div className="text-sm text-[var(--text-secondary)] self-center">
          {media.filter(m => m.objectData.type === 'image').length} photos will be analyzed
        </div>
      </div>
      
      {results && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-3">
              <img src={result.thumbnail} alt="Face detected" className="w-full h-32 object-cover rounded mb-2" />
              <p className="text-sm">{result.faces} faces detected</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DuplicateFinderTool({ media, processing, onRun, results }) {
  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        Find duplicate or similar photos and help you choose the best quality versions to keep.
      </p>
      
      <button 
        onClick={onRun} 
        disabled={processing}
        className="btn-primary"
      >
        {processing ? 'Finding Duplicates...' : 'Find Duplicate Photos'}
      </button>
      
      {results && (
        <div className="space-y-4">
          {results.map((group, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Duplicate Group {index + 1}</h4>
              <div className="grid grid-cols-4 gap-3">
                {group.items.map((item, idx) => (
                  <div key={idx} className="relative">
                    <img src={item.thumbnail} alt="Duplicate" className="w-full h-24 object-cover rounded" />
                    {item.recommended && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                        Best
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmartCollageTool({ media, processing, onRun, results }) {
  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        Create beautiful photo collages automatically using AI to arrange your best photos.
      </p>
      
      <button 
        onClick={onRun} 
        disabled={processing}
        className="btn-primary"
      >
        {processing ? 'Creating Collage...' : 'Generate Smart Collage'}
      </button>
      
      {results && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Generated Collage Layout</h4>
          <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
            <p className="text-[var(--text-secondary)]">Collage preview would appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}