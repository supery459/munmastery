import { Gavel, Handshake, ScrollText } from "lucide-react";
import type { CategoryMeta, LearnModule } from "@/components/learn/types";

export const CATEGORY_META: Record<LearnModule["category"], CategoryMeta> = {
  procedure: {
    id: "procedure",
    label: "Rules of Procedure",
    description: "Motions, points, speakers lists, and voting — the mechanics every delegate must know cold.",
    icon: Gavel,
    color: "#4cc9f0",
  },
  resolutions: {
    id: "resolutions",
    label: "Resolution Writing",
    description: "Clause structure, sponsors and signatories, amendments, and language that survives a vote.",
    icon: ScrollText,
    color: "#d4af6a",
  },
  strategy: {
    id: "strategy",
    label: "Strategy",
    description: "Bloc building, negotiation, and staying sharp when a crisis update changes everything.",
    icon: Handshake,
    color: "#34d399",
  },
};

export const LEARN_MODULES: LearnModule[] = [
  {
    id: "motions-and-points",
    category: "procedure",
    title: "Motions & Points",
    description: "The two families of procedure, and when to reach for each one.",
    estimatedMinutes: 5,
    relatedHref: "/simulator",
    relatedLabel: "Practice procedure in the simulator",
    steps: [
      {
        type: "content",
        heading: "The two families of procedure",
        body: [
          "Everything a delegate can raise falls into one of two categories. Motions change what the committee is doing — they require the chair to rule them in order and, usually, a vote. Points don't change committee business; they address something about your own situation, and most don't require a vote at all.",
        ],
        keyPoints: [
          "Common motions: moderated caucus, unmoderated caucus, adjournment, extend debate time, close debate, introduce a draft resolution.",
          "Common points: point of order, point of inquiry, point of personal privilege, point of parliamentary procedure.",
        ],
      },
      {
        type: "content",
        heading: "Moderated vs. unmoderated caucus",
        body: [
          "A moderated caucus keeps the chair in control: the chair sets a topic, a total time, and a per-speaker time, then calls on delegates one at a time. It's the right tool when you want structured, on-record debate on a specific sub-issue.",
          "An unmoderated caucus suspends formal speaking rules entirely. Delegates move around the room, negotiate in small groups, and draft language together. It's the right tool when the committee needs to actually write something, not just talk about it.",
        ],
      },
      {
        type: "quiz",
        question:
          "A delegate wants the committee to split into informal groups to draft a working paper together, without the chair calling on individual speakers. Which motion is this?",
        options: [
          "Motion for a moderated caucus",
          "Motion for an unmoderated caucus",
          "Point of order",
          "Motion to table the debate",
        ],
        correctIndex: 1,
        explanation:
          "An unmoderated caucus suspends formal speaking rules so delegates can negotiate freely and draft in small groups — exactly what's needed for collaborative drafting.",
      },
      {
        type: "quiz",
        question:
          "During another delegate's speech, the microphone cuts out and no one can hear them. What should you raise?",
        options: [
          "Point of inquiry",
          "Point of personal privilege",
          "Motion to close debate",
          "Point of order",
        ],
        correctIndex: 1,
        explanation:
          "A point of personal privilege addresses a delegate's ability to hear or participate — audibility, room temperature, and similar issues — and, unusually, it can interrupt a speaker.",
      },
    ],
  },
  {
    id: "speakers-and-voting",
    category: "procedure",
    title: "Speakers Lists & Voting",
    description: "How debate actually opens, and the difference between a procedural and a substantive vote.",
    estimatedMinutes: 5,
    relatedHref: "/simulator",
    relatedLabel: "Practice procedure in the simulator",
    steps: [
      {
        type: "content",
        heading: "The General Speakers List",
        body: [
          "The General Speakers List (GSL) opens debate on the topic as a whole. Delegates speak in the order they're added, for a set time, on whatever aspect of the topic they choose. The chair maintains the list and order — you get added by raising your placard when the floor opens, or by requesting it in writing.",
        ],
      },
      {
        type: "content",
        heading: "Procedural vs. substantive votes",
        body: [
          "Procedural votes decide how the committee runs its business — motions, agenda order, and similar mechanics. Nearly every rule set requires everyone to vote yes or no on procedure; abstaining isn't usually an option, since neutrality on 'how do we proceed' doesn't really make sense.",
          "Substantive votes decide policy — draft resolutions and amendments. These allow abstention, and the majority required depends on the body: a simple majority in most General Assembly committees, but a stricter threshold in bodies like the Security Council.",
        ],
      },
      {
        type: "quiz",
        question: "Which type of vote typically does NOT allow delegates to abstain?",
        options: [
          "Vote on a draft resolution",
          "Procedural vote (e.g. a motion)",
          "Vote on a friendly amendment",
          "Vote on an unfriendly amendment",
        ],
        correctIndex: 1,
        explanation:
          "Procedural votes affect how the committee runs its business, not the substance of policy — most rule sets require everyone to vote yes or no, since you can't really be neutral on procedure.",
      },
      {
        type: "quiz",
        question:
          "In the UN Security Council, a resolution needs at least how many affirmative votes out of 15 to pass (assuming no permanent-member veto)?",
        options: ["7", "8", "9", "10"],
        correctIndex: 2,
        explanation:
          "Nine of fifteen votes are required, and none of the five permanent members may cast a veto (a 'no' vote) for the resolution to pass.",
      },
    ],
  },
  {
    id: "clause-structure",
    category: "resolutions",
    title: "Clause Structure & Language",
    description: "Preambulatory vs. operative clauses, and matching your verbs to your committee's real authority.",
    estimatedMinutes: 6,
    relatedHref: "/simulator",
    relatedLabel: "See clause language in action in the simulator",
    steps: [
      {
        type: "content",
        heading: "Preambulatory vs. operative clauses",
        body: [
          "Preambulatory clauses set context — they justify why the committee is acting, but don't take action themselves. They open with a present participle or adjective phrase ('Recalling', 'Noting with concern', 'Guided by', 'Emphasizing') and end with a comma.",
          "Operative clauses are the action. They open with a present-tense verb ('Calls upon', 'Urges', 'Requests', 'Decides'), are numbered, and end with a semicolon — except the final clause, which ends with a period. Each can carry lettered or numbered sub-clauses that elaborate the main point.",
        ],
      },
      {
        type: "content",
        heading: "Getting the verbs right",
        body: [
          "The action verb has to match what your committee can actually do. General Assembly committees can recommend, call upon, and urge — soft power with no binding force. The Security Council, acting under Chapter VII, can decide, demand, and authorize — language with real teeth.",
          "Writing 'Decides to deploy peacekeeping forces' in a General Assembly committee is a classic tell that a delegate doesn't understand their body's authority — and an easy target for a rival bloc during debate.",
        ],
      },
      {
        type: "quiz",
        question: "Which phrase correctly opens an operative clause?",
        options: [
          "Deeply concerned by the recent escalation,",
          "Decides to establish a monitoring mechanism;",
          "Recalling General Assembly resolution 2625,",
          "Bearing in mind the urgency of the situation,",
        ],
        correctIndex: 1,
        explanation:
          "Operative clauses open with a present-tense action verb like 'Decides' and end in a semicolon — the other three are preambulatory framing clauses.",
      },
      {
        type: "quiz",
        question:
          "A delegate in the General Assembly's Third Committee writes an operative clause: 'Deploys peacekeeping forces to the region.' What's the problem?",
        options: [
          "Nothing — this is a correctly formatted operative clause",
          "The General Assembly cannot deploy peacekeeping forces; only the Security Council can",
          "It should be a preambulatory clause instead",
          "The verb tense is wrong",
        ],
        correctIndex: 1,
        explanation:
          "The GA can recommend or call for peacekeeping action, but only the Security Council has the authority to actually deploy forces — writing binding action beyond a body's real mandate is a common drafting mistake.",
      },
    ],
  },
  {
    id: "draft-to-adoption",
    category: "resolutions",
    title: "From Draft to Adoption",
    description: "Sponsors vs. signatories, and how friendly and unfriendly amendments actually work.",
    estimatedMinutes: 5,
    relatedHref: "/simulator",
    relatedLabel: "Practice the full committee flow in the simulator",
    steps: [
      {
        type: "content",
        heading: "Sponsors and signatories",
        body: [
          "Sponsors write and stand behind a draft resolution — they'll defend it on the floor and are expected to support its substance. Signatories just want the draft introduced and debated; signing doesn't mean you endorse it, and you're free to oppose or amend it later.",
          "Most committees require a minimum number of signatures — often around 20% of the room — before a draft can even be introduced.",
        ],
      },
      {
        type: "content",
        heading: "Friendly and unfriendly amendments",
        body: [
          "A friendly amendment is one every sponsor agrees to. It's folded directly into the text with no debate or vote required.",
          "An unfriendly amendment is one at least one sponsor objects to. It has to be introduced to the full committee, debated on its own, and voted on separately before the main resolution comes to a final vote.",
        ],
      },
      {
        type: "quiz",
        question:
          "A bloc proposes an amendment adding a new operative clause. Three of the resolution's seven sponsors disagree with the change. What happens next?",
        options: [
          "The amendment is automatically rejected since it's not unanimous",
          "The amendment becomes a 'friendly amendment' and is added without debate",
          "The amendment is 'unfriendly' and must be debated and voted on by the full committee",
          "The amendment can only be added if all seven sponsors agree",
        ],
        correctIndex: 2,
        explanation:
          "Any single sponsor objecting makes it unfriendly — it goes to the floor for debate and a committee-wide vote rather than being silently folded in.",
      },
      {
        type: "quiz",
        question: "What's the main reason to sign a draft resolution as a 'signatory' rather than a 'sponsor'?",
        options: [
          "Signatories must vote yes on the final resolution",
          "Signatories only want the draft introduced for debate, without endorsing its content",
          "Signatories get extra speaking time",
          "There is no real difference between the two",
        ],
        correctIndex: 1,
        explanation:
          "Signing just to get a draft introduced — even one you plan to oppose or heavily amend — keeps debate moving without forcing you to endorse the substance.",
      },
    ],
  },
  {
    id: "bloc-building",
    category: "strategy",
    title: "Bloc Building & Negotiation",
    description: "Finding your natural allies, and trading language without losing your core interest.",
    estimatedMinutes: 6,
    relatedHref: "/simulator",
    relatedLabel: "Practice bloc negotiation in the simulator",
    steps: [
      {
        type: "content",
        heading: "Why blocs matter",
        body: [
          "No single delegation controls a committee's outcome. Regional and ideological blocs — an African Union caucus, the European Union, the Non-Aligned Movement — pool influence, coordinate speaking points, and co-sponsor resolutions together.",
          "Identifying your natural allies early is a core strategic task, and it starts with your country's real foreign policy: who shares your priorities, and who's a predictable rival on this specific topic?",
        ],
      },
      {
        type: "content",
        heading: "Negotiating the working paper",
        body: [
          "Draft language gets built collaboratively during unmoderated caucus — this is where the real work happens. Trade specific clauses for support ('we'll back your financing language if you back our verification clause') rather than trying to win every point.",
          "Track who in the room actually has authority to commit their bloc to a position, versus who's just present. A clause 'agreed' with the wrong person can unravel later.",
        ],
      },
      {
        type: "quiz",
        question:
          "You represent a country whose bloc opposes a clause a rival bloc insists on. What's the most effective first move?",
        options: [
          "Refuse to co-sponsor and stay silent for the rest of committee",
          "Propose a compromise clause that addresses the rival bloc's core concern while preserving your bloc's key interest",
          "Immediately raise a point of order to block the clause",
          "Publicly criticize the rival bloc's position during the GSL",
        ],
        correctIndex: 1,
        explanation:
          "Effective negotiation trades toward text everyone can live with — a targeted compromise keeps you in the room and preserves influence, unlike withdrawing or grandstanding.",
      },
      {
        type: "quiz",
        question: "Why is it risky to co-sponsor a resolution before reading every operative clause?",
        options: [
          "Sponsors are legally bound by real-world treaty law",
          "You'll be expected to defend the entire text on the floor, including clauses you may not have noticed or agree with",
          "Co-sponsoring is purely symbolic and carries no real risk",
          "It isn't risky — sponsors can withdraw at any time with no consequence",
        ],
        correctIndex: 1,
        explanation:
          "As a sponsor you're expected to advocate for the whole resolution, so an overlooked clause you actually oppose can undercut your credibility on the floor.",
      },
    ],
  },
  {
    id: "crisis-management",
    category: "strategy",
    title: "Crisis Management & Time Pressure",
    description: "Staying flexible when a breaking update invalidates your plan, and answering directives fast.",
    estimatedMinutes: 6,
    relatedHref: "/crisis",
    relatedLabel: "Try the Crisis Engine",
    steps: [
      {
        type: "content",
        heading: "Staying ahead of the update",
        body: [
          "Crisis committees deliver breaking updates that can invalidate a plan mid-session. Strong delegates keep proposals modular — built from parts that can be swapped or dropped — so a single new fact doesn't collapse the whole strategy.",
          "It helps to explicitly separate 'what we know' from 'what we're assuming.' When an update lands, you only have to re-examine the assumptions it actually touches.",
        ],
      },
      {
        type: "content",
        heading: "Directives under pressure",
        body: [
          "Confidential directives demand a fast decision on incomplete information. The goal isn't a perfect answer — it's a defensible, timely one that keeps your delegation's options open.",
          "Reflexive hedging on every directive is itself a costly choice: it signals you're avoiding judgment, and it can leave your delegation without a clear position when the next update forces the issue anyway.",
        ],
      },
      {
        type: "quiz",
        question:
          "A breaking update contradicts an assumption your bloc's plan depended on. What's the strongest response?",
        options: [
          "Ignore the update and continue with the original plan since it took time to negotiate",
          "Publicly blame the delegation that proposed the original plan",
          "Quickly identify which specific parts of the plan still hold and adapt only what the update actually invalidates",
          "Call for an immediate adjournment to rewrite everything from scratch",
        ],
        correctIndex: 2,
        explanation:
          "Modular plans let you salvage what still works — wholesale panic or stubborn denial both waste the limited time a crisis committee gives you to react.",
      },
      {
        type: "quiz",
        question: "Why do experienced crisis delegates avoid maximally hedged directive responses (e.g. always 'monitor and wait')?",
        options: [
          "Hedging is always the technically correct move",
          "Committees penalize any directive response automatically",
          "Perpetual hedging signals no real position, and crisis staff read it as avoiding the harder work of judgment",
          "Directives require a written response of at least 200 words",
        ],
        correctIndex: 2,
        explanation:
          "A defensible decision — even a debatable one — demonstrates judgment. Reflexively hedging on every directive reads as avoidance, not caution.",
      },
    ],
  },
];

export function modulesByCategory(category: LearnModule["category"]): LearnModule[] {
  return LEARN_MODULES.filter((m) => m.category === category);
}

export function getModule(id: string): LearnModule | undefined {
  return LEARN_MODULES.find((m) => m.id === id);
}
