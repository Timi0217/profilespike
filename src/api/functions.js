import { base44 } from './base44Client';


export const createCheckoutSession = base44.functions.createCheckoutSession;

export const stripeWebhook = base44.functions.stripeWebhook;

export const processAnalysis = base44.functions.processAnalysis;

export const processCompensationAnalysis = base44.functions.processCompensationAnalysis;

export const generateCareerPath = base44.functions.generateCareerPath;

export const generateReferralCode = base44.functions.generateReferralCode;

export const setAdminRole = base44.functions.setAdminRole;

export const sendEmailWithResend = base44.functions.sendEmailWithResend;

export const adminUpdateUser = base44.functions.adminUpdateUser;

export const adminDeleteUserProfile = base44.functions.adminDeleteUserProfile;

