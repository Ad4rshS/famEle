# FamilyHub - Family Social Media & Media Hub

## Overview
FamilyHub is a comprehensive family social media platform designed to help families stay connected, share memories, and organize events together. The application combines traditional social media features with AI-powered media tools and family-specific functionality.

## Key Features

### 1. Family Group System
- Create and manage family groups with invite codes
- Admin and member role management
- Shareable invite links for easy joining

### 2. Events & Media Sharing
- Create family events with dates and descriptions
- Upload and share photos/videos within events
- Timeline and grid view for media content
- High-quality media transfer without compression

### 3. Member Profiles
- Individual member profiles with verified photos
- Profile pictures used for AI face recognition
- Admin and member role indicators

### 4. AI-Powered Tools
- **Face Recognition**: Automatically tag family members in photos
- **Duplicate Detection**: Find and suggest best quality versions of duplicate photos
- **Smart Collage Creator**: Generate beautiful photo collages automatically
- **Video Editor**: Create highlight videos and reels from selected media
- **Memory Reminders**: AI suggests past memories and creates highlight slideshows

### 5. Communication Features
- Real-time family group chat
- React to photos and videos with likes/emojis
- Comment system for media posts
- Family calendar integration

### 6. Media Management
- Built-in photo editor (crop, filters, text, stickers)
- Built-in video editor with transitions and music
- Cloud backup integration (Google Drive, Dropbox, iCloud)
- Download original quality media

### 7. Advanced Features
- Memory timeline with "On this day" reminders
- Chromecast/AirPlay support for TV slideshows
- Template support for social media formats (Instagram, YouTube Shorts)
- Family calendar with birthdays, anniversaries, and events

## Technical Architecture

### Frontend
- **React 18**: Modern component-based UI framework
- **TailwindCSS**: Utility-first CSS framework for styling
- **Lucide Icons**: Comprehensive icon library
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Backend Integration
- **Trickle Database**: Built-in database for data persistence
- **AI Agent API**: Powers face recognition and content generation
- **Multi-page Architecture**: Separate HTML files for different sections

### Key Components
- `Header.js`: Main navigation and user profile
- `Sidebar.js`: Navigation sidebar with family groups and AI tools
- `FamilyCard.js`: Family group preview cards
- `CreateFamilyModal.js`: Modal for creating new family groups
- `EventCard.js`: Event display and creation
- `MediaGrid.js`: Photo/video gallery with upload functionality
- `ProfileCard.js`: Family member profiles and invite system
- `ChatWidget.js`: Real-time family group chat

### Utilities
- `database.js`: Database initialization and sample data
- `aiTools.js`: AI-powered media processing tools

## Getting Started

1. Open the application in a web browser
2. Create your first family group using the "Create Family" button
3. Share the invite code or link with family members
4. Start creating events and uploading photos/videos
5. Use AI tools to organize and enhance your family media

## AI Features Usage

### Face Recognition
- Upload family photos and the AI will automatically suggest member tags
- Verified profile photos improve recognition accuracy

### Duplicate Detection
- Run duplicate finder to identify similar photos
- AI suggests the highest quality version to keep

### Smart Collages
- Select multiple photos and let AI create beautiful collages
- Various layout options and themes available

### Video Highlights
- Choose photos/videos from an event
- AI generates highlight reels with transitions and suggested music

## Data Structure

### Family Groups
- Basic information (name, description)
- Admin and member management
- Unique invite codes
- Privacy and backup settings

### Events
- Title, date, and description
- Associated media uploads
- Member participation tracking

### Media Items
- Photos and videos with metadata
- Thumbnail generation
- Face recognition tags
- Quality ratings and duplicate markers

### Chat Messages
- Real-time messaging within family groups
- Message timestamps and sender information
- Support for text messages and media sharing

## Future Enhancements

### Planned Features
- Mobile app versions for iOS and Android
- Enhanced video editing capabilities
- Integration with popular cloud storage providers
- Advanced AI features for content organization
- Family tree visualization
- Event RSVP system
- Shared shopping lists and todo items

### Technical Improvements
- Offline support with sync capabilities
- Push notifications for new content
- Advanced search and filtering
- Performance optimizations
- Enhanced security features

## Support and Maintenance

This application is built using modern web technologies and is designed to be easily maintainable and extensible. Regular updates will include new features, security patches, and performance improvements.

For technical support or feature requests, please refer to the application's help section or contact the development team.

---

**Last Updated**: August 25, 2025
**Version**: 1.0.0
**Copyright**: © 2025 FamilyHub. All rights reserved.
