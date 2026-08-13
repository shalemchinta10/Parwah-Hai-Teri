export type PostCategory =
  | 'scam'
  | 'banking'
  | 'harassment'
  | 'domestic'
  | 'road'
  | 'consumer'
  | 'government'
  | 'digital'
  | 'jobs'
  | 'investment'
  | 'other';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ReactionType =
  | 'same_issue'
  | 'can_help'
  | 'important'
  | 'verified'
  | 'resolved';

export interface UserProfile {
  id: string;
  username: string; // Public display username handle e.g. @citizen_sam
  fullName?: string; // Private unless consented
  email: string;
  avatarUrl?: string;
  isAnonymousDefault: boolean;
  isVerifiedOrg?: boolean;
  orgName?: string;
  orgCategory?: string;
  isVolunteer?: boolean;
  volunteerDetails?: VolunteerProfile;
  joinedDate: string;
  savedPostIds: string[];
  blockedUserIds: string[];
  role: 'user' | 'volunteer' | 'moderator' | 'admin';
}

export interface PostAttachment {
  id: string;
  type: 'image' | 'audio' | 'document' | 'video';
  url: string;
  name: string;
  size?: string;
}

export interface PostLocation {
  city?: string;
  state?: string;
  area?: string;
  lat?: number;
  lng?: number;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
  reactionsCount: number;
  mentionedHandles?: string[];
  parentCommentId?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
  isAnonymous: boolean;
  title: string;
  content: string;
  category: PostCategory;
  attachments: PostAttachment[];
  location?: PostLocation;
  createdAt: string;
  updatedAt?: string;
  isPrivateVault: boolean; // Saved confidentially by user
  riskLevel?: RiskLevel;
  aiAnalysisSummary?: string;
  reactions: Record<ReactionType, number>;
  userReactions: Record<string, ReactionType>; // userId -> ReactionType
  commentsCount: number;
  mentionedHandles: string[];
  isResolved?: boolean;
  campaignId?: string; // Optional linked scam campaign
  scamIdentifierId?: string;
  reportsCount: number;
  isFlagged?: boolean;
}

export interface ScamIdentifier {
  id: string;
  type: 'phone' | 'upi' | 'url' | 'email' | 'social' | 'message' | 'bank_account';
  value: string; // Normalized string e.g. "9876543210" or "scam@ybl"
  riskLevel: RiskLevel;
  reportsCount: number;
  firstReportedAt: string;
  lastActiveAt: string;
  aiExplanation: string;
  recommendedPrecautions: string[];
  campaignId?: string;
  relatedPostIds: string[];
  verifiedByCommunityCount: number;
}

export interface ScamCampaign {
  id: string;
  title: string;
  description: string;
  category: PostCategory;
  identifiers: string[]; // List of UPIs, Phone numbers, URLs linked
  patternSummary: string;
  totalAffected: number;
  firstSeenDate: string;
  status: 'active' | 'investigating' | 'neutralized';
  officialAdvice: string;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  categories: (
    | 'language'
    | 'digital_help'
    | 'community_support'
    | 'accessibility'
    | 'legal_navigation'
    | 'ngo_rep'
  )[];
  languages: string[];
  locationCity: string;
  locationState: string;
  aboutMe: string;
  status: 'pending' | 'verified' | 'rejected';
  appliedDate: string;
  badgeCount: number;
}

export interface CivicReport {
  id: string;
  userId: string;
  title: string;
  issueType:
    | 'pothole'
    | 'accident'
    | 'dangerous_road'
    | 'broken_light'
    | 'waterlogging'
    | 'debris'
    | 'other';
  location: PostLocation;
  description: string;
  imageUrl?: string;
  status: 'reported' | 'in_progress' | 'resolved';
  createdAt: string;
  upvotes: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  type:
    | 'comment'
    | 'reply'
    | 'mention'
    | 'reaction'
    | 'volunteer_update'
    | 'report_status'
    | 'safety_alert';
  title: string;
  message: string;
  linkUrl?: string;
  createdAt: string;
  isRead: boolean;
  actorUsername?: string;
}

export interface HelplineInfo {
  name: string;
  number: string;
  description: string;
  category: string;
  is24x7: boolean;
  website?: string;
  iconName?: string;
}

export interface AIAnalysisRequest {
  text?: string;
  categoryHint?: string;
  language?: string;
  locationText?: string;
  hasAudio?: boolean;
  hasImage?: boolean;
}

export interface AIAnalysisResponse {
  category: PostCategory;
  riskLevel: RiskLevel;
  riskTitle: string;
  whatIUnderstand?: string;
  reasons: string[];
  recommendedSteps: string[];
  evidenceToPreserve?: string[];
  whoMayHelp?: string[];
  officialPathway?: string[];
  communityHelpNote?: string;
  officialHelplines: HelplineInfo[];
  isEmergency: boolean;
  emergencyNotice?: string;
  suggestedCommunityPostText?: string;
  extractedIdentifiers?: { type: string; value: string }[];
}

export interface AIDocumentExplanation {
  whatIsThisDocument: string;
  whatItIsAskingMeToDo: string;
  deadline?: string;
  infoToVerify: string[];
  nextSteps: string[];
  questionsToAskAuthority: string[];
  disclaimer: string;
}

export interface GovServiceInfo {
  id: string;
  serviceName: string;
  category: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  generalProcess: string[];
  officialWebsite: string;
  statusCheckInstructions?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'screenshot' | 'photo' | 'video' | 'document' | 'message' | 'receipt' | 'transaction' | 'email' | 'note';
  date: string;
  notes?: string;
  fileName?: string;
  fileUrl?: string;
}

export interface EvidenceIncident {
  id: string;
  title: string;
  category: PostCategory;
  createdAt: string;
  description?: string;
  items: EvidenceItem[];
}

export type AppTab =
  | 'home'
  | 'check'
  | 'feed'
  | 'volunteers'
  | 'notifications'
  | 'profile'
  | 'about'
  | 'doc_explainer'
  | 'money_safety'
  | 'gov_services'
  | 'nearby'
  | 'employment_housing'
  | 'family_help'
  | 'admin';

export type SupportedLanguageCode =
  | 'en'
  | 'hi'
  | 'mr'
  | 'ta'
  | 'te'
  | 'kn'
  | 'bn'
  | 'gu'
  | 'ml'
  | 'pa'
  | 'or';

export interface LanguageOption {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
}
