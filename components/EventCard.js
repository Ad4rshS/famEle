function EventCard({ events, familyId }) {
  const [showCreateEvent, setShowCreateEvent] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  try {
    return (
      <div className="card" data-name="event-card" data-file="components/EventCard.js">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Events</h2>
          <button 
            onClick={() => setShowCreateEvent(true)}
            className="btn-primary text-sm px-4 py-2"
          >
            <div className="icon-plus text-sm mr-1"></div>
            Add Event
          </button>
        </div>
        
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.slice(0, 3).map((event) => (
              <EventPreview 
                key={event.objectId} 
                event={event} 
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="icon-calendar text-4xl text-gray-400 mb-3"></div>
            <p className="text-[var(--text-secondary)]">No events yet</p>
            <p className="text-sm text-[var(--text-secondary)]">Create your first family event</p>
          </div>
        )}
        
        {showCreateEvent && <CreateEventModal familyId={familyId} onClose={() => setShowCreateEvent(false)} />}
        {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </div>
    );
  } catch (error) {
    console.error('EventCard component error:', error);
    return null;
  }
}

function EventPreview({ event, onClick }) {
  const [mediaCount, setMediaCount] = React.useState(0);

  React.useEffect(() => {
    loadMediaCount();
  }, [event]);

  const loadMediaCount = async () => {
    try {
      const result = await trickleListObjects(`media:${event.objectId}`, 1, true);
      setMediaCount(result.items.length);
    } catch (error) {
      console.error('Failed to load media count:', error);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center space-x-4 p-3 border border-[var(--border-color)] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="w-12 h-12 rounded-lg bg-[var(--secondary-color)] flex items-center justify-center">
        <div className="icon-calendar text-xl text-[var(--primary-color)]"></div>
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{event.objectData.title}</h3>
        <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
          <span>{new Date(event.objectData.date).toLocaleDateString()}</span>
          <span className="flex items-center space-x-1">
            <div className="icon-image text-xs"></div>
            <span>{mediaCount} photos</span>
          </span>
        </div>
      </div>
      <button className="p-2 rounded-lg hover:bg-gray-100">
        <div className="icon-chevron-right text-lg text-[var(--text-secondary)]"></div>
      </button>
    </div>
  );
}

function EventDetailModal({ event, onClose }) {
  const [sections, setSections] = React.useState([]);
  const [activeSection, setActiveSection] = React.useState('all');
  const [activeMediaType, setActiveMediaType] = React.useState('all');
  const [media, setMedia] = React.useState([]);
  const [showUpload, setShowUpload] = React.useState(false);
  const [showCreateSection, setShowCreateSection] = React.useState(false);
  const [showAITools, setShowAITools] = React.useState(false);

  React.useEffect(() => {
    loadEventData();
  }, [event]);

  const loadEventData = async () => {
    try {
      const mediaResult = await trickleListObjects(`media:${event.objectId}`, 50, true);
      setMedia(mediaResult.items || []);
      
      const sectionsResult = await trickleListObjects(`section:${event.objectId}`, 20, true);
      setSections(sectionsResult.items || []);
    } catch (error) {
      console.error('Failed to load event data:', error);
    }
  };

  const filteredMedia = media.filter(item => {
    const sectionMatch = activeSection === 'all' || item.objectData.sectionId === activeSection;
    const typeMatch = activeMediaType === 'all' || 
      (activeMediaType === 'photos' && item.objectData.type === 'image') ||
      (activeMediaType === 'videos' && item.objectData.type === 'video');
    return sectionMatch && typeMatch;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl mx-4 h-5/6 flex flex-col">
        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{event.objectData.title}</h2>
            <p className="text-[var(--text-secondary)]">{new Date(event.objectData.date).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <div className="icon-x text-xl"></div>
          </button>
        </div>
        
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <select 
                value={activeSection} 
                onChange={(e) => setActiveSection(e.target.value)}
                className="input-field text-sm py-2 px-3 w-auto"
              >
                <option value="all">All Sections</option>
                {sections.map(section => (
                  <option key={section.objectId} value={section.objectId}>
                    {section.objectData.name}
                  </option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveMediaType('all')}
                  className={`px-3 py-1 rounded text-sm ${activeMediaType === 'all' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-200'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveMediaType('photos')}
                  className={`px-3 py-1 rounded text-sm ${activeMediaType === 'photos' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-200'}`}
                >
                  Photos
                </button>
                <button 
                  onClick={() => setActiveMediaType('videos')}
                  className={`px-3 py-1 rounded text-sm ${activeMediaType === 'videos' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-200'}`}
                >
                  Videos
                </button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button onClick={() => setShowCreateSection(true)} className="btn-secondary text-sm px-4 py-2">
                <div className="icon-folder-plus text-sm mr-1"></div>
                New Section
              </button>
              <button onClick={() => setShowAITools(true)} className="btn-secondary text-sm px-4 py-2">
                <div className="icon-wand-2 text-sm mr-1"></div>
                AI Tools
              </button>
              <button onClick={() => setShowUpload(true)} className="btn-primary text-sm px-4 py-2">
                <div className="icon-upload text-sm mr-1"></div>
                Upload
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <MediaItem key={item.objectId} media={item} sections={sections} onUpdate={loadEventData} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="icon-image text-6xl text-gray-400 mb-4"></div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No media in this view</h3>
                <p className="text-[var(--text-secondary)] mb-6">Upload photos and videos or adjust your filters</p>
                <button onClick={() => setShowUpload(true)} className="btn-primary">
                  Upload Media
                </button>
              </div>
            </div>
          )}
        </div>
        
        {showUpload && <EventUploadModal eventId={event.objectId} sections={sections} onClose={() => setShowUpload(false)} onUploaded={loadEventData} />}
        {showCreateSection && <CreateSectionModal eventId={event.objectId} onClose={() => setShowCreateSection(false)} onCreated={loadEventData} />}
        {showAITools && <AIToolsModal media={media} onClose={() => setShowAITools(false)} />}
      </div>
    </div>
  );
}

function MediaItem({ media, sections, onUpdate }) {
  const [showEditor, setShowEditor] = React.useState(false);
  const [showFaces, setShowFaces] = React.useState(false);

  const isVideo = media.objectData.type === 'video';

  return (
    <div className="relative group">
      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
        {isVideo ? (
          <video
            src={media.objectData.url}
            className="w-full h-full object-cover"
            poster={media.objectData.thumbnail}
          />
        ) : (
          <img
            src={media.objectData.thumbnail || media.objectData.url}
            alt="Event media"
            className="w-full h-full object-cover"
          />
        )}
        {isVideo && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded px-2 py-1">
            <div className="icon-play text-white text-xs"></div>
          </div>
        )}
      </div>
      
      {media.objectData.faces && media.objectData.faces.length > 0 && (
        <div className="absolute top-2 right-2 bg-[var(--primary-color)] rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-white text-xs">{media.objectData.faces.length}</span>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-opacity flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button 
            onClick={() => setShowEditor(true)}
            className="p-2 bg-white rounded-full"
          >
            <div className={`${isVideo ? 'icon-video' : 'icon-edit'} text-sm text-[var(--primary-color)]`}></div>
          </button>
          <button 
            onClick={() => setShowFaces(true)}
            className="p-2 bg-white rounded-full"
          >
            <div className="icon-user-check text-sm text-[var(--accent-color)]"></div>
          </button>
          <button className="p-2 bg-white rounded-full">
            <div className="icon-download text-sm text-[var(--success-color)]"></div>
          </button>
        </div>
      </div>
      
      {showEditor && (
        <MediaEditorModal 
          media={media} 
          onClose={() => setShowEditor(false)} 
          onUpdate={onUpdate}
        />
      )}
      
      {showFaces && (
        <FaceDetectionModal 
          media={media} 
          onClose={() => setShowFaces(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

function EventUploadModal({ eventId, sections, onClose, onUploaded }) {
  const [selectedSection, setSelectedSection] = React.useState('');

  const handleUpload = async () => {
    try {
      await trickleCreateObject(`media:${eventId}`, {
        url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop",
        type: "image",
        sectionId: selectedSection || null,
        uploadedAt: new Date().toISOString(),
        quality: Math.floor(Math.random() * 5) + 1
      });
      onUploaded();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Upload Media to Event</h2>
        
        {sections.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Section (Optional)</label>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input-field"
            >
              <option value="">No specific section</option>
              {sections.map(section => (
                <option key={section.objectId} value={section.objectId}>
                  {section.objectData.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="icon-upload text-4xl text-gray-400 mb-4"></div>
          <p className="text-[var(--text-secondary)] mb-4">Drag and drop files here or click to browse</p>
          <button onClick={handleUpload} className="btn-primary">Choose Files</button>
        </div>
        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleUpload} className="btn-primary flex-1">Upload</button>
        </div>
      </div>
    </div>
  );
}

function CreateSectionModal({ eventId, onClose, onCreated }) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trickleCreateObject(`section:${eventId}`, {
        name: name.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString()
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Create Section</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Section name (e.g., Ceremony, Reception)"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field h-20"
            placeholder="Section description (optional)"
          />
          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Create Section</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FaceDetectionModal({ media, onClose, onUpdate }) {
  const [detectedFaces, setDetectedFaces] = React.useState([]);
  const [familyMembers, setFamilyMembers] = React.useState([]);
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    runFaceDetection();
    loadFamilyMembers();
  }, []);

  const runFaceDetection = async () => {
    setProcessing(true);
    try {
      const faces = await AITools.recognizeFaces(media.objectData.url, familyMembers);
      setDetectedFaces(faces);
    } catch (error) {
      console.error('Face detection failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const loadFamilyMembers = async () => {
    try {
      const familyId = media.objectId.split(':')[1];
      const result = await trickleListObjects(`member:${familyId}`, 50, true);
      setFamilyMembers(result.items || []);
    } catch (error) {
      console.error('Failed to load family members:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Face Detection</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <div className="icon-x text-lg"></div>
          </button>
        </div>
        
        <div className="space-y-4">
          <img src={media.objectData.url} alt="Media" className="w-full h-64 object-cover rounded-lg" />
          
          {processing ? (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Detecting faces...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-medium">Detected Faces ({detectedFaces.length})</h3>
              {detectedFaces.map((face, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>Face {index + 1}</span>
                  <select className="input-field text-sm w-40">
                    <option value="">Select member</option>
                    {familyMembers.map(member => (
                      <option key={member.objectId} value={member.objectId}>
                        {member.objectData.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button className="btn-primary">Save Tags</button>
        </div>
      </div>
    </div>
  );
}

function CreateEventModal({ familyId, onClose }) {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trickleCreateObject(`event:${familyId}`, {
        title: title.trim(),
        date: date,
        description: description.trim(),
        createdAt: new Date().toISOString()
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Event title"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field h-20"
            placeholder="Event description"
          />
          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
