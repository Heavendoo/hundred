import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  DonorPledge,
  INITIAL_PLEDGES,
  PROJECT_CONSTANTS,
} from './src/data/projectData';
import { validatePledgeForm } from './src/utils/impactMath';

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(process.cwd(), '.data');
const PLEDGES_FILE = path.join(DATA_DIR, 'pledges.json');

let memoryPledges: DonorPledge[] = [...INITIAL_PLEDGES];

function loadPledges(): DonorPledge[] {
  try {
    if (fs.existsSync(PLEDGES_FILE)) {
      const raw = fs.readFileSync(PLEDGES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to in-memory seed
  }
  return memoryPledges;
}

function savePledges(pledges: DonorPledge[]): void {
  memoryPledges = pledges;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PLEDGES_FILE, JSON.stringify(pledges, null, 2), 'utf-8');
  } catch {
    // Keep in-memory state if filesystem is read-only
  }
}

const PROJECT_SYSTEM_INSTRUCTION = `You are the official Civic Impact & Founding Green Council Advisor for Heavendoo Foundation's project "The Hundred" in Hisar, Haryana.

Answer questions clearly, concisely, and factually using ONLY the official project report specifications below:
- Organization: Heavendoo Foundation (Section 8 non-profit enterprise) operating at the nexus of civic infrastructure, ecological sustainability, and technological innovation.
- Core Mission in Hisar: Establishing an invite-only Founding Green Council of strictly 100 visionary city leaders to deploy 200 self-maintaining, zero-plastic public eco-benches (surpassing the 100+ civic seating milestone) across high-footfall markets, hospital gates, and transit hubs in Hisar at zero cost to municipal bodies.
- The Problem ("Donate-and-Forget" Trap): Standard public benches fail due to zero maintenance budgets (succumbing to rust, dust, and poster vandalism), while single-use PVC flex banners pollute streets and cities face heat stress and falling groundwater tables.
- The 4 Pillars / Outcomes:
  1. Self-Sustaining Civic Infrastructure: 200 heavy-duty steel & recycled-composite benches across prime Hisar corridors at zero municipal cost.
  2. Zero-Decay Asset Maintenance: Monthly institutional backrest sponsorships fund a dedicated field crew that washes, inspects, and services every bench weekly under a 48-hour response guarantee.
  3. 100% Plastic-Free Public Awareness: 70/30 zero-PVC backrest split — 70% allocated to vetted institutional sponsors (hospitals, diagnostic labs, banks) and 30% reserved for environmental literacy messaging and a live QR impact tracker.
  4. Compounding Ecological Reinvestment: 100% of net sponsorship surpluses are reinvested into native urban tree plantations and rainwater recharge maintenance verified by public GPS coordinates.
- 4 Implementation Phases:
  Phase 1 (Council Onboarding): Induct 100 Founding Green Patrons and map 200 high-footfall corridors backed by written Market Association and civic NOCs.
  Phase 2 (Fabrication & Grouting): Manufacture heavy-duty eco-benches with permanent metallic Patron plaques, anchor into concrete, and activate live QR serial tags.
  Phase 3 (Eco-Sponsor Activation): Allocate rotating 70/30 zero-PVC backrest panels to vetted local institutions.
  Phase 4 (Upkeep & Reinvestment): Execute weekly bench cleaning and banner swaps while reinvesting 100% of net rental surpluses into native tree plantations.
- Endowment & Contribution Details:
  - Unit Benchmark: ₹9,000 funds 1 complete heavy-duty eco-bench; ₹18,000 (2 benches) inducts a Founding Green Patron into the Council of 100.
  - Razorpay Verified Portal: https://razorpay.me/@heavendoofoundation (supports UPI, NetBanking, Debit/Credit Cards, Corporate Cards).
  - Direct Bank Transfer (NEFT / RTGS / IMPS): Account Name: Heavendoo Foundation | Bank: State Bank of India | Account Type: Current Account | Account Number: 45636621885 | IFSC Code: SBIN0000652 | Branch: MAIN BRANCH, HISAR.
  - Contact: Phone +91 86909 06006 | Email rishabh@heavendoo.org | Website hundred.heavendoo.org.

Format responses cleanly in structured markdown paragraphs or short bullet points without inventing fake statistics or unverified promises.`;

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', project: PROJECT_CONSTANTS.projectName });
  });

  app.get('/api/pledges', (_req, res) => {
    const pledges = loadPledges();
    res.json({ pledges });
  });

  app.post('/api/pledges', (req, res) => {
    const body = req.body ?? {};
    const amountInr = Number(body.amountInr);
    const input = {
      donorName: String(body.donorName ?? ''),
      organization: String(body.organization ?? ''),
      email: String(body.email ?? ''),
      phone: String(body.phone ?? ''),
      amountInr,
      corridorPreference: String(body.corridorPreference ?? ''),
      paymentMethod: (body.paymentMethod || 'Razorpay') as
        | 'Razorpay'
        | 'Bank Transfer (NEFT/RTGS)'
        | 'Council Pledge',
    };

    const validation = validatePledgeForm(input);
    if (!validation.valid) {
      res.status(400).json({ error: 'Validation failed', errors: validation.errors });
      return;
    }

    const benchesFunded = Math.max(
      0.5,
      Math.round((amountInr / PROJECT_CONSTANTS.benchUnitCostInr) * 10) / 10
    );

    const created: DonorPledge = {
      id: `pl-${Date.now()}`,
      donorName: input.donorName.trim(),
      organization: input.organization.trim() || 'Individual Citizen Donor',
      amountInr,
      benchesFunded,
      corridorPreference: input.corridorPreference.trim(),
      paymentMethod: input.paymentMethod,
      referenceNote:
        amountInr >= PROJECT_CONSTANTS.patronPairCostInr
          ? 'Founding Green Patron'
          : 'Civic Bench Contribution',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const current = loadPledges();
    const updated = [created, ...current];
    savePledges(updated);

    res.status(201).json({ pledge: created, pledges: updated });
  });

  app.post('/api/advisor', async (req, res) => {
    const question = String(req.body?.question ?? '').trim();
    if (!question) {
      res.status(400).json({ error: 'Please enter a question for the Council Advisor.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error:
          'Advisor service requires a configured GEMINI_API_KEY in the environment secrets.',
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: question,
        config: {
          systemInstruction: PROJECT_SYSTEM_INSTRUCTION,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      const answer = response.text?.trim();
      if (!answer) {
        res.status(502).json({ error: 'Advisor returned an empty response. Please try again.' });
        return;
      }

      res.json({ answer });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to reach Gemini Advisor service.';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Heavendoo The Hundred server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
