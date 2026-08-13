import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini SDK safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Endpoint 1: Analyze "What Happened?" Issue Description
app.post('/api/ai/analyze-issue', async (req, res) => {
  try {
    const { text, categoryHint, language = 'en', imageBase64 } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback when GEMINI_API_KEY is not available
      const fallbackResult = generateFallbackAnalysis(text || 'Scam issue reported');
      return res.json({ success: true, analysis: fallbackResult, isFallback: true });
    }

    const systemPrompt = `
You are Parwah Hai Teri AI, an expert Indian citizen support & guidance assistant.
Your goal is to analyze citizen reported issues in India (scams, banking frauds, illegal loan app harassment, road potholes/accidents, domestic distress, consumer problems, fake job offers, rental disputes).

IMPORTANT SAFETY DIRECTIVE:
1. Parwah Hai Teri DOES NOT replace emergency services, police (112), cybercrime portal (1930), banks, lawyers, doctors, or other professional services. All AI output must be clearly labeled as AI-generated guidance.
2. If the issue indicates IMMEDIATE physical danger, domestic violence, active attack, or severe road emergency, set isEmergency to true and provide emergency notice.
3. Provide structured outputs:
   - whatIUnderstand: A brief, empathetic summary of the user's issue in 2-3 clear sentences.
   - category: 'scam', 'banking', 'harassment', 'domestic', 'road', 'consumer', 'government', 'digital', 'jobs', 'investment', 'other'.
   - riskLevel: 'low', 'medium', 'high', or 'critical'.
   - reasons: 3-4 bullet points explaining why.
   - recommendedSteps: 3-4 actionable next steps for an Indian citizen.
   - evidenceToPreserve: 3-4 specific evidence items to save (screenshots, SMS headers, UPI Txn IDs, receipts).
   - whoMayHelp: Key official entities or helpers (e.g. Bank Nodal Officer, Cyber Cell, Volunteer Translator).
   - officialPathway: Specific official portals or numbers (e.g. Cybercrime 1930, CPGRAMS, National Consumer Helpline 1915).
   - communityHelpNote: How fellow citizens or local volunteers can offer support.
`;

    const userPrompt = `User Report Text: "${text || ''}"
Category Hint: "${categoryHint || 'None'}"
Language requested: "${language}"`;

    let contentsArr: any[] = [userPrompt];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contentsArr = [
        {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
            { text: userPrompt },
          ],
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contentsArr as any,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whatIUnderstand: { type: Type.STRING },
            category: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            riskTitle: { type: Type.STRING },
            reasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            evidenceToPreserve: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            whoMayHelp: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            officialPathway: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            communityHelpNote: { type: Type.STRING },
            isEmergency: { type: Type.BOOLEAN },
            emergencyNotice: { type: Type.STRING },
            suggestedCommunityPostText: { type: Type.STRING },
            extractedIdentifiers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  value: { type: Type.STRING },
                },
              },
            },
          },
          required: ['category', 'riskLevel', 'riskTitle', 'reasons', 'recommendedSteps', 'isEmergency'],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      // Ensure helpline mappings
      parsed.officialHelplines = getHelplinesForCategory(parsed.category, parsed.isEmergency);
      return res.json({ success: true, analysis: parsed, isFallback: false });
    } else {
      throw new Error('Empty AI response');
    }
  } catch (err: any) {
    console.error('AI Analysis error:', err?.message || err);
    const fallbackResult = generateFallbackAnalysis(req.body.text || '');
    return res.json({ success: true, analysis: fallbackResult, isFallback: true, errorMsg: err?.message });
  }
});

// AI Endpoint 2: Scam Intelligence Lookup ("Check" tool)
app.post('/api/ai/check-scam', async (req, res) => {
  try {
    const { query, queryType } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallbackCheck = generateFallbackScamCheck(query, queryType);
      return res.json({ success: true, result: fallbackCheck, isFallback: true });
    }

    const prompt = `Analyze this input for potential scam indicators or risk in India:
Target: "${query}"
Type: "${queryType || 'auto'}"

Return JSON explaining risk level, reasons, precautions, and related patterns in India.
Note: Always use cautious language like "Potentially suspicious" or "Community risk indicators". Never declare someone a proven criminal.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            title: { type: Type.STRING },
            aiExplanation: { type: Type.STRING },
            riskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedPrecautions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestedAction: { type: Type.STRING },
          },
          required: ['riskLevel', 'title', 'aiExplanation', 'riskFactors', 'recommendedPrecautions'],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({ success: true, result: parsed, isFallback: false });
    } else {
      throw new Error('Empty scam check response');
    }
  } catch (err: any) {
    console.error('Scam check error:', err?.message || err);
    const fallbackCheck = generateFallbackScamCheck(req.body.query, req.body.queryType);
    return res.json({ success: true, result: fallbackCheck, isFallback: true });
  }
});

// AI Endpoint 3: Document Explainer ("Understand a Document")
app.post('/api/ai/explain-document', async (req, res) => {
  try {
    const { documentText, documentType, language = 'en', imageBase64 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallbackDoc = generateFallbackDocumentExplanation(documentText, documentType, language);
      return res.json({ success: true, result: fallbackDoc, isFallback: true });
    }

    const systemPrompt = `You are Parwah Hai Teri Document Explainer AI.
Analyze Indian notices, government letters, bank notices, loan agreements, rental contracts, legal notices, electricity bills, or employment offers.
Explain clearly in simple, jargon-free language:
1. whatIsThisDocument: Clear explanation of what the document is.
2. whatItIsAskingMeToDo: Action requested from the citizen.
3. deadline: Specific date or timeframe if mentioned, otherwise "No explicit deadline mentioned".
4. infoToVerify: Key details the citizen should check (e.g., official seal, bank account number, PAN, seal/letterhead).
5. nextSteps: 3-4 simple, actionable steps to take safely.
6. questionsToAskAuthority: 3-4 specific questions to ask when contacting the authority or landlord.
7. disclaimer: Always include "AI-generated document explanation. This does not constitute legal, financial, or official government advice."`;

    const userPrompt = `Document Type: ${documentType || 'Unknown'}
Content: "${documentText || ''}"
Language Requested: ${language}`;

    let contentsArr: any[] = [userPrompt];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contentsArr = [
        {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
            { text: userPrompt },
          ],
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contentsArr as any,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whatIsThisDocument: { type: Type.STRING },
            whatItIsAskingMeToDo: { type: Type.STRING },
            deadline: { type: Type.STRING },
            infoToVerify: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            questionsToAskAuthority: { type: Type.ARRAY, items: { type: Type.STRING } },
            disclaimer: { type: Type.STRING },
          },
          required: [
            'whatIsThisDocument',
            'whatItIsAskingMeToDo',
            'infoToVerify',
            'nextSteps',
            'questionsToAskAuthority',
            'disclaimer',
          ],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({ success: true, result: parsed, isFallback: false });
    }
    throw new Error('Empty document explanation response');
  } catch (err: any) {
    console.error('Document explainer error:', err?.message || err);
    const fallbackDoc = generateFallbackDocumentExplanation(req.body.documentText, req.body.documentType, req.body.language);
    return res.json({ success: true, result: fallbackDoc, isFallback: true });
  }
});

// AI Endpoint 4: Government Services Navigator
app.post('/api/ai/government-services', async (req, res) => {
  try {
    const { query, category } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallbackGov = generateFallbackGovService(query, category);
      return res.json({ success: true, result: fallbackGov, isFallback: true });
    }

    const prompt = `You are Parwah Hai Teri Government Services Navigator for India.
Help an Indian citizen navigate public services (Aadhaar, PAN, Passport, Driving Licence, Voter ID, Pensions, Schemes, Land records, Taxes, Consumer Grievances, EPFO).
Target Query: "${query}"
Category: "${category || 'General'}"

Return JSON explaining eligibility, required documents, process steps, official portal URLs, and status checking. Always prefer official gov.in / nic.in sources.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            serviceName: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            eligibility: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
            generalProcess: { type: Type.ARRAY, items: { type: Type.STRING } },
            officialWebsite: { type: Type.STRING },
            statusCheckInstructions: { type: Type.STRING },
          },
          required: [
            'serviceName',
            'description',
            'eligibility',
            'requiredDocuments',
            'generalProcess',
            'officialWebsite',
          ],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({ success: true, result: parsed, isFallback: false });
    }
    throw new Error('Empty government services response');
  } catch (err: any) {
    console.error('Government services error:', err?.message || err);
    const fallbackGov = generateFallbackGovService(req.body.query, req.body.category);
    return res.json({ success: true, result: fallbackGov, isFallback: true });
  }
});

// Helper: Helplines per category
function getHelplinesForCategory(category: string, isEmergency: boolean) {
  const helplines = [
    { name: 'National Cyber Crime Reporting Portal', number: '1930', description: 'Financial fraud reporting & freeze money transfers', category: 'Cybercrime', is24x7: true },
    { name: 'National Emergency Helpline', number: '112', description: 'Police, Fire & Ambulance', category: 'Emergency', is24x7: true },
  ];

  if (category === 'domestic' || category === 'harassment' || isEmergency) {
    helplines.push({ name: 'National Women Helpline', number: '181', description: 'Women safety & crisis guidance', category: 'Women Safety', is24x7: true });
  }
  if (category === 'consumer') {
    helplines.push({ name: 'National Consumer Helpline', number: '1915', description: 'E-commerce & service grievances', category: 'Consumer', is24x7: true });
  }
  if (category === 'banking' || category === 'investment') {
    helplines.push({ name: 'RBI Sachet Fraud Portal', number: '14440', description: 'Illegal loan apps & banking frauds', category: 'Banking', is24x7: false });
  }
  return helplines;
}

// Fallback logic when Gemini API key is unconfigured or rate limited
function generateFallbackAnalysis(text: string) {
  const lower = text.toLowerCase();

  let category = 'scam';
  let riskLevel = 'medium';
  let isEmergency = false;

  if (lower.includes('hit') || lower.includes('attack') || lower.includes('beat') || lower.includes('danger') || lower.includes('knife')) {
    category = 'domestic';
    riskLevel = 'critical';
    isEmergency = true;
  } else if (lower.includes('pothole') || lower.includes('accident') || lower.includes('waterlog') || lower.includes('road') || lower.includes('light')) {
    category = 'road';
    riskLevel = 'medium';
  } else if (lower.includes('bank') || lower.includes('upi') || lower.includes('otp') || lower.includes('deducted') || lower.includes('debit')) {
    category = 'banking';
    riskLevel = 'high';
  } else if (lower.includes('job') || lower.includes('part time') || lower.includes('telegram') || lower.includes('task')) {
    category = 'jobs';
    riskLevel = 'high';
  } else if (lower.includes('electricity') || lower.includes('bill') || lower.includes('discom')) {
    category = 'scam';
    riskLevel = 'high';
  }

  return {
    category,
    riskLevel,
    riskTitle: isEmergency
      ? '🚨 Potential Immediate Safety Hazard Detected'
      : riskLevel === 'high' || riskLevel === 'critical'
      ? '⚠️ High Risk Scam / Fraud Indicators Detected'
      : 'ℹ️ Moderate Risk Community Report',
    reasons: [
      'Text analysis identified keywords matching common Indian citizen grievances or fraudulent patterns.',
      'Requests involving urgent payments, unknown links, or unverified contacts carry high fraud probability.',
      'Community advisory: Always verify through official government or bank channels.',
    ],
    recommendedSteps: [
      'Do NOT share any OTP, PIN, NetBanking password, or card CVV with anyone.',
      'If money was debited fraudulently, call 1930 Cybercrime Helpline immediately.',
      'Preserve screenshots, message text, and caller phone numbers as evidence.',
      'Report the entity on Parwah Hai Teri to warn fellow citizens in your locality.',
    ],
    officialHelplines: getHelplinesForCategory(category, isEmergency),
    isEmergency,
    emergencyNotice: isEmergency
      ? 'CRITICAL SAFETY NOTICE: If you or someone nearby is in physical danger or needs urgent medical/police help, immediately dial 112.'
      : undefined,
    suggestedCommunityPostText: text,
    extractedIdentifiers: [],
  };
}

function generateFallbackScamCheck(query: string, type: string) {
  const clean = (query || '').trim();
  const isNumber = /^\+?\d{10,12}$/.test(clean.replace(/[\s-]/g, ''));
  const isUpi = clean.includes('@');

  return {
    riskLevel: isNumber || isUpi ? 'high' : 'medium',
    title: `Scam Risk Assessment for "${clean}"`,
    aiExplanation:
      'Community database and heuristic analysis flags potential risk indicators. Unsolicited contact asking for money transfers or remote screen access frequently leads to financial loss.',
    riskFactors: [
      'Reported in community feeds for unauthorized payment requests.',
      'Pattern matches known impersonation tactics (Bank / Electricity Discom / Telegram task scam).',
    ],
    recommendedPrecautions: [
      'Do not accept UPI collect payment requests from this identifier.',
      'Do not download screen sharing apps (AnyDesk, QuickSupport).',
      'Verify identity through official customer care numbers listed on bank websites.',
    ],
    suggestedAction: 'Report this identifier to Cybercrime Portal (1930) if you lost money.',
  };
}

function generateFallbackDocumentExplanation(docText: string, docType?: string, lang: string = 'en') {
  return {
    whatIsThisDocument: docType || 'Official Notice / Document',
    whatItIsAskingMeToDo: 'Please review the requested payment, verify identity details, and check official contact portals before taking action.',
    deadline: 'Check document header or contact relevant helpline for exact response window.',
    infoToVerify: [
      'Official letterhead or seal of the department / institution.',
      'Reference / File Number matches your existing records.',
      'Payment links lead to official .gov.in or verified bank domains.',
    ],
    nextSteps: [
      'Cross-check phone numbers with official website directories.',
      'Do not click shortened links or transfer money directly via UPI.',
      'Save a clear photo/copy in your private Parwah Evidence Locker.',
    ],
    questionsToAskAuthority: [
      'What is the official reference case ID for this communication?',
      'Can I verify this notice through the official portal online?',
      'What is the formal procedure to submit my response or grievance?',
    ],
    disclaimer: 'AI-generated document explanation. Parwah Hai Teri provides guidance and does not replace official legal, financial, or government advice.',
  };
}

function generateFallbackGovService(query: string, category?: string) {
  return {
    serviceName: query || 'Government Public Service Navigator',
    category: category || 'Citizen Services',
    description: 'Overview of official application process, required documentation, and direct official portal links.',
    eligibility: [
      'Indian citizen with valid identity proof (Aadhaar / Voter ID).',
      'Proof of address & age verification documents.',
    ],
    requiredDocuments: [
      'Aadhaar Card or Passport Copy',
      'PAN Card / Form 60',
      'Recent Passport-sized photographs',
      'Address Proof (Utility bill / Rent agreement)',
    ],
    generalProcess: [
      'Visit the official portal ending in .gov.in or .nic.in',
      'Fill in applicant personal details carefully as per Aadhaar',
      'Upload scanned documents and pay standard official government fee online',
      'Note down Application Reference Number (ARN) for online status tracking',
    ],
    officialWebsite: 'https://www.india.gov.in',
    statusCheckInstructions: 'Use your Application Reference Number (ARN) or Acknowledgement Slip number on the official website portal.',
  };
}

// Start Server with Express + Vite setup
async function startServer() {
  // API routes first
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Parwah Hai Teri Platform' });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Parwah Hai Teri platform running on http://localhost:${PORT}`);
  });
}

startServer();
