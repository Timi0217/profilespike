// Use localStorage entities for browser environment
// Database integration will be handled by API endpoints later
import { createEntity, STORAGE_KEYS, fileStorage } from './localStorage.js';
import { User } from './mockAuth.js';

// Create localStorage entities (works in browser)
export const UserProfile = createEntity(STORAGE_KEYS.USER_PROFILE);
export const Analysis = createEntity(STORAGE_KEYS.ANALYSES);
export const SavedInsight = createEntity(STORAGE_KEYS.SAVED_INSIGHTS);
export const LearningPlan = createEntity(STORAGE_KEYS.LEARNING_PLANS);
export const Article = createEntity(STORAGE_KEYS.ARTICLES);
export const EmailTemplate = createEntity(STORAGE_KEYS.EMAIL_TEMPLATES);
export const CompensationAnalysis = createEntity(STORAGE_KEYS.COMPENSATION_ANALYSES);
export const CareerPath = createEntity(STORAGE_KEYS.CAREER_PATHS);

// Export mock auth
export { User };

// Helper functions
export const getUserByEmail = async (email) => {
  const users = await User.filter({ email });
  return users[0] || null;
};

export const getUserProfile = async (userId) => {
  const profiles = await UserProfile.filter({ user_id: userId });
  return profiles[0] || null;
};

export const getAnalysesByUser = async (userId, type = null) => {
  const criteria = { user_id: userId };
  if (type) criteria.type = type;
  return Analysis.filter(criteria);
};

export const getSavedInsightsByUser = async (userId) => {
  return SavedInsight.filter({ user_id: userId });
};

// File management
export const UploadedFile = createEntity(STORAGE_KEYS.UPLOADED_FILES);
export { fileStorage };

// Enhanced analysis functions with file support
export const createAnalysisWithFile = async (analysisData, file = null) => {
  let fileId = null;
  
  if (file) {
    const uploadedFile = await fileStorage.storeFile(file, analysisData.created_by);
    fileId = uploadedFile.id;
  }
  
  const analysis = await Analysis.create({
    ...analysisData,
    file_id: fileId,
    has_file: !!file
  });
  
  return analysis;
};