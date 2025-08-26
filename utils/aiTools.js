// AI-powered tools for media processing and management
class AITools {
  
  // Face recognition to automatically tag family members
  static async recognizeFaces(imageUrl, familyMembers) {
    try {
      const prompt = `Analyze this family photo and identify people based on the family member list provided. Return a JSON array with detected faces and their likely matches.`;
      
      const result = await invokeAIAgent(
        `You are an AI assistant that helps with face recognition in family photos. ${prompt}
        
        Family Members: ${JSON.stringify(familyMembers.map(m => ({ name: m.objectData.name, id: m.objectId })))}`,
        `Please analyze the image at ${imageUrl} and suggest which family members might be present.`
      );
      
      return JSON.parse(result);
    } catch (error) {
      console.error('Face recognition failed:', error);
      return [];
    }
  }
  
  // Detect duplicate photos
  static async findDuplicates(mediaItems) {
    try {
      const prompt = `Analyze these media items and identify potential duplicates based on metadata, timestamps, and descriptions.`;
      
      const result = await invokeAIAgent(
        `You are an AI assistant that helps identify duplicate media files. ${prompt}
        
        Output format: JSON array of groups where each group contains similar/duplicate items.`,
        `Media items: ${JSON.stringify(mediaItems.map(item => ({
          id: item.objectId,
          url: item.objectData.url,
          timestamp: item.createdAt,
          size: item.objectData.size
        })))}`
      );
      
      return JSON.parse(result);
    } catch (error) {
      console.error('Duplicate detection failed:', error);
      return [];
    }
  }
  
  // Generate smart photo collages
  static async createCollage(selectedPhotos, theme = 'family') {
    try {
      const prompt = `Create a photo collage layout suggestion for ${selectedPhotos.length} family photos with a ${theme} theme.`;
      
      const result = await invokeAIAgent(
        `You are an AI assistant that helps create photo collage layouts. ${prompt}
        
        Return a JSON object with layout suggestions including positioning, sizes, and styling recommendations.`,
        `Photos: ${JSON.stringify(selectedPhotos.map(photo => ({
          id: photo.objectId,
          url: photo.objectData.url,
          aspectRatio: photo.objectData.aspectRatio || '1:1'
        })))}`
      );
      
      return JSON.parse(result);
    } catch (error) {
      console.error('Collage creation failed:', error);
      return { layout: 'grid', photos: selectedPhotos };
    }
  }
  
  // Create highlight videos from events
  static async generateHighlightVideo(eventMedia, duration = 60) {
    try {
      const prompt = `Create a highlight video from event media with ${duration} seconds duration. Select the best moments and suggest transitions.`;
      
      const result = await invokeAIAgent(
        `You are an AI assistant that creates video highlights from family events. ${prompt}
        
        Return a JSON object with selected clips, timing, transitions, and music suggestions.`,
        `Event media: ${JSON.stringify(eventMedia.map(media => ({
          id: media.objectId,
          type: media.objectData.type,
          url: media.objectData.url,
          duration: media.objectData.duration
        })))}`
      );
      
      return JSON.parse(result);
    } catch (error) {
      console.error('Video generation failed:', error);
      return { clips: eventMedia, transitions: ['fade'] };
    }
  }
  
  // Generate memory reminders
  static async generateMemoryReminders(familyHistory) {
    try {
      const currentDate = new Date();
      const prompt = `Based on family history, suggest memory reminders for today (${currentDate.toDateString()}).`;
      
      const result = await invokeAIAgent(
        `You are an AI assistant that creates nostalgic memory reminders for families. ${prompt}
        
        Return a JSON array of memory suggestions with titles, descriptions, and related media.`,
        `Family history: ${JSON.stringify(familyHistory)}`
      );
      
      return JSON.parse(result);
    } catch (error) {
      console.error('Memory reminder generation failed:', error);
      return [];
    }
  }

  // Sort media by quality using AI
  static async sortMediaByQuality(mediaItems) {
    try {
      const prompt = `Analyze and sort these media items by quality, considering factors like resolution, clarity, composition, and lighting.`;
      
      const result = await invokeAIAgent(
        `You are an AI assistant that evaluates photo and video quality. ${prompt}
        
        Return the media items sorted from highest to lowest quality as a JSON array.`,
        `Media items: ${JSON.stringify(mediaItems.map(item => ({
          id: item.objectId,
          url: item.objectData.url,
          type: item.objectData.type,
          uploadedAt: item.createdAt
        })))}`
      );
      
      const sortedIds = JSON.parse(result).map(item => item.id);
      return mediaItems.sort((a, b) => {
        const indexA = sortedIds.indexOf(a.objectId);
        const indexB = sortedIds.indexOf(b.objectId);
        return indexA - indexB;
      });
    } catch (error) {
      console.error('Media sorting failed:', error);
      return mediaItems;
    }
  }

  // Organize media by detected people
  static async organizeByPeople(mediaItems, familyMembers) {
    try {
      const prompt = `Organize these media items by the people detected in them using face recognition.`;
      
      const result = await invokeAIAgent(
        `You are an AI assistant that organizes family photos by people. ${prompt}
        
        Return a JSON object with family member names as keys and arrays of media IDs as values.`,
        `Media: ${JSON.stringify(mediaItems.map(item => ({ id: item.objectId, url: item.objectData.url })))}
        Family Members: ${JSON.stringify(familyMembers.map(m => m.objectData.name))}`
      );
      
      return JSON.parse(result);
    } catch (error) {
      console.error('People organization failed:', error);
      return {};
    }
  }

  // Auto-tag media with relevant keywords
  static async autoTagMedia(mediaItem) {
    try {
      const prompt = `Analyze this family photo and suggest relevant tags based on the content, setting, activities, and emotions visible.`;
      
      const result = await invokeAIAgent(
        `You are an AI assistant that creates descriptive tags for family photos. ${prompt}
        
        Return a JSON array of relevant tags (max 10).`,
        `Image URL: ${mediaItem.objectData.url}`
      );
      
      return JSON.parse(result);
    } catch (error) {
      console.error('Auto-tagging failed:', error);
      return ['family', 'memory'];
    }
  }
}

// Export for use in other components
window.AITools = AITools;