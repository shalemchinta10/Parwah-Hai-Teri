import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Camera,
  Paperclip,
  MapPin,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Globe2,
  PhoneCall,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  LifeBuoy,
  Search,
  Megaphone,
  HeartHandshake,
  Share2,
  FileText,
  Video,
  HelpCircle,
  Shield,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Scale,
  ExternalLink,
  PlusCircle,
  FolderPlus,
  EyeOff,
  MessageSquare,
  Edit3,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AIAnalysisResponse, PostCategory, AIDocumentExplanation } from '../types';
import { BrandLogo } from './BrandLogo';

interface WhatHappenedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatHappenedModal: React.FC<WhatHappenedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentHelpQuery,
    setCurrentHelpQuery,
    helpAttachment,
    setHelpAttachment,
    analyzeIssueWithAI,
    explainDocumentWithAI,
    createPost,
    setActiveTab,
    addIncident,
    addEvidenceItem,
    posts,
    volunteers,
  } = useCommunity();
  const { currentUser, ensureAuth } = useAuth();
  const { currentLanguage, t } = useLanguage();

  // Screen step: 'input' | 'guided' | 'emergency' | 'analysis' | 'doc_analysis'
  const [modalStep, setModalStep] = useState<
    'input' | 'guided' | 'emergency' | 'analysis' | 'doc_analysis'
  >('input');

  // Inline edit mode state inside analysis screen
  const [isEditingQuery, setIsEditingQuery] = useState(false);
  const [editingText, setEditingText] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Guided Questions State ("I don't know where to start")
  const [guidedStep, setGuidedStep] = useState<number>(1);
  const [guidedDanger, setGuidedDanger] = useState<boolean | null>(null);
  const [guidedTiming, setGuidedTiming] = useState<'now' | 'earlier' | 'ongoing'>('now');
  const [guidedRecords, setGuidedRecords] = useState<'yes' | 'no' | 'unsure'>('yes');
  const [guidedTopic, setGuidedTopic] = useState<string>('');

  // AI Loading & Result
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResponse | null>(null);
  const [docExplanation, setDocExplanation] = useState<AIDocumentExplanation | null>(null);

  // Reference to last analyzed key to prevent duplicate runs
  const lastAnalyzedKeyRef = useRef<string>('');

  // Publishing / Incident States
  const [postTitle, setPostTitle] = useState('');
  const [isAnonymousPost, setIsAnonymousPost] = useState(currentUser?.isAnonymousDefault ?? false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [incidentSaved, setIncidentSaved] = useState(false);
  const [showSanitizePreview, setShowSanitizePreview] = useState(false);
  const [sanitizedDraft, setSanitizedDraft] = useState('');

  // Example Prompts
  const EXAMPLE_PROMPTS = [
    'My bank debited money without OTP',
    'Loan app threatening my contacts',
    'I don\'t understand this government notice',
    'Landlord refusing deposit return',
    'Online harassment or fake profile',
    'Dangerous pothole / road hazard',
    'I received a suspicious WhatsApp message',
    'I don\'t know what to do',
  ];

  // Safety Keyword Detection
  const checkForEmergencyKeywords = (text: string): boolean => {
    const lower = text.toLowerCase();
    const dangerWords = [
      'beating me',
      'domestic violence',
      'attacking me',
      'attacked',
      'threat to life',
      'physical abuse',
      'child in danger',
      'kidnapped',
      'severe accident',
      'killing',
      'bleeding',
      'immediate physical danger',
    ];
    return dangerWords.some((word) => lower.includes(word));
  };

  // Run AI Analysis for given text / attachment
  const executeAnalysis = async (textToAnalyze: string, attachmentObj = helpAttachment) => {
    const trimmedText = textToAnalyze.trim();
    if (!trimmedText && !attachmentObj) return;

    const analysisKey = `${trimmedText}_${attachmentObj?.name || ''}`;
    lastAnalyzedKeyRef.current = analysisKey;

    // Emergency Safety Check First
    if (checkForEmergencyKeywords(trimmedText)) {
      setModalStep('emergency');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setDocExplanation(null);
    setIsEditingQuery(false);

    // Document / Notice explainer
    const isDoc =
      attachmentObj?.type === 'document' ||
      attachmentObj?.name?.toLowerCase().includes('notice') ||
      trimmedText.toLowerCase().includes('notice') ||
      trimmedText.toLowerCase().includes('government order');

    if (isDoc) {
      const docResult = await explainDocumentWithAI(
        trimmedText || 'Official document notice analysis request',
        'Official Notice / Document',
        currentLanguage.code,
        attachmentObj?.base64 || undefined
      );
      setDocExplanation(docResult);
      setIsAnalyzing(false);
      setModalStep('doc_analysis');
      return;
    }

    // Standard AI Analysis
    const result = await analyzeIssueWithAI(
      trimmedText,
      undefined,
      attachmentObj?.base64 || undefined
    );

    setIsAnalyzing(false);

    if (result.isEmergency || result.riskLevel === 'critical') {
      setModalStep('emergency');
      setAnalysisResult(result);
    } else {
      setAnalysisResult(result);
      setPostTitle(result.riskTitle || 'Citizen Safety Guidance');
      setModalStep('analysis');
    }
  };

  // Auto-run analysis when modal is open and currentHelpQuery or helpAttachment is present
  useEffect(() => {
    if (!isOpen) return;

    const activeText = currentHelpQuery.trim();
    const activeKey = `${activeText}_${helpAttachment?.name || ''}`;

    if (activeText || helpAttachment) {
      // If query is new or not analyzed yet, run analysis automatically!
      if (lastAnalyzedKeyRef.current !== activeKey || (!analysisResult && !docExplanation)) {
        executeAnalysis(activeText, helpAttachment);
      } else {
        // Already analyzed this exact query
        if (docExplanation) {
          setModalStep('doc_analysis');
        } else {
          setModalStep('analysis');
        }
      }
    } else {
      // Empty input state
      setModalStep('input');
    }
  }, [isOpen, currentHelpQuery, helpAttachment]);

  if (!isOpen) return null;

  // Handle Prompt Chip Click
  const handleSelectExample = (prompt: string) => {
    if (prompt === 'I don\'t know what to do') {
      startGuidedQuestions();
    } else {
      setCurrentHelpQuery(prompt);
      executeAnalysis(prompt);
    }
  };

  // Start Guided Questions ("I don't know where to start")
  const startGuidedQuestions = () => {
    setGuidedStep(1);
    setGuidedDanger(null);
    setGuidedTiming('now');
    setGuidedRecords('yes');
    setGuidedTopic('');
    setModalStep('guided');
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileKind: 'image' | 'document' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const att = {
          base64: reader.result as string,
          name: file.name,
          type: fileKind,
        };
        setHelpAttachment(att);
        executeAnalysis(currentHelpQuery, att);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate Voice Recording
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
        const spokenText =
          'Someone called me pretending to be from my bank saying my card is blocked. They asked for OTP and debited 15,000 rupees.';
        setCurrentHelpQuery(spokenText);
        executeAnalysis(spokenText);
      }, 4000);
    } else {
      setIsRecording(false);
    }
  };

  // Save Incident to Private Evidence Locker (requires auth)
  const handleSaveToEvidenceLocker = () => {
    if (!ensureAuth('saving incidents to your Evidence Vault')) return;
    if (!analysisResult && !docExplanation) return;

    const title = postTitle || analysisResult?.riskTitle || docExplanation?.whatIsThisDocument || 'Citizen Safety Incident';
    const cat = analysisResult?.category || 'general';
    const newInc = addIncident(title, cat, currentHelpQuery);

    if (analysisResult?.evidenceToPreserve) {
      analysisResult.evidenceToPreserve.forEach((ev) => {
        addEvidenceItem(newInc.id, {
          title: ev,
          type: 'note',
          date: new Date().toISOString().split('T')[0],
          notes: 'Identified by Parwah AI as essential evidence for this case.',
        });
      });
    }

    if (helpAttachment) {
      addEvidenceItem(newInc.id, {
        title: helpAttachment.name,
        type: helpAttachment.type === 'image' ? 'screenshot' : 'document',
        date: new Date().toISOString().split('T')[0],
        fileName: helpAttachment.name,
        fileUrl: helpAttachment.base64,
        notes: 'Uploaded by citizen during Parwah Get Help session.',
      });
    }

    setIncidentSaved(true);
  };

  // Sanitize Post Draft for Community Sharing
  const prepareSanitizedCommunityDraft = () => {
    if (!ensureAuth('sharing with the community')) return;
    if (!currentHelpQuery) return;
    let text = currentHelpQuery;
    text = text.replace(/\b[6-9]\d{9}\b/g, '[PHONE NUMBER REMOVED]');
    text = text.replace(/[\w.-]+@[\w.-]+/g, '[UPI ID REMOVED]');
    text = text.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[CARD NUMBER REMOVED]');

    const safeDraft = `Category: ${analysisResult?.category || 'General Issue'}\n\n${text}\n\nLooking for community experiences and safe guidance.`;
    setSanitizedDraft(safeDraft);
    setShowSanitizePreview(true);
  };

  // Create Community Post
  const handlePublishPost = () => {
    if (!ensureAuth('publishing community post')) return;
    if (!analysisResult) return;

    createPost({
      title: postTitle || 'Community Safety Inquiry',
      content: showSanitizePreview ? sanitizedDraft : currentHelpQuery,
      category: analysisResult.category,
      isAnonymous: isAnonymousPost,
      isPrivateVault: false,
      riskLevel: analysisResult.riskLevel,
      aiAnalysisSummary: analysisResult.reasons?.join(' ') || '',
      attachments: helpAttachment
        ? [
            {
              id: `att_${Date.now()}`,
              type: helpAttachment.type,
              url: helpAttachment.base64,
              name: helpAttachment.name,
            },
          ]
        : [],
    });

    setPostSubmitted(true);
    setTimeout(() => {
      onClose();
      resetAllHelpRequest();
      setActiveTab('feed');
    }, 1500);
  };

  const resetAllHelpRequest = () => {
    setCurrentHelpQuery('');
    setHelpAttachment(null);
    setAnalysisResult(null);
    setDocExplanation(null);
    setPostSubmitted(false);
    setIncidentSaved(false);
    setShowSanitizePreview(false);
    lastAnalyzedKeyRef.current = '';
    setModalStep('input');
  };

  // Matching similar posts
  const matchingPosts = posts.filter(
    (p) => p.category === analysisResult?.category || p.riskLevel === analysisResult?.riskLevel
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-0 sm:my-auto animate-slideUp sm:animate-scaleUp">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {modalStep !== 'input' && (
              <button
                onClick={() => {
                  if (modalStep === 'guided' && guidedStep > 1) {
                    setGuidedStep(guidedStep - 1);
                  } else {
                    setModalStep('input');
                  }
                }}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <BrandLogo variant="horizontal" size="sm" showTagline={true} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[82vh] overflow-y-auto">

          {/* CASE 1: NO INPUT YET (EMPTY FORM) */}
          {modalStep === 'input' && !isAnalyzing && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-1">
                <h3 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Tell us what's happening.</span>
                </h3>
                <p className="text-xs text-indigo-900/80 font-medium leading-relaxed">
                  You're not sure where to start? That's okay. Describe what happened in plain words, or upload a photo, notice, or voice recording.
                </p>
              </div>

              {/* Main Input Textarea */}
              <div className="space-y-2">
                <div className="relative rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-indigo-600 focus-within:bg-white transition-all shadow-xs">
                  <textarea
                    rows={4}
                    value={currentHelpQuery}
                    onChange={(e) => setCurrentHelpQuery(e.target.value)}
                    placeholder="e.g. My bank debited money without OTP, or a loan app is threatening my family..."
                    className="w-full bg-transparent p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium leading-relaxed"
                  />

                  {/* Attachment Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-t border-slate-200 bg-slate-100/60 rounded-b-2xl">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={toggleVoiceRecording}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isRecording
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                        }`}
                      >
                        <Mic className="w-4 h-4 text-amber-700" />
                        <span>Voice</span>
                      </button>

                      <label className="cursor-pointer p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-slate-700 hover:bg-slate-200 transition-all">
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span>Photo / Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'image')}
                          className="hidden"
                        />
                      </label>

                      <label className="cursor-pointer p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-slate-700 hover:bg-slate-200 transition-all">
                        <Paperclip className="w-4 h-4 text-cyan-600" />
                        <span>Notice / Document</span>
                        <input
                          type="file"
                          accept=".pdf,image/*,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, 'document')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {helpAttachment && (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[130px]">{helpAttachment.name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Voice Recorder Indicator */}
              {isRecording && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2 animate-fadeIn">
                  <p className="text-xs font-extrabold text-amber-950 flex items-center justify-center gap-2">
                    <Mic className="w-4 h-4 text-red-600 animate-pulse" />
                    <span>Listening... Speak naturally in your regional language ({recordingTime}s)</span>
                  </p>
                </div>
              )}

              {/* Example Prompts */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Or tap a frequent issue to begin immediately:
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectExample(prompt)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all text-left cursor-pointer ${
                        prompt === 'I don\'t know what to do'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md hover:bg-indigo-700 flex items-center gap-1.5'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                      }`}
                    >
                      {prompt === 'I don\'t know what to do' && (
                        <HelpCircle className="w-3.5 h-3.5 text-white" />
                      )}
                      <span>"{prompt}"</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Get Help Submit CTA */}
              <button
                type="button"
                onClick={() => executeAnalysis(currentHelpQuery)}
                disabled={!currentHelpQuery.trim() && !helpAttachment}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <span>Get Help Now</span>
              </button>
            </div>
          )}

          {/* LOADING STATE */}
          {isAnalyzing && (
            <div className="p-10 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Parwah is understanding what you're facing...
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Evaluating safety risks, official helpline pathways, evidence checklists, and legal rights...
                </p>
              </div>
            </div>
          )}

          {/* CASE 2, 3, 4, 5: INPUT ALREADY PROVIDED -> AI ANALYSIS RESULT */}
          {!isAnalyzing && (modalStep === 'analysis' || modalStep === 'doc_analysis') && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* YOU TOLD US BLOCK (WITH INLINE EDIT) */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>YOU TOLD US:</span>
                  </span>

                  {!isEditingQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingText(currentHelpQuery);
                        setIsEditingQuery(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-white/15"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {!isEditingQuery ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold leading-relaxed text-slate-100">
                      "{currentHelpQuery || 'Uploaded file / document for analysis'}"
                    </p>
                    {helpAttachment && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Attachment: {helpAttachment.name}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    <textarea
                      rows={3}
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-indigo-500/50 text-white text-xs font-medium focus:outline-none focus:border-indigo-400"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingQuery(false)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentHelpQuery(editingText);
                          executeAnalysis(editingText);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Continue & Re-analyze</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 1. WHAT WE UNDERSTAND */}
              {analysisResult && (
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>WHAT WE UNDERSTAND</span>
                    </h4>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                        analysisResult.riskLevel === 'critical' || analysisResult.riskLevel === 'high'
                          ? 'bg-red-600 text-white'
                          : 'bg-emerald-700 text-white'
                      }`}
                    >
                      {analysisResult.riskLevel} Risk
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 leading-relaxed">
                    {analysisResult.whatIUnderstand || analysisResult.riskTitle}
                  </p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Category: <span className="font-bold text-slate-900 uppercase">{analysisResult.category}</span>
                  </p>
                </div>
              )}

              {/* Document Analysis view if notice */}
              {docExplanation && (
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">WHAT WE UNDERSTAND (DOCUMENT)</span>
                  <h4 className="text-sm font-black">{docExplanation.whatIsThisDocument}</h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{docExplanation.whatItIsAskingMeToDo}</p>
                </div>
              )}

              {/* 2. WHAT YOU CAN DO NOW */}
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  <span>WHAT YOU CAN DO NOW</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-900 font-medium">
                  {(analysisResult?.recommendedSteps || docExplanation?.nextSteps || [
                    'Check your recent transaction details or communications carefully.',
                    'Contact your bank or official portal through verified official helplines only.',
                    'Preserve SMS, receipt, or screenshot evidence safely.',
                    'Never share OTP, PIN, CVV or bank passwords with anyone.',
                  ]).map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed font-semibold">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. KEEP AS EVIDENCE */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>KEEP AS EVIDENCE</span>
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    Private Locker
                  </span>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-900 font-bold">
                  {(analysisResult?.evidenceToPreserve || [
                    'Transaction screenshot or bill receipt',
                    'SMS / WhatsApp message thread',
                    'Transaction reference number & date',
                    'Caller phone number or UPI handle',
                  ]).map((item, i) => (
                    <li key={i} className="flex items-center gap-2 bg-white/90 p-2.5 rounded-xl border border-amber-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. OFFICIAL HELP */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span>OFFICIAL HELP</span>
                  </h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                    Verified Pathways
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">Cyber Fraud Helpline</span>
                      <span className="text-[10px] text-slate-500 font-medium">National Cyber Crime Portal</span>
                    </div>
                    <a
                      href="tel:1930"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1 shrink-0"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>1930</span>
                    </a>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">National Emergency</span>
                      <span className="text-[10px] text-slate-500 font-medium">Immediate Police Response</span>
                    </div>
                    <a
                      href="tel:112"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1 shrink-0"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>112</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Community Sanitized Draft Preview if active */}
              {showSanitizePreview && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 text-xs animate-fadeIn">
                  <span className="font-black text-indigo-950 block">Sanitized Draft Preview (Private data removed):</span>
                  <textarea
                    rows={3}
                    value={sanitizedDraft}
                    onChange={(e) => setSanitizedDraft(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-indigo-200 text-xs text-slate-800 font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 font-medium">
                    🔒 Phone numbers, card numbers, and UPI IDs are automatically stripped to protect your identity.
                  </p>
                </div>
              )}

              {/* 5. NEXT STEPS (ACTION BUTTONS) */}
              <div className="space-y-2 pt-1 border-t border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Next Steps:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={handleSaveToEvidenceLocker}
                    className={`p-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      incidentSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <FolderPlus className="w-4 h-4 text-amber-600" />
                    <span>{incidentSaved ? '✓ Saved' : 'Save Incident'}</span>
                  </button>

                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-indigo-600" />
                    <span>Find Official Help</span>
                  </a>

                  {!showSanitizePreview ? (
                    <button
                      type="button"
                      onClick={prepareSanitizedCommunityDraft}
                      className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share with Community</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePublishPost}
                      className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Globe2 className="w-4 h-4" />
                      <span>Publish Post</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      resetAllHelpRequest();
                    }}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-teal-300" />
                    <span>Ask Another Question</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* GUIDED QUESTIONS ("I DON'T KNOW WHERE TO START") */}
          {modalStep === 'guided' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-extrabold text-indigo-950">
                    I can help you work through this.
                  </h3>
                  <p className="text-xs text-indigo-900/80 font-medium">
                    Answer a few gentle questions so Parwah can guide you step by step.
                  </p>
                </div>
              </div>

              {guidedStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900">
                    Q1. Are you currently in immediate danger?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedDanger(true);
                        setModalStep('emergency');
                      }}
                      className="p-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 font-extrabold text-xs text-left flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="block font-black text-sm">Yes, I need help right now</span>
                        <span className="text-[11px] text-red-700 font-normal">Physical threat, violence, or severe emergency</span>
                      </div>
                      <ShieldAlert className="w-5 h-5 text-red-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGuidedDanger(false);
                        setGuidedStep(2);
                      }}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-xs text-left flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="block font-black text-sm">No, I am safe for now</span>
                        <span className="text-[11px] text-slate-500 font-normal">I need guidance or advice on what to do next</span>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </button>
                  </div>
                </div>
              )}

              {guidedStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900">
                    Q2. Is this happening right now or did it happen earlier?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedTiming('now');
                        setGuidedStep(3);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-900 font-extrabold text-xs cursor-pointer"
                    >
                      Happening Right Now
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedTiming('earlier');
                        setGuidedStep(3);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-900 font-extrabold text-xs cursor-pointer"
                    >
                      Happened Earlier
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedTiming('ongoing');
                        setGuidedStep(3);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-900 font-extrabold text-xs cursor-pointer"
                    >
                      Ongoing Issue
                    </button>
                  </div>
                </div>
              )}

              {guidedStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900">
                    Q3. Do you have any messages, documents, photos, or payment records?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedRecords('yes');
                        setGuidedStep(4);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-900 font-extrabold text-xs cursor-pointer"
                    >
                      Yes, I have records
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedRecords('no');
                        setGuidedStep(4);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-xs cursor-pointer"
                    >
                      No records
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedRecords('unsure');
                        setGuidedStep(4);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-xs cursor-pointer"
                    >
                      Not sure
                    </button>
                  </div>
                </div>
              )}

              {guidedStep === 4 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900">
                    In a few words, what is the main topic?
                  </h4>
                  <input
                    type="text"
                    value={guidedTopic}
                    onChange={(e) => setGuidedTopic(e.target.value)}
                    placeholder="e.g. Bank debited money, loan app threat, landlord deposit, pothole"
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const compiledStory = `User situation: Timing: ${guidedTiming}, Has records: ${guidedRecords}. Main topic: "${guidedTopic || 'Unspecified concern'}". Need step-by-step guidance.`;
                      setCurrentHelpQuery(compiledStory);
                      executeAnalysis(compiledStory);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    <span>Get Parwah AI Guidance</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* EMERGENCY INTERCEPTION */}
          {modalStep === 'emergency' && (
            <div className="space-y-5 p-5 rounded-3xl bg-red-50 border border-red-200 animate-scaleUp">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-red-950">
                    Are you in immediate danger right now?
                  </h3>
                  <p className="text-xs text-red-900 font-semibold leading-relaxed mt-1">
                    Your physical safety is the top priority. If you are experiencing active violence, physical attack, or life-threatening distress, please contact emergency responders immediately.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:112"
                  className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md flex items-center justify-between"
                >
                  <div>
                    <span className="block font-black text-lg">Call 112</span>
                    <span className="text-xs text-red-100 font-medium">Police & Emergency Response</span>
                  </div>
                  <PhoneCall className="w-6 h-6" />
                </a>

                <a
                  href="tel:1930"
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md flex items-center justify-between"
                >
                  <div>
                    <span className="block font-black text-lg">Call 1930</span>
                    <span className="text-xs text-slate-300 font-medium">Cybercrime Fraud Helpline</span>
                  </div>
                  <PhoneCall className="w-6 h-6" />
                </a>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalStep('analysis')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  I am in a safe location. Proceed with Parwah AI guidance →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
