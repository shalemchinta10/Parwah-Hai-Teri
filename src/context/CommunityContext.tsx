import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Post,
  PostCategory,
  PostComment,
  ReactionType,
  ScamCampaign,
  ScamIdentifier,
  VolunteerProfile,
  CivicReport,
  AppNotification,
  AIAnalysisResponse,
  AIDocumentExplanation,
  GovServiceInfo,
  EvidenceIncident,
  EvidenceItem,
  AppTab,
} from '../types';
import {
  INITIAL_POSTS,
  INITIAL_SCAM_CAMPAIGNS,
  INITIAL_SCAM_IDENTIFIERS,
  INITIAL_VOLUNTEERS,
  INITIAL_CIVIC_REPORTS,
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface CommunityContextType {
  posts: Post[];
  scamIdentifiers: ScamIdentifier[];
  scamCampaigns: ScamCampaign[];
  volunteers: VolunteerProfile[];
  civicReports: CivicReport[];
  notifications: AppNotification[];
  savedPostIds: string[];
  incidents: EvidenceIncident[];
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isAccessibilityMode: boolean;
  toggleAccessibilityMode: () => void;

  // Global Get Help State Persistence
  currentHelpQuery: string;
  setCurrentHelpQuery: (query: string) => void;
  helpAttachment: {
    base64: string;
    name: string;
    type: 'image' | 'document' | 'video';
  } | null;
  setHelpAttachment: (
    attachment: {
      base64: string;
      name: string;
      type: 'image' | 'document' | 'video';
    } | null
  ) => void;
  isWhatHappenedOpen: boolean;
  setIsWhatHappenedOpen: (open: boolean) => void;
  launchHelpEngine: (query?: string, attachment?: any) => void;

  // Actions
  createPost: (postData: Partial<Post>) => Post;
  addComment: (postId: string, content: string, isAnonymous?: boolean) => void;
  toggleReaction: (postId: string, reaction: ReactionType) => void;
  toggleSavePost: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  checkScamIdentifier: (
    query: string
  ) => Promise<{ scamMatch?: ScamIdentifier; campaignMatch?: ScamCampaign; aiResult?: any }>;
  addVolunteerApplication: (volData: Partial<VolunteerProfile>) => void;
  createCivicReport: (reportData: Partial<CivicReport>) => void;
  upvoteCivicReport: (reportId: string) => void;
  analyzeIssueWithAI: (
    text: string,
    categoryHint?: string,
    imageBase64?: string
  ) => Promise<AIAnalysisResponse>;
  explainDocumentWithAI: (
    documentText: string,
    documentType?: string,
    language?: string,
    imageBase64?: string
  ) => Promise<AIDocumentExplanation>;
  fetchGovServiceWithAI: (query: string, category?: string) => Promise<GovServiceInfo>;
  addIncident: (title: string, category: PostCategory, description?: string) => EvidenceIncident;
  addEvidenceItem: (incidentId: string, item: Partial<EvidenceItem>) => void;
  deleteEvidenceItem: (incidentId: string, itemId: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  globalSearch: (query: string) => {
    matchedPosts: Post[];
    matchedScams: ScamIdentifier[];
    matchedCampaigns: ScamCampaign[];
    matchedCivic: CivicReport[];
  };
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<any>('home');

  // Single Source of Truth for Get Help Requests
  const [currentHelpQuery, setCurrentHelpQuery] = useState<string>('');
  const [helpAttachment, setHelpAttachment] = useState<{
    base64: string;
    name: string;
    type: 'image' | 'document' | 'video';
  } | null>(null);
  const [isWhatHappenedOpen, setIsWhatHappenedOpen] = useState<boolean>(false);

  const launchHelpEngine = (query?: string, attachment?: any) => {
    if (query !== undefined) {
      setCurrentHelpQuery(query);
    }
    if (attachment !== undefined) {
      setHelpAttachment(attachment);
    }
    setIsWhatHappenedOpen(true);
  };

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('parwah_posts') || localStorage.getItem('sahay_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [scamIdentifiers, setScamIdentifiers] = useState<ScamIdentifier[]>(() => {
    const saved = localStorage.getItem('parwah_scams') || localStorage.getItem('sahay_scams');
    return saved ? JSON.parse(saved) : INITIAL_SCAM_IDENTIFIERS;
  });

  const [scamCampaigns, setScamCampaigns] = useState<ScamCampaign[]>(() => {
    const saved = localStorage.getItem('parwah_campaigns') || localStorage.getItem('sahay_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_SCAM_CAMPAIGNS;
  });

  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>(() => {
    const saved = localStorage.getItem('parwah_volunteers') || localStorage.getItem('sahay_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  const [civicReports, setCivicReports] = useState<CivicReport[]>(() => {
    const saved = localStorage.getItem('parwah_civic') || localStorage.getItem('sahay_civic');
    return saved ? JSON.parse(saved) : INITIAL_CIVIC_REPORTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      userId: currentUser?.id || 'usr_curr_101',
      type: 'safety_alert',
      title: '🚨 High-Risk Advisory: Discom Cutoff Scam',
      message: 'Multiple reports received in Mumbai & Bengaluru regarding fake 9:30 PM electricity cutoff SMS.',
      createdAt: '2026-08-12T19:00:00Z',
      isRead: false,
    },
    {
      id: 'notif_2',
      userId: currentUser?.id || 'usr_curr_101',
      type: 'reaction',
      title: 'Reaction on your report',
      message: '@priya_tech reacted "Important" to your road safety hazard post.',
      createdAt: '2026-08-11T14:20:00Z',
      isRead: true,
    },
  ]);

  const [savedPostIds, setSavedPostIds] = useState<string[]>(currentUser?.savedPostIds || []);

  useEffect(() => {
    localStorage.setItem('parwah_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('parwah_scams', JSON.stringify(scamIdentifiers));
  }, [scamIdentifiers]);

  useEffect(() => {
    localStorage.setItem('parwah_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  const [incidents, setIncidents] = useState<EvidenceIncident[]>(() => {
    const saved = localStorage.getItem('parwah_incidents');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'inc_1',
            title: 'Fake Electricity Discom Cutoff Threat',
            category: 'scam',
            createdAt: '2026-08-11T10:00:00Z',
            description: 'Received SMS threatening electricity disconnection at 9:30 PM unless paid via unknown UPI link.',
            items: [
              {
                id: 'ev_1',
                title: 'Screenshot of Discom Threat SMS',
                type: 'screenshot',
                date: '2026-08-11',
                notes: 'Sender ID: VK-DISCOM-99. Claimed bill unpaid. Asked to call 9876543210.',
              },
              {
                id: 'ev_2',
                title: 'Note: Called Customer Care',
                type: 'note',
                date: '2026-08-11',
                notes: 'Official electricity board confirmed no dues exist. Recommended filing cyber complaint.',
              },
            ],
          },
        ];
  });

  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(() => {
    return localStorage.getItem('parwah_accessibility') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('parwah_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('parwah_accessibility', String(isAccessibilityMode));
  }, [isAccessibilityMode]);

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  // AI Document Explainer API Call
  const explainDocumentWithAI = async (
    documentText: string,
    documentType?: string,
    language?: string,
    imageBase64?: string
  ): Promise<AIDocumentExplanation> => {
    try {
      const res = await fetch('/api/ai/explain-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText, documentType, language, imageBase64 }),
      });
      const data = await res.json();
      if (data.success && data.result) return data.result;
      throw new Error('Document analysis failed');
    } catch {
      return {
        whatIsThisDocument: documentType || 'Official Communication Notice',
        whatItIsAskingMeToDo: 'Please verify the sender credentials and cross-check payment or action demands through official portals before taking action.',
        deadline: 'Review document header for explicit dates.',
        infoToVerify: [
          'Official stamp, department logo, and authorized signee name.',
          'Reference number matches your previous official filings.',
          'Official website URL ends in .gov.in or .nic.in',
        ],
        nextSteps: [
          'Do not pay through unknown personal UPI or phone numbers.',
          'File an inquiry with the official helpline or nearest service center.',
          'Keep a copy saved in your private Parwah Evidence Locker.',
        ],
        questionsToAskAuthority: [
          'What is the case reference number associated with this document?',
          'Where can I check this notice on your official website portal?',
        ],
        disclaimer: 'AI-generated document explanation. Parwah Hai Teri provides informational guidance and does not replace legal or official advice.',
      };
    }
  };

  // AI Government Services Navigator API Call
  const fetchGovServiceWithAI = async (query: string, category?: string): Promise<GovServiceInfo> => {
    try {
      const res = await fetch('/api/ai/government-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category }),
      });
      const data = await res.json();
      if (data.success && data.result) return data.result;
      throw new Error('Gov service fetch failed');
    } catch {
      return {
        id: `gov_${Date.now()}`,
        serviceName: query || 'Government Service Guidance',
        category: category || 'Citizen Services',
        description: 'Information regarding application process, required documentation, and direct official government portals.',
        eligibility: ['Indian Resident citizen with valid identity proof (Aadhaar / Voter ID).'],
        requiredDocuments: [
          'Aadhaar Card copy',
          'PAN Card / Form 60',
          'Proof of Residence (Utility bill or Rental agreement)',
          'Recent Passport Photo',
        ],
        generalProcess: [
          'Visit the official website (ending in .gov.in or .nic.in).',
          'Fill in basic details as per official ID documents.',
          'Upload required attachments and pay statutory government fee.',
          'Note down your Application Reference Number for tracking.',
        ],
        officialWebsite: 'https://www.india.gov.in',
        statusCheckInstructions: 'Enter your Application Reference Number on the official portal dashboard.',
      };
    }
  };

  // Evidence Locker Actions
  const addIncident = (title: string, category: PostCategory, description?: string): EvidenceIncident => {
    const newInc: EvidenceIncident = {
      id: `inc_${Date.now()}`,
      title,
      category,
      createdAt: new Date().toISOString(),
      description,
      items: [],
    };
    setIncidents((prev) => [newInc, ...prev]);
    return newInc;
  };

  const addEvidenceItem = (incidentId: string, item: Partial<EvidenceItem>) => {
    const newItem: EvidenceItem = {
      id: `ev_${Date.now()}`,
      title: item.title || 'Evidence Record',
      type: item.type || 'note',
      date: item.date || new Date().toISOString().split('T')[0],
      notes: item.notes,
      fileName: item.fileName,
      fileUrl: item.fileUrl,
    };

    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, items: [newItem, ...inc.items] } : inc))
    );
  };

  const deleteEvidenceItem = (incidentId: string, itemId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId ? { ...inc, items: inc.items.filter((i) => i.id !== itemId) } : inc
      )
    );
  };

  // AI Issue Analysis API Client Call
  const analyzeIssueWithAI = async (
    text: string,
    categoryHint?: string,
    imageBase64?: string
  ): Promise<AIAnalysisResponse> => {
    try {
      const response = await fetch('/api/ai/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, categoryHint, imageBase64 }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        return data.analysis;
      }
      throw new Error('Analysis failed');
    } catch {
      // Offline / network fallback
      return {
        category: (categoryHint as PostCategory) || 'scam',
        riskLevel: 'high',
        riskTitle: '⚠️ Community Advisory: High Risk Fraud Indicator',
        reasons: [
          'Pattern matches known unauthorized financial requests or pressure tactics.',
          'Never share OTP or install remote screen sharing software (AnyDesk, QuickSupport).',
        ],
        recommendedSteps: [
          'Immediately report on Cybercrime Helpline 1930.',
          'Block the sender and alert your bank if money was debited.',
        ],
        officialHelplines: [
          { name: 'National Cyber Crime Reporting Portal', number: '1930', description: 'Financial Fraud', category: 'Cybercrime', is24x7: true },
          { name: 'National Emergency Helpline', number: '112', description: 'Emergency Police', category: 'Police', is24x7: true },
        ],
        isEmergency: false,
        suggestedCommunityPostText: text,
      };
    }
  };

  // Create Community Post
  const createPost = (postData: Partial<Post>): Post => {
    const isAnon = postData.isAnonymous ?? currentUser?.isAnonymousDefault ?? false;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser?.id || 'usr_anon',
      authorUsername: isAnon ? 'Anonymous Citizen' : currentUser?.username || '@citizen',
      authorAvatar: isAnon ? undefined : currentUser?.avatarUrl,
      isAnonymous: isAnon,
      title: postData.title || 'Community Report',
      content: postData.content || '',
      category: postData.category || 'scam',
      attachments: postData.attachments || [],
      location: postData.location,
      createdAt: new Date().toISOString(),
      isPrivateVault: postData.isPrivateVault || false,
      riskLevel: postData.riskLevel || 'medium',
      aiAnalysisSummary: postData.aiAnalysisSummary,
      reactions: {
        same_issue: 0,
        can_help: 0,
        important: 0,
        verified: 0,
        resolved: 0,
      },
      userReactions: {},
      commentsCount: 0,
      mentionedHandles: extractMentions(postData.content || ''),
      reportsCount: 0,
    };

    setPosts((prev) => [newPost, ...prev]);

    // Send notifications to mentioned organizations
    newPost.mentionedHandles.forEach((handle) => {
      const notif: AppNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: handle,
        type: 'mention',
        title: `Mention in ${newPost.category} report`,
        message: `${newPost.authorUsername} mentioned ${handle} in a community report.`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    });

    return newPost;
  };

  const addComment = (postId: string, content: string, isAnonymous: boolean = false) => {
    const authorUsername = isAnonymous
      ? 'Anonymous Citizen'
      : currentUser?.username || '@citizen';

    const comment: PostComment = {
      id: `cmt_${Date.now()}`,
      postId,
      authorId: currentUser?.id || 'usr_anon',
      authorUsername,
      authorAvatar: isAnonymous ? undefined : currentUser?.avatarUrl,
      isAnonymous,
      content,
      createdAt: new Date().toISOString(),
      reactionsCount: 0,
      mentionedHandles: extractMentions(content),
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
          };
        }
        return p;
      })
    );
  };

  const toggleReaction = (postId: string, reaction: ReactionType) => {
    if (!currentUser) return;
    const userId = currentUser.id;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const currentReaction = p.userReactions[userId];
        const newReactions = { ...p.reactions };
        const newUserReactions = { ...p.userReactions };

        if (currentReaction === reaction) {
          // Remove reaction
          newReactions[reaction] = Math.max(0, newReactions[reaction] - 1);
          delete newUserReactions[userId];
        } else {
          // Add or replace reaction
          if (currentReaction) {
            newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
          }
          newReactions[reaction] = (newReactions[reaction] || 0) + 1;
          newUserReactions[userId] = reaction;
        }

        return {
          ...p,
          reactions: newReactions,
          userReactions: newUserReactions,
        };
      })
    );
  };

  const toggleSavePost = (postId: string) => {
    setSavedPostIds((prev) => {
      const exists = prev.includes(postId);
      if (exists) {
        return prev.filter((id) => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  const reportPost = (postId: string, reason: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, reportsCount: p.reportsCount + 1 } : p))
    );
  };

  const checkScamIdentifier = async (query: string) => {
    const clean = query.trim().toLowerCase();

    // 1. Direct local database check
    const matchedScam = scamIdentifiers.find((s) =>
      s.value.toLowerCase().replace(/[\s-]/g, '').includes(clean.replace(/[\s-]/g, ''))
    );

    const matchedCampaign = scamCampaigns.find((c) =>
      c.identifiers.some((i) => i.toLowerCase().includes(clean))
    );

    // 2. Query Gemini AI Backend
    try {
      const res = await fetch('/api/ai/check-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      return {
        scamMatch: matchedScam,
        campaignMatch: matchedCampaign,
        aiResult: data.result,
      };
    } catch {
      return {
        scamMatch: matchedScam,
        campaignMatch: matchedCampaign,
      };
    }
  };

  const addVolunteerApplication = (volData: Partial<VolunteerProfile>) => {
    const newVol: VolunteerProfile = {
      id: `vol_${Date.now()}`,
      userId: currentUser?.id || `usr_${Date.now()}`,
      username: currentUser?.username || '@volunteer',
      fullName: volData.fullName || currentUser?.fullName || 'Volunteer',
      email: volData.email || currentUser?.email || '',
      categories: volData.categories || ['community_support'],
      languages: volData.languages || ['English', 'Hindi'],
      locationCity: volData.locationCity || 'Mumbai',
      locationState: volData.locationState || 'Maharashtra',
      aboutMe: volData.aboutMe || '',
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      badgeCount: 0,
    };

    setVolunteers((prev) => [newVol, ...prev]);
  };

  const createCivicReport = (reportData: Partial<CivicReport>) => {
    const newReport: CivicReport = {
      id: `civ_${Date.now()}`,
      userId: currentUser?.id || 'usr_anon',
      title: reportData.title || 'Road Hazard Report',
      issueType: reportData.issueType || 'pothole',
      location: reportData.location || { city: 'Mumbai', state: 'Maharashtra' },
      description: reportData.description || '',
      imageUrl: reportData.imageUrl,
      status: 'reported',
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 1,
    };
    setCivicReports((prev) => [newReport, ...prev]);
  };

  const upvoteCivicReport = (reportId: string) => {
    setCivicReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const globalSearch = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        matchedPosts: posts,
        matchedScams: scamIdentifiers,
        matchedCampaigns: scamCampaigns,
        matchedCivic: civicReports,
      };
    }

    const matchedPosts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.authorUsername.toLowerCase().includes(q)
    );

    const matchedScams = scamIdentifiers.filter(
      (s) =>
        s.value.toLowerCase().includes(q) ||
        s.aiExplanation.toLowerCase().includes(q)
    );

    const matchedCampaigns = scamCampaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );

    const matchedCivic = civicReports.filter(
      (cr) =>
        cr.title.toLowerCase().includes(q) ||
        cr.description.toLowerCase().includes(q) ||
        cr.location.city?.toLowerCase().includes(q)
    );

    return { matchedPosts, matchedScams, matchedCampaigns, matchedCivic };
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        scamIdentifiers,
        scamCampaigns,
        volunteers,
        civicReports,
        notifications,
        savedPostIds,
        incidents,
        activeTab,
        setActiveTab,
        isAccessibilityMode,
        toggleAccessibilityMode,
        currentHelpQuery,
        setCurrentHelpQuery,
        helpAttachment,
        setHelpAttachment,
        isWhatHappenedOpen,
        setIsWhatHappenedOpen,
        launchHelpEngine,
        createPost,
        addComment,
        toggleReaction,
        toggleSavePost,
        reportPost,
        checkScamIdentifier,
        addVolunteerApplication,
        createCivicReport,
        upvoteCivicReport,
        analyzeIssueWithAI,
        explainDocumentWithAI,
        fetchGovServiceWithAI,
        addIncident,
        addEvidenceItem,
        deleteEvidenceItem,
        markNotificationAsRead,
        clearAllNotifications,
        globalSearch,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
};

function extractMentions(text: string): string[] {
  const matches = text.match(/@[a-zA-Z0-9_]+/g);
  return matches ? Array.from(new Set(matches)) : [];
}
