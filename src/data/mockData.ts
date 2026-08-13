import {
  HelplineInfo,
  Post,
  ScamCampaign,
  ScamIdentifier,
  UserProfile,
  VolunteerProfile,
  CivicReport,
} from '../types';

export const NATIONAL_HELPLINES: HelplineInfo[] = [
  {
    name: 'National Cyber Crime Reporting Portal',
    number: '1930',
    description: 'Immediate financial fraud reporting & freeze bank transfers (Ministry of Home Affairs, Govt of India).',
    category: 'Financial / Cyber Fraud',
    is24x7: true,
    website: 'https://cybercrime.gov.in',
  },
  {
    name: 'National Emergency Response System',
    number: '112',
    description: 'Single emergency number for Police, Fire, and Ambulance across India.',
    category: 'Police & Medical Emergency',
    is24x7: true,
    website: 'https://112.gov.in',
  },
  {
    name: 'National Women Helpline',
    number: '181',
    description: '24/7 helpline for women affected by harassment, violence, or domestic distress.',
    category: 'Women Safety',
    is24x7: true,
  },
  {
    name: 'National Consumer Helpline',
    number: '1915',
    description: 'E-commerce, banking disputes, defective products, and consumer rights grievances.',
    category: 'Consumer Grievances',
    is24x7: true,
    website: 'https://consumerhelpline.gov.in',
  },
  {
    name: 'Childline India',
    number: '1098',
    description: 'Emergency assistance for children in distress or abuse.',
    category: 'Child Safety',
    is24x7: true,
  },
  {
    name: 'RBI Sachet Fraud Portal',
    number: '14440',
    description: 'Reserve Bank of India financial fraud advisory & illegal loan apps reporting.',
    category: 'Banking / Loan Apps',
    is24x7: false,
    website: 'https://sachet.rbi.org.in',
  },
];

export const VERIFIED_ORGANIZATIONS = [
  { handle: '@CyberCell_India', name: 'Cyber Crime Cell (Citizen Advisory)', category: 'Government Body' },
  { handle: '@NationalConsumerHelpline', name: 'NCH India Official', category: 'Consumer Protection' },
  { handle: '@TrafficPolice_BLR', name: 'Bengaluru Traffic Police Safety', category: 'Public Safety' },
  { handle: '@MumbaiPolice_Civic', name: 'Mumbai Police Citizen Help Desk', category: 'Law Enforcement' },
  { handle: '@ParwahSafetyTeam', name: 'Parwah Hai Teri Moderation', category: 'Platform Team' },
  { handle: '@CyberSaathi_NGO', name: 'Cyber Saathi Digital Rights NGO', category: 'Verified NGO' },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_curr_101',
  username: '@rajesh_k',
  fullName: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isAnonymousDefault: false,
  isVolunteer: true,
  joinedDate: '2026-01-15',
  savedPostIds: ['post_202', 'post_204'],
  blockedUserIds: [],
  role: 'user',
};

export const INITIAL_SCAM_IDENTIFIERS: ScamIdentifier[] = [
  {
    id: 'scam_id_1',
    type: 'phone',
    value: '+91 98210 44321',
    riskLevel: 'high',
    reportsCount: 42,
    firstReportedAt: '2026-02-01',
    lastActiveAt: '2026-08-12',
    aiExplanation:
      'High incidence of fake Electricity Bill disconnection calls. Impersonating MSEDCL / TANGEDCO asking victims to download AnyDesk/TeamViewer or pay ₹10 via custom link.',
    recommendedPrecautions: [
      'Never download remote desktop apps (AnyDesk, TeamViewer, QuickSupport) on phone calls.',
      'Power utilities NEVER send WhatsApp messages from personal mobile numbers.',
      'Check official bill status on official state discom app or website.',
    ],
    campaignId: 'camp_elec_01',
    relatedPostIds: ['post_201'],
    verifiedByCommunityCount: 28,
  },
  {
    id: 'scam_id_2',
    type: 'upi',
    value: 'instantpayout.tech@ybl',
    riskLevel: 'critical',
    reportsCount: 89,
    firstReportedAt: '2026-01-10',
    lastActiveAt: '2026-08-11',
    aiExplanation:
      'Part-time YouTube / Telegram "Like & Earn" scam payout handle. Victims are asked to invest ₹1,000 to unlock ₹5,000 pseudo-profits.',
    recommendedPrecautions: [
      'No legitimate company pays money for clicking YouTube likes.',
      'Never send money to unverified UPI IDs claiming guaranteed daily returns.',
      'Immediately report handle on 1930 Cybercrime Portal.',
    ],
    campaignId: 'camp_job_02',
    relatedPostIds: ['post_202'],
    verifiedByCommunityCount: 64,
  },
  {
    id: 'scam_id_3',
    type: 'url',
    value: 'http://sbi-kyc-update-portal-92.online',
    riskLevel: 'critical',
    reportsCount: 115,
    firstReportedAt: '2026-03-05',
    lastActiveAt: '2026-08-10',
    aiExplanation:
      'Phishing domain spoofing SBI Yono NetBanking page. Asks for Netbanking Username, Password, and OTP under pretext of PAN card update.',
    recommendedPrecautions: [
      'Banks never ask to update KYC via .online or third-party web links.',
      'Check browser URL: Official SBI site is strictly on sbi.co.in / onlinesbi.sbi.',
      'Do not enter OTP or netbanking password on links received via SMS.',
    ],
    campaignId: 'camp_sbi_03',
    relatedPostIds: ['post_203'],
    verifiedByCommunityCount: 91,
  },
];

export const INITIAL_SCAM_CAMPAIGNS: ScamCampaign[] = [
  {
    id: 'camp_elec_01',
    title: 'Fake Discom Electricity Bill Cutoff SMS Scam',
    description:
      'Widespread SMS campaign: "Dear consumer your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Call Officer at 9821044321."',
    category: 'scam',
    identifiers: ['+91 98210 44321', '+91 97112 88410', 'paydiscom.info'],
    patternSummary:
      'Urgent cutoff deadline + Unofficial mobile phone number + Request to install screen share app or pay small fee on fake portal.',
    totalAffected: 340,
    firstSeenDate: '2026-01-05',
    status: 'active',
    officialAdvice:
      'Ministry of Power & Cyber Cell advisory: Electricity boards never send mobile numbers for bill payments. Pay only via official apps.',
  },
  {
    id: 'camp_job_02',
    title: 'Telegram YouTube "Task & Prepaid Investment" Job Scam',
    description:
      'Unsolicited WhatsApp job offers offering ₹2,000 - ₹5,000 per day for liking YouTube videos or Google Maps reviews. Leads to Telegram group where users are asked for "prepaid tasks".',
    category: 'jobs',
    identifiers: ['instantpayout.tech@ybl', 't.me/task_vip_finance', '+91 88200 11920'],
    patternSummary:
      'High payout for trivial clicks -> Initial ₹150 reward paid -> Asked to deposit ₹3,000 to clear next level -> Money locked.',
    totalAffected: 1250,
    firstSeenDate: '2025-11-20',
    status: 'active',
    officialAdvice:
      'Legitimate employers never require candidates to deposit money to work. Report such messages immediately on Cybercrime 1930.',
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_201',
    authorId: 'usr_102',
    authorUsername: 'Anonymous Citizen',
    isAnonymous: true,
    title: 'Received urgent SMS threatening Electricity Cutoff tonight at 9:30 PM',
    content:
      'I got an SMS saying: "Dear Customer, Electricity will be disconnected tonight at 9:30 PM from power office due to unpaid bill. Immediately contact Electricity Officer on 9821044321." I called the number and he asked me to install AnyDesk app to verify my bill payment receipt. Is this genuine?',
    category: 'scam',
    attachments: [
      {
        id: 'att_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        name: 'SMS_Screenshot.png',
      },
    ],
    location: { city: 'Mumbai', state: 'Maharashtra', area: 'Andheri West' },
    createdAt: '2026-08-12T18:30:00Z',
    isPrivateVault: false,
    riskLevel: 'high',
    aiAnalysisSummary:
      'AI Warning: Classic Electricity Discom Scam. NEVER install AnyDesk or TeamViewer. Power utilities do not send personal mobile numbers in SMS.',
    reactions: {
      same_issue: 18,
      can_help: 6,
      important: 34,
      verified: 12,
      resolved: 0,
    },
    userReactions: { usr_curr_101: 'important' },
    commentsCount: 8,
    mentionedHandles: ['@CyberCell_India', '@MumbaiPolice_Civic'],
    reportsCount: 0,
    campaignId: 'camp_elec_01',
    scamIdentifierId: 'scam_id_1',
  },
  {
    id: 'post_202',
    authorId: 'usr_103',
    authorUsername: '@priya_tech',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isAnonymous: false,
    title: 'Offered ₹300 per YouTube Like, lost ₹12,000 in Telegram "Prepaid Investment" trap',
    content:
      'Sharing my experience so others stay safe! Got a WhatsApp text promising ₹300/day for liking 3 YouTube videos. First day they sent ₹150 directly to my UPI handle `instantpayout.tech@ybl`. Then they invited me to a Telegram group and asked for a ₹3,000 "prepaid task" promising ₹4,500 return. Once I paid, they blocked withdrawal saying I must pay ₹9,000 more to unlock profits. Please don\'t fall for this!',
    category: 'jobs',
    attachments: [
      {
        id: 'att_2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        name: 'Telegram_Chat_Proof.png',
      },
    ],
    location: { city: 'Bengaluru', state: 'Karnataka', area: 'HSR Layout' },
    createdAt: '2026-08-11T11:15:00Z',
    isPrivateVault: false,
    riskLevel: 'critical',
    aiAnalysisSummary:
      'High Risk Job Scam. File immediate complaint on 1930 Cybercrime Portal within 2 hours ("Golden Hour") to freeze scammer UPI account.',
    reactions: {
      same_issue: 45,
      can_help: 11,
      important: 62,
      verified: 29,
      resolved: 0,
    },
    userReactions: {},
    commentsCount: 14,
    mentionedHandles: ['@CyberCell_India', '@NationalConsumerHelpline'],
    reportsCount: 0,
    campaignId: 'camp_job_02',
    scamIdentifierId: 'scam_id_2',
  },
  {
    id: 'post_203',
    authorId: 'usr_104',
    authorUsername: 'Anonymous Citizen',
    isAnonymous: true,
    title: 'Severe Waterlogging & Open Pothole near Silk Board Junction flyover',
    content:
      'Heavy rainfall has caused 2 feet deep waterlogging under Silk Board flyover. An open pothole near the bus stop is completely invisible underwater causing two two-wheelers to slip today. Local authorities please fix this urgently before an accident occurs.',
    category: 'road',
    attachments: [
      {
        id: 'att_3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
        name: 'Waterlogging_SilkBoard.jpg',
      },
    ],
    location: { city: 'Bengaluru', state: 'Karnataka', area: 'Silk Board Junction' },
    createdAt: '2026-08-12T08:00:00Z',
    isPrivateVault: false,
    riskLevel: 'medium',
    aiAnalysisSummary: 'Road Safety Hazard flagged. Tagged local traffic authorities.',
    reactions: {
      same_issue: 88,
      can_help: 15,
      important: 94,
      verified: 42,
      resolved: 0,
    },
    userReactions: { usr_curr_101: 'same_issue' },
    commentsCount: 19,
    mentionedHandles: ['@TrafficPolice_BLR'],
    reportsCount: 0,
  },
];

export const INITIAL_CIVIC_REPORTS: CivicReport[] = [
  {
    id: 'civ_01',
    userId: 'usr_104',
    title: 'Dangerous deep pothole on Outer Ring Road',
    issueType: 'pothole',
    location: { city: 'Bengaluru', state: 'Karnataka', area: 'Marathahalli Bridge' },
    description: 'A 1-foot deep pothole in the left lane right after the flyover descent. Multiple bikes damaged.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    status: 'in_progress',
    createdAt: '2026-08-10',
    upvotes: 67,
  },
  {
    id: 'civ_02',
    userId: 'usr_101',
    title: 'Broken street lights near Dadar Station West',
    issueType: 'broken_light',
    location: { city: 'Mumbai', state: 'Maharashtra', area: 'Dadar West' },
    description: 'Street lights not working for past 5 days in pedestrian alleyway. Safety risk at night.',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    status: 'reported',
    createdAt: '2026-08-11',
    upvotes: 34,
  },
];

export const INITIAL_VOLUNTEERS: VolunteerProfile[] = [
  {
    id: 'vol_01',
    userId: 'usr_vol_201',
    username: '@sunita_advocate',
    fullName: 'Sunita Deshmukh',
    email: 'sunita.legal@example.org',
    categories: ['legal_navigation', 'digital_help'],
    languages: ['English', 'Marathi', 'Hindi'],
    locationCity: 'Pune',
    locationState: 'Maharashtra',
    aboutMe:
      'Legal literacy volunteer helping senior citizens and citizens navigate online cybercrime portal filings and consumer court grievances.',
    status: 'verified',
    appliedDate: '2026-01-20',
    badgeCount: 14,
  },
  {
    id: 'vol_02',
    userId: 'usr_vol_202',
    username: '@karthik_tamil',
    fullName: 'Karthik Subramanian',
    email: 'karthik.s@example.com',
    categories: ['language', 'community_support'],
    languages: ['English', 'Tamil', 'Kannada'],
    locationCity: 'Chennai',
    locationState: 'Tamil Nadu',
    aboutMe:
      'Language translation volunteer helping non-English speakers understand official bank notifications and legal notices.',
    status: 'verified',
    appliedDate: '2026-02-10',
    badgeCount: 9,
  },
];
