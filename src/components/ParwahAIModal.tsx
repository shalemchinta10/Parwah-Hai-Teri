import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  LifeBuoy,
  FileText,
  Lock,
  PhoneCall,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { AIAnalysisResponse } from '../types';
import { BrandLogo, BrandSymbolIcon } from './BrandLogo';

interface ParwahAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatHappened?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  analysis?: AIAnalysisResponse;
  isEmergency?: boolean;
}

const QUICK_OPTIONS = [
  'I need help',
  'I feel unsafe',
  'Someone is threatening me',
  'I think I\'ve been scammed',
  'I need to report something',
  'I don\'t know what to do',
];

export const ParwahAIModal: React.FC<ParwahAIModalProps> = ({
  isOpen,
  onClose,
  onOpenWhatHappened,
}) => {
  const { analyzeIssueWithAI, setActiveTab } = useCommunity();

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      text: "Hi, I'm Parwah AI. What are you going through?",
    },
  ]);

  if (!isOpen) return null;

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const res = await analyzeIssueWithAI(textToSend);

      const isHighEmergency =
        res.urgency === 'Immediate Safety / Critical' ||
        res.category === 'safety' ||
        textToSend.toLowerCase().includes('unsafe') ||
        textToSend.toLowerCase().includes('attack') ||
        textToSend.toLowerCase().includes('threat');

      let replyText = `I understand. You appear to be describing a situation related to **${res.possibleCategory}**.`;
      if (res.situationSummary) {
        replyText += `\n\n${res.situationSummary}`;
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: replyText,
        analysis: res,
        isEmergency: isHighEmergency,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackAiMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: "I am listening. I can help guide you through options and next steps safely. Tell me a bit more about what happened.",
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'msg_1',
        sender: 'ai',
        text: "Hi, I'm Parwah AI. What are you going through?",
      },
    ]);
    setInputQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <BrandSymbolIcon size="md" isDarkBg={true} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Ask your Parwah AI
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-teal-300">
                  Parwah AI
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Need help understanding a situation? We're here to help you find the right next step.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Messages */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-slate-50/50">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              } space-y-1`}
            >
              <div className="flex items-center gap-1.5 px-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {msg.sender === 'user' ? 'You' : 'Parwah AI'}
                </span>
              </div>

              <div
                className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* AI Analysis Cards Breakdown */}
                {msg.analysis && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    
                    {/* Urgency & Category Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-800 text-[11px] font-bold">
                        Category: {msg.analysis.possibleCategory}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          msg.analysis.urgency.includes('Immediate')
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        Urgency: {msg.analysis.urgency}
                      </span>
                    </div>

                    {/* What you can do now */}
                    {msg.analysis.immediateSteps && msg.analysis.immediateSteps.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>What you can do now</span>
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-700 font-medium space-y-1">
                          {msg.analysis.immediateSteps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Evidence Checklist */}
                    {msg.analysis.usefulEvidence && msg.analysis.usefulEvidence.length > 0 && (
                      <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Evidence to keep private</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.analysis.usefulEvidence.map((ev, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-[11px] font-semibold text-indigo-800"
                            >
                              ✓ {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Triggers */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenWhatHappened) onOpenWhatHappened();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Start Guided Next Steps</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {msg.isEmergency && (
                        <button
                          onClick={() => {
                            onClose();
                            setActiveTab('check');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Emergency Helplines (112)</span>
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isThinking && (
            <div className="flex items-center gap-2 text-indigo-600 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold">Parwah AI is thinking...</span>
            </div>
          )}

        </div>

        {/* Quick Options Pills */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Suggested Quick Options:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
            {QUICK_OPTIONS.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendText(opt)}
                disabled={isThinking}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-900 border border-slate-200 text-xs font-bold transition-all disabled:opacity-50"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask your Parwah AI anything..."
              disabled={isThinking}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Safety Disclaimer */}
          <p className="text-[10px] text-slate-600 font-medium text-center mt-2">
            Parwah AI provides guidance and next steps. It is not a substitute for police, emergency services (112), doctors, or legal counsel.
          </p>
        </div>

      </div>
    </div>
  );
};
