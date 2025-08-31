import { createEntity, STORAGE_KEYS } from './localStorage';
import { User } from './mockAuth';

// Create local storage entities
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