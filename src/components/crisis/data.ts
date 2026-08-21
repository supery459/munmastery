import { Crosshair, TrendingDown, Wifi } from "lucide-react";
import type { CategoryMeta, CrisisEvent, Directive } from "@/components/crisis/types";

export const CATEGORY_META: Record<CrisisEvent["category"], CategoryMeta> = {
  Cyberattack: { label: "Cyberattack", icon: Wifi, color: "#4cc9f0" },
  "Economic Disruption": { label: "Economic Disruption", icon: TrendingDown, color: "#d4af6a" },
  "Regional Conflict": { label: "Regional Conflict", icon: Crosshair, color: "#fb7185" },
};

export const CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: "cyb-1",
    category: "Cyberattack",
    severity: "critical",
    headline: "State-Linked Hackers Breach Regional Power Grid Control Systems",
    brief:
      "Investigators report unauthorized access to SCADA systems controlling electricity distribution across three provinces. Officials have not ruled out a deliberate blackout attempt.",
    region: "Eastern Europe",
    source: "Cyber Threat Monitoring Unit",
  },
  {
    id: "cyb-2",
    category: "Cyberattack",
    severity: "severe",
    headline: "Coordinated DDoS Campaign Disrupts Central Bank Payment Systems",
    brief:
      "A sustained denial-of-service campaign has taken interbank settlement systems offline for over six hours, delaying an estimated $2B in transactions.",
    region: "Southeast Asia",
    source: "Financial Stability Board",
  },
  {
    id: "cyb-3",
    category: "Cyberattack",
    severity: "elevated",
    headline: "Ransomware Group Claims Breach of Port Authority Logistics Network",
    brief:
      "A criminal ransomware group claims to hold cargo manifest data for the region's largest container port and is demanding payment within 72 hours.",
    region: "West Africa",
    source: "Maritime Cyber Watch",
  },
  {
    id: "cyb-4",
    category: "Cyberattack",
    severity: "severe",
    headline: "Leaked Documents Suggest Cross-Border Espionage Targeting Trade Talks",
    brief:
      "Diplomatic cables allegedly exfiltrated from a negotiating delegation's servers have surfaced online, raising questions about the integrity of ongoing trade talks.",
    region: "Multiple regions",
    source: "Open-Source Intelligence Desk",
  },
  {
    id: "cyb-5",
    category: "Cyberattack",
    severity: "critical",
    headline: "Satellite Communications Jammed Over Contested Maritime Zone",
    brief:
      "Commercial and military satellite links have gone dark over a disputed shipping lane; several vessels report a total loss of positioning data.",
    region: "Indo-Pacific",
    source: "Satellite Operations Consortium",
  },
  {
    id: "eco-1",
    category: "Economic Disruption",
    severity: "severe",
    headline: "Sovereign Bond Yields Spike as Rating Agencies Warn of Default Risk",
    brief:
      "Yields on ten-year sovereign debt jumped 340 basis points overnight after two major agencies placed the country's credit rating on negative watch.",
    region: "South America",
    source: "Global Markets Desk",
  },
  {
    id: "eco-2",
    category: "Economic Disruption",
    severity: "elevated",
    headline: "Key Shipping Chokepoint Sees 40% Drop in Container Traffic",
    brief:
      "Insurers have sharply raised premiums for vessels transiting the strait, and several major carriers are rerouting around the region entirely.",
    region: "Middle East",
    source: "Global Trade Monitor",
  },
  {
    id: "eco-3",
    category: "Economic Disruption",
    severity: "critical",
    headline: "Currency in Free Fall After Central Bank Loses Reserve Defense",
    brief:
      "The national currency has lost nearly a third of its value against the dollar this week after the central bank exhausted its intervention reserves.",
    region: "South Asia",
    source: "IMF Surveillance Unit",
  },
  {
    id: "eco-4",
    category: "Economic Disruption",
    severity: "severe",
    headline: "Major Grain Exporter Suspends Shipments Amid Supply Concerns",
    brief:
      "The suspension threatens to remove roughly 12% of global wheat exports from the market, with import-dependent nations bracing for price shocks.",
    region: "Black Sea",
    source: "Food Security Monitoring Group",
  },
  {
    id: "eco-5",
    category: "Economic Disruption",
    severity: "elevated",
    headline: "Regional Trade Bloc Threatens Retaliatory Tariffs Over Subsidy Dispute",
    brief:
      "Members are weighing a coordinated tariff package after accusing a trading partner of illegally subsidizing its export sector.",
    region: "European Union",
    source: "Trade Policy Desk",
  },
  {
    id: "reg-1",
    category: "Regional Conflict",
    severity: "critical",
    headline: "Ceasefire Collapses as Shelling Resumes Near Contested Border",
    brief:
      "A five-week ceasefire has broken down after artillery exchanges resumed overnight; both sides blame the other for the first violation.",
    region: "Horn of Africa",
    source: "Regional Peace Monitoring Mission",
  },
  {
    id: "reg-2",
    category: "Regional Conflict",
    severity: "severe",
    headline: "Troop Buildup Reported Along Disputed Frontier",
    brief:
      "Satellite imagery shows a significant increase in armored units massing near the border over the past 48 hours.",
    region: "South Caucasus",
    source: "Defense Intelligence Pool",
  },
  {
    id: "reg-3",
    category: "Regional Conflict",
    severity: "elevated",
    headline: "Peacekeeping Convoy Delayed by Renewed Hostilities",
    brief:
      "A UN-mandated humanitarian convoy has been held at a checkpoint for over 30 hours as fighting flares along its planned route.",
    region: "Sahel",
    source: "Peacekeeping Operations Center",
  },
  {
    id: "reg-4",
    category: "Regional Conflict",
    severity: "critical",
    headline: "Airstrike Reported Near Humanitarian Corridor, Casualties Feared",
    brief:
      "Local monitors report an airstrike struck within a kilometer of a designated humanitarian corridor; casualty figures are not yet confirmed.",
    region: "Levant",
    source: "Humanitarian Access Monitoring Cell",
  },
  {
    id: "reg-5",
    category: "Regional Conflict",
    severity: "severe",
    headline: "Naval Standoff Escalates Near Disputed Reef",
    brief:
      "Coast guard vessels from two claimant states are engaged in a tense standoff, with water cannons deployed for the first time this year.",
    region: "South China Sea",
    source: "Maritime Security Watch",
  },
];

export const DIRECTIVES: Directive[] = [
  {
    id: "dir-1",
    classification: "EYES ONLY",
    from: "National Security Council",
    subject: "Grid Attack — Immediate Guidance",
    body: "Initial forensics point to a state-linked actor. The Council awaits your delegation's position before any public statement is coordinated with allies.",
    responses: [
      "Authorize public attribution",
      "Request regional cyber-defense support",
      "Maintain silence pending investigation",
      "Convene an emergency briefing",
    ],
  },
  {
    id: "dir-2",
    classification: "CONFIDENTIAL",
    from: "Ministry of Finance",
    subject: "Currency Crisis Contingency",
    body: "Reserves are depleting faster than modeled. The Ministry needs your delegation's read on multilateral options before markets open.",
    responses: [
      "Request an IMF standby facility",
      "Impose temporary capital controls",
      "Coordinate a regional currency swap line",
      "Hold position and monitor markets",
    ],
  },
  {
    id: "dir-3",
    classification: "RESTRICTED",
    from: "Regional Command",
    subject: "Border Escalation — Rules of Engagement",
    body: "Forward units are requesting updated posture guidance following the ceasefire collapse. A decision is needed within the hour.",
    responses: [
      "Reinforce defensive posture only",
      "Request UN observer deployment",
      "Open a back-channel dialogue",
      "Escalate to full alert",
    ],
  },
  {
    id: "dir-4",
    classification: "EYES ONLY",
    from: "Office of the Chief of Mission",
    subject: "Coalition Coordination Request",
    body: "Three allied delegations are drafting a joint statement and have asked whether your delegation intends to co-sign.",
    responses: [
      "Join the coalition statement",
      "Propose an independent statement",
      "Request more intelligence first",
      "Decline to comment publicly",
    ],
  },
  {
    id: "dir-5",
    classification: "CONFIDENTIAL",
    from: "Intelligence Liaison",
    subject: "Unverified Satellite Jamming Report",
    body: "The jamming report is not yet independently confirmed. Leadership wants your read before this is raised formally.",
    responses: [
      "Request satellite forensics",
      "Raise it formally at the Council",
      "Monitor quietly for now",
      "Brief allied delegations privately",
    ],
  },
  {
    id: "dir-6",
    classification: "RESTRICTED",
    from: "Trade Directorate",
    subject: "Chokepoint Disruption — Exposure Assessment",
    body: "Your economy has meaningful exposure to the disrupted trade route. The Directorate needs direction on mitigation.",
    responses: [
      "Diversify shipping routes immediately",
      "Request a multilateral escort mission",
      "Absorb short-term losses",
      "Lobby for an emergency trade facility",
    ],
  },
  {
    id: "dir-7",
    classification: "EYES ONLY",
    from: "Humanitarian Coordination Cell",
    subject: "Corridor Airstrike — Response Options",
    body: "Partner organizations are pausing operations pending guidance from delegations on how to proceed.",
    responses: [
      "Demand an independent investigation",
      "Suspend related negotiations",
      "Continue talks, raise concerns privately",
      "Call for an emergency session",
    ],
  },
];
