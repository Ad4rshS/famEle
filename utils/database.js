// Database initialization utilities
async function initializeDatabase() {
  try {
    // Create sample families for demonstration
    const sampleFamilies = [
      {
        name: "The Johnson Family",
        description: "Our loving family sharing precious moments together",
        createdBy: "user123",
        admins: ["user123"],
        inviteCode: "JOHNSON2024",
        settings: {
          allowMemberInvite: true,
          autoFaceRecognition: true,
          cloudBackup: false
        }
      },
      {
        name: "Smith Clan",
        description: "Three generations of Smiths staying connected",
        createdBy: "user123",
        admins: ["user123"],
        inviteCode: "SMITH2024",
        settings: {
          allowMemberInvite: true,
          autoFaceRecognition: false,
          cloudBackup: true
        }
      }
    ];

    // Check if families already exist
    const existingFamilies = await trickleListObjects('family', 1, true);
    
    if (existingFamilies.items.length === 0) {
      for (const familyData of sampleFamilies) {
        try {
          const family = await trickleCreateObject('family', familyData);
          
          // Add sample members
          await trickleCreateObject(`member:${family.objectId}`, {
            userId: "user123",
            name: "John Doe",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            role: "admin",
            joinedAt: new Date().toISOString()
          });
          
          // Add sample events
          await trickleCreateObject(`event:${family.objectId}`, {
            title: "Family Reunion",
            date: "2024-12-25",
            description: "Annual Christmas family gathering",
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error creating sample data:', error);
        }
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', initializeDatabase);
}