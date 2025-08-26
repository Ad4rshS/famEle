function ChatWidget({ selectedFamily, user }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');

  React.useEffect(() => {
    if (selectedFamily && isOpen) {
      loadMessages();
    }
  }, [selectedFamily, isOpen]);

  const loadMessages = async () => {
    if (!selectedFamily) return;
    try {
      const result = await trickleListObjects(`chat:${selectedFamily.objectId}`, 20, true);
      setMessages(result.items || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFamily) return;

    try {
      await trickleCreateObject(`chat:${selectedFamily.objectId}`, {
        message: newMessage.trim(),
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!selectedFamily) return null;

  try {
    return (
      <div className="fixed bottom-6 right-6 z-40" data-name="chat-widget" data-file="components/ChatWidget.js">
        {isOpen && (
          <div className="bg-white rounded-xl shadow-lg border border-[var(--border-color)] w-80 h-96 mb-4 flex flex-col">
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <h3 className="font-semibold">{selectedFamily.objectData.name} Chat</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <div className="icon-x text-lg"></div>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length > 0 ? (
                messages.reverse().map((msg) => (
                  <div key={msg.objectId} className="flex items-start space-x-2">
                    <img
                      src={msg.objectData.senderAvatar}
                      alt={msg.objectData.senderName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">{msg.objectData.senderName}</span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {new Date(msg.objectData.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.objectData.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="icon-message-circle text-4xl text-gray-400 mb-2"></div>
                  <p className="text-sm text-[var(--text-secondary)]">No messages yet</p>
                </div>
              )}
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t border-[var(--border-color)]">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="input-field text-sm py-2"
                  placeholder="Type a message..."
                />
                <button type="submit" className="btn-primary px-3 py-2">
                  <div className="icon-send text-sm"></div>
                </button>
              </div>
            </form>
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[var(--primary-color)] text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <div className="icon-message-circle text-xl"></div>
        </button>
      </div>
    );
  } catch (error) {
    console.error('ChatWidget component error:', error);
    return null;
  }
}