import { Building2, Coins, HeartPulse, Landmark, Leaf, Scale, ShieldAlert, Siren, Users } from "lucide-react";
import { WORLD_COUNTRIES } from "@/lib/world-countries";
import type { Committee, Country, Difficulty, DifficultySettings, Topic } from "@/components/simulator/types";

export const COMMITTEES: Committee[] = [
  {
    id: "unsc",
    name: "UN Security Council",
    shortName: "UNSC",
    description: "High-stakes resolutions on international peace and security.",
    icon: ShieldAlert,
  },
  {
    id: "ecosoc",
    name: "Economic & Social Council",
    shortName: "ECOSOC",
    description: "Global economic policy, development finance, and trade.",
    icon: Building2,
  },
  {
    id: "disec",
    name: "GA First Committee (DISEC)",
    shortName: "DISEC",
    description: "Disarmament, arms control, and international security.",
    icon: Scale,
  },
  {
    id: "ecofin",
    name: "GA Second Committee (ECOFIN)",
    shortName: "ECOFIN",
    description: "Macroeconomic policy, trade, taxation, and financial stability.",
    icon: Coins,
  },
  {
    id: "sochum",
    name: "GA Third Committee (SOCHUM)",
    shortName: "SOCHUM",
    description: "Social, humanitarian, and cultural affairs, and human rights.",
    icon: Users,
  },
  {
    id: "hrc",
    name: "Human Rights Council",
    shortName: "HRC",
    description: "Civil liberties, protection mandates, and accountability.",
    icon: Landmark,
  },
  {
    id: "who",
    name: "World Health Organization",
    shortName: "WHO",
    description: "Global public health policy, pandemic response, and health equity.",
    icon: HeartPulse,
  },
  {
    id: "unep",
    name: "UN Environment Programme",
    shortName: "UNEP",
    description: "Environmental protection, climate policy, and sustainable resource use.",
    icon: Leaf,
  },
  {
    id: "crisis",
    name: "Crisis Cabinet",
    shortName: "Crisis",
    description: "Fast-moving emergency response under real-time pressure.",
    icon: Siren,
  },
];

export const TOPICS: Topic[] = [
  {
    id: "maritime-security",
    committeeId: "unsc",
    title: "Maritime Security & Freedom of Navigation in the Indo-Pacific",
    brief: "Contested claims and rising naval activity threaten open sea lanes.",
    keyIssues: [
      "freedom of navigation",
      "contested maritime claims",
      "naval escalation risk",
      "supply chain security",
      "UNCLOS enforcement",
    ],
    concerns: [
      "repeating past enforcement failures",
      "favoring established naval powers",
      "underestimating escalation risk",
      "ignoring smaller littoral states",
    ],
  },
  {
    id: "ceasefire-enforcement",
    committeeId: "unsc",
    title: "Ceasefire Enforcement in an Active Regional Conflict",
    brief: "A fragile truce needs monitoring, funding, and real accountability.",
    keyIssues: [
      "ceasefire monitoring",
      "humanitarian corridors",
      "the peacekeeping mandate",
      "arms flows into the region",
      "accountability for violations",
    ],
    concerns: [
      "repeating past enforcement failures",
      "an unfunded, toothless mandate",
      "sidelining the affected population",
      "rewarding the aggressor",
    ],
  },
  {
    id: "debt-relief",
    committeeId: "ecosoc",
    title: "Sovereign Debt Relief for Climate-Vulnerable Economies",
    brief: "Rising debt service is crowding out climate adaptation spending.",
    keyIssues: [
      "debt restructuring",
      "climate adaptation financing",
      "credit rating pressure",
      "IMF conditionality",
      "green bond markets",
    ],
    concerns: [
      "sidelining the Global South",
      "attaching punitive conditionality",
      "favoring creditor nations",
      "ignoring implementation costs",
    ],
  },
  {
    id: "digital-trade",
    committeeId: "ecosoc",
    title: "Regulating Cross-Border Digital Trade & Taxation",
    brief: "Digital platforms are outpacing the tax and trade rules meant to govern them.",
    keyIssues: [
      "digital services taxation",
      "data localization requirements",
      "e-commerce access for small exporters",
      "double taxation treaties",
      "platform regulation",
    ],
    concerns: [
      "favoring large digital economies",
      "sidelining small and developing exporters",
      "ignoring enforcement capacity",
      "repeating past regulatory failures",
    ],
  },
  {
    id: "autonomous-weapons",
    committeeId: "disec",
    title: "Autonomous Weapons Systems & the Laws of Armed Conflict",
    brief: "AI-enabled weapons are advancing faster than the law governing them.",
    keyIssues: [
      "meaningful human control",
      "compliance with international humanitarian law",
      "an international verification regime",
      "export controls",
      "an arms race in AI-enabled weapons",
    ],
    concerns: [
      "favoring states with advanced AI capability",
      "an unverifiable, unenforceable regime",
      "underestimating implementation costs",
      "ignoring dual-use technology transfer",
    ],
  },
  {
    id: "outer-space",
    committeeId: "disec",
    title: "Preventing an Arms Race in Outer Space",
    brief: "Anti-satellite tests and dual-use technology are raising the stakes in orbit.",
    keyIssues: [
      "anti-satellite weapons testing",
      "space debris mitigation",
      "dual-use satellite technology",
      "a binding verification treaty",
      "commercial space governance",
    ],
    concerns: [
      "favoring established space powers",
      "an unverifiable treaty text",
      "ignoring the commercial space sector",
      "repeating past enforcement failures",
    ],
  },
  {
    id: "digital-privacy",
    committeeId: "hrc",
    title: "Digital Privacy, State Surveillance & Free Expression",
    brief: "Surveillance capability is expanding faster than rights protections.",
    keyIssues: [
      "mass surveillance programs",
      "encryption standards",
      "platform content moderation",
      "cross-border data requests",
      "protections for journalists and dissidents",
    ],
    concerns: [
      "granting states unchecked surveillance power",
      "ignoring vulnerable populations",
      "an unenforceable set of principles",
      "favoring governments over civil society",
    ],
  },
  {
    id: "urban-conflict",
    committeeId: "hrc",
    title: "Protecting Civilians in Urban Conflict Zones",
    brief: "Dense urban fighting is driving mounting civilian casualties.",
    keyIssues: [
      "proportionality in urban warfare",
      "humanitarian access",
      "protection of medical facilities",
      "accountability mechanisms",
      "displacement and refugee flows",
    ],
    concerns: [
      "an unenforceable accountability mechanism",
      "sidelining the displaced population",
      "repeating past enforcement failures",
      "favoring military necessity over civilian protection",
    ],
  },
  {
    id: "crisis-escalation",
    committeeId: "crisis",
    title: "Emergency Response to a Regional Conflict Escalation",
    brief: "A sudden escalation demands an immediate, coordinated response.",
    keyIssues: [
      "rapid ceasefire diplomacy",
      "emergency humanitarian funding",
      "regional troop deployments",
      "evacuation of civilians",
      "the risk of great-power confrontation",
    ],
    concerns: [
      "an unfunded emergency response",
      "escalating great-power confrontation",
      "sidelining regional organizations",
      "acting too slowly to matter",
    ],
  },
  {
    id: "pandemic-resurgence",
    committeeId: "crisis",
    title: "Coordinated Response to a Global Pandemic Resurgence",
    brief: "A fast-moving outbreak is testing global health cooperation again.",
    keyIssues: [
      "vaccine equity",
      "supply chain disruption",
      "cross-border travel restrictions",
      "emergency funding mechanisms",
      "misinformation control",
    ],
    concerns: [
      "repeating past vaccine inequity",
      "favoring wealthy economies",
      "an underfunded response mechanism",
      "acting too slowly to matter",
    ],
  },
  {
    id: "corporate-tax",
    committeeId: "ecofin",
    title: "Taxing Multinational Corporations in the Digital Age",
    brief: "Profit-shifting by global firms is hollowing out national tax bases.",
    keyIssues: [
      "a global minimum corporate tax rate",
      "profit shifting and tax havens",
      "revenue for developing economies",
      "enforcement and reporting standards",
      "sovereignty over national tax policy",
    ],
    concerns: [
      "favoring wealthy tax-haven economies",
      "an unenforceable minimum rate",
      "sidelining developing-country revenue needs",
      "repeating past base-erosion loopholes",
    ],
  },
  {
    id: "global-inflation",
    committeeId: "ecofin",
    title: "Addressing Global Inflation & Supply Chain Fragility",
    brief: "Synchronized price shocks and fragile supply chains threaten recovery.",
    keyIssues: [
      "synchronized monetary tightening",
      "food and energy price volatility",
      "supply chain diversification",
      "debt distress in import-dependent economies",
      "coordinated central bank policy",
    ],
    concerns: [
      "favoring advanced economies' monetary tools",
      "ignoring import-dependent economies",
      "an uncoordinated policy response",
      "underestimating second-round effects",
    ],
  },
  {
    id: "human-trafficking",
    committeeId: "sochum",
    title: "Combating Human Trafficking in Conflict-Affected Regions",
    brief: "Displacement and weak governance are fueling a surge in trafficking.",
    keyIssues: [
      "trafficking networks exploiting displacement",
      "victim identification and protection",
      "cross-border law enforcement cooperation",
      "labor exploitation in supply chains",
      "survivor reintegration support",
    ],
    concerns: [
      "criminalizing victims instead of protecting them",
      "an unenforceable cooperation framework",
      "ignoring root causes of vulnerability",
      "underfunding survivor support services",
    ],
  },
  {
    id: "indigenous-rights",
    committeeId: "sochum",
    title: "Protecting Indigenous Rights & Cultural Heritage",
    brief: "Development pressure and climate change are threatening indigenous communities.",
    keyIssues: [
      "free, prior, and informed consent",
      "land and resource rights",
      "preservation of indigenous languages and heritage",
      "climate displacement of indigenous communities",
      "representation in national decision-making",
    ],
    concerns: [
      "treating indigenous communities as an afterthought",
      "an unenforceable consent standard",
      "favoring extractive development interests",
      "ignoring climate displacement entirely",
    ],
  },
  {
    id: "pandemic-preparedness",
    committeeId: "who",
    title: "Global Pandemic Preparedness & Vaccine Equity",
    brief: "The next outbreak is a matter of when, not if — and equity remains unresolved.",
    keyIssues: [
      "equitable vaccine distribution",
      "regional manufacturing capacity",
      "early-warning surveillance systems",
      "intellectual property waivers",
      "sustained emergency financing",
    ],
    concerns: [
      "repeating past vaccine hoarding",
      "favoring pharmaceutical-producing nations",
      "an underfunded surveillance network",
      "ignoring regional manufacturing gaps",
    ],
  },
  {
    id: "obesity-crisis",
    committeeId: "who",
    title: "Regulating Ultra-Processed Food & the Global Obesity Crisis",
    brief: "Diet-related disease is rising fastest in countries least equipped to respond.",
    keyIssues: [
      "front-of-package labeling standards",
      "marketing to children",
      "sugar and salt taxation",
      "food industry lobbying influence",
      "access to affordable nutritious food",
    ],
    concerns: [
      "favoring food industry interests",
      "an unenforceable labeling standard",
      "ignoring affordability for low-income households",
      "underestimating industry lobbying power",
    ],
  },
  {
    id: "plastic-pollution",
    committeeId: "unep",
    title: "Combating Plastic Pollution in International Waters",
    brief: "Plastic waste is accumulating in the oceans faster than it can be addressed.",
    keyIssues: [
      "a binding global plastics treaty",
      "extended producer responsibility",
      "microplastic contamination",
      "waste management capacity in developing economies",
      "single-use plastic reduction targets",
    ],
    concerns: [
      "favoring plastic-producing economies",
      "an unenforceable treaty text",
      "ignoring waste management capacity gaps",
      "underestimating microplastic health risks",
    ],
  },
  {
    id: "just-transition",
    committeeId: "unep",
    title: "Financing a Just Transition Away from Fossil Fuels",
    brief: "Decarbonization must not fall hardest on workers and fossil-fuel-dependent economies.",
    keyIssues: [
      "climate finance for developing economies",
      "worker retraining and transition support",
      "phase-out timelines for fossil fuel subsidies",
      "technology transfer",
      "loss and damage funding",
    ],
    concerns: [
      "favoring wealthy economies' timelines",
      "an unfunded transition mechanism",
      "ignoring displaced fossil-fuel workers",
      "repeating past climate finance shortfalls",
    ],
  },
];

export const COUNTRIES: Country[] = [
  {
    code: "USA",
    name: "United States",
    formalName: "The United States",
    bloc: "Atlantic Alliance",
    priorities: [
      "freedom of navigation and open sea lanes",
      "strengthening alliance commitments",
      "market-based, private-sector-led solutions",
      "accountability for violations of international law",
    ],
    openers: [
      "The United States thanks the Chair for convening this session and welcomes the opportunity for frank discussion.",
      "Speaking on behalf of the American delegation, we intend to be direct with this committee.",
      "The United States has watched recent developments with great concern and does not intend to mince words.",
    ],
    stanceVerbs: [
      "remains firmly committed to",
      "will not hesitate to act on",
      "calls on all parties to uphold",
      "cannot support any measure that undermines",
    ],
    closers: [
      "The United States stands ready to lead alongside our partners on this issue.",
      "We urge this body to match rhetoric with resolve.",
    ],
  },
  {
    code: "RUS",
    name: "Russia",
    formalName: "The Russian Federation",
    bloc: "Eurasian Bloc",
    priorities: [
      "strict respect for state sovereignty",
      "rejection of unilateral coercive measures",
      "a multipolar international order",
      "non-interference in the internal affairs of member states",
    ],
    openers: [
      "The Russian Federation must state plainly that this committee risks becoming an instrument of bloc politics.",
      "On behalf of Moscow, this delegation views recent Western rhetoric on this file with grave concern.",
      "The Russian delegation will not be lectured on sovereignty by those who apply the principle selectively.",
    ],
    stanceVerbs: [
      "categorically rejects",
      "views with deep suspicion",
      "will not recognize the legitimacy of",
      "insists on strict, verifiable terms for",
    ],
    closers: [
      "Russia will not accept a resolution drafted to serve a single bloc's interests.",
      "This body must resist becoming an instrument of confrontation rather than diplomacy.",
    ],
  },
  {
    code: "CHN",
    name: "China",
    formalName: "The People's Republic of China",
    bloc: "Global Development Partnership",
    priorities: [
      "non-interference and mutual respect for sovereignty",
      "South-South cooperation and shared development",
      "a community with a shared future for mankind",
      "opposition to bloc confrontation and a Cold War mentality",
    ],
    openers: [
      "The Chinese delegation wishes to emphasize the importance of win-win cooperation on this file.",
      "China firmly upholds the purposes and principles of the UN Charter and calls for calm, patient dialogue.",
      "On behalf of Beijing, this delegation cautions against politicizing what should be a technical discussion.",
    ],
    stanceVerbs: [
      "firmly upholds",
      "calls for patient, results-oriented dialogue on",
      "cannot accept the politicization of",
      "urges maximum restraint from all parties regarding",
    ],
    closers: [
      "China stands ready to contribute to a fair and reasonable outcome for all developing nations.",
      "Dialogue, not confrontation, remains the only credible path forward.",
    ],
  },
  {
    code: "FRA",
    name: "France",
    formalName: "France",
    bloc: "European Union",
    priorities: [
      "European strategic autonomy",
      "effective, rules-based multilateralism",
      "climate and development financing",
      "the primacy of international humanitarian law",
    ],
    openers: [
      "France, speaking in close coordination with its European partners, wishes to recall the primacy of international law.",
      "Paris believes this committee has both the tools and the duty to act decisively on this file.",
      "The French delegation has consulted closely with European allies ahead of this session.",
    ],
    stanceVerbs: [
      "reaffirms its firm commitment to",
      "calls for a coordinated international response to",
      "will table concrete, actionable proposals on",
      "cannot accept continued impunity regarding",
    ],
    closers: [
      "France calls on this body to translate principle into binding action.",
      "Europe stands ready to help finance a durable solution.",
    ],
  },
  {
    code: "GBR",
    name: "United Kingdom",
    formalName: "The United Kingdom",
    bloc: "Atlantic Alliance",
    priorities: [
      "upholding the rules-based international order",
      "close coordination with allies",
      "targeted accountability mechanisms",
      "unimpeded humanitarian access",
    ],
    openers: [
      "The United Kingdom associates itself closely with our transatlantic partners on this file.",
      "London wishes to be clear: the rules-based order is not optional in this case.",
      "The UK delegation has consulted closely with allies ahead of today's session.",
    ],
    stanceVerbs: [
      "strongly condemns",
      "will pursue targeted, credible measures against",
      "calls for immediate, unimpeded access regarding",
      "reaffirms unwavering support on",
    ],
    closers: [
      "The United Kingdom will not look away while the rules-based order is tested.",
      "We urge swift, united action from this committee.",
    ],
  },
  {
    code: "IND",
    name: "India",
    formalName: "India",
    bloc: "Non-Aligned Voices",
    priorities: [
      "strategic autonomy and an independent foreign policy",
      "reform of outdated multilateral institutions",
      "the development priorities of the Global South",
      "a pragmatic, non-bloc approach to security",
    ],
    openers: [
      "India, drawing on its tradition of strategic autonomy, cautions this committee against a bloc-driven approach.",
      "The Indian delegation wishes to speak plainly on behalf of the Global South's development priorities.",
      "On behalf of over a billion citizens, India calls for pragmatism rather than posturing on this file.",
    ],
    stanceVerbs: [
      "urges a balanced, non-bloc approach to",
      "calls for genuine reform, not rhetoric, on",
      "will judge every proposal strictly on its merits regarding",
      "cannot accept a solution designed by a few and imposed on the many, concerning",
    ],
    closers: [
      "India will continue to speak for the Global South's right to a seat at this table.",
      "True multilateralism means listening to those most affected, not just the most powerful.",
    ],
  },
  {
    code: "BRA",
    name: "Brazil",
    formalName: "Brazil",
    bloc: "Global South Coalition",
    priorities: [
      "Global South solidarity and equitable representation",
      "non-intervention in domestic affairs",
      "sustainable and inclusive development financing",
      "reform of global economic governance",
    ],
    openers: [
      "Brazil, speaking for much of the Global South, wishes to highlight what is missing from this discussion.",
      "Brasília believes any durable outcome must center the priorities of developing nations.",
      "The Brazilian delegation recalls this body's shared, and so far unmet, responsibility on this file.",
    ],
    stanceVerbs: [
      "champions equitable, South-led solutions to",
      "rejects punitive conditionality attached to",
      "calls for the voices of the Global South to shape",
      "will not accept a two-tiered approach to",
    ],
    closers: [
      "Brazil stands with the Global South in demanding a genuine seat at this table.",
      "Development justice cannot wait for political convenience.",
    ],
  },
  {
    code: "KEN",
    name: "Kenya",
    formalName: "Kenya",
    bloc: "African Union Caucus",
    priorities: [
      "African-led solutions to African challenges",
      "regional stability and counterterrorism cooperation",
      "climate justice and adaptation financing",
      "debt relief and equitable development",
    ],
    openers: [
      "Kenya, speaking in coordination with fellow African Union member states, wishes to underscore the urgency of this file.",
      "On behalf of the African Group, this delegation stresses that regional ownership must guide any response.",
      "Nairobi believes this committee has too often treated Africa as a subject rather than a partner.",
    ],
    stanceVerbs: [
      "insists on African-led solutions to",
      "calls for urgent, predictable financing to address",
      "will not accept top-down mandates regarding",
      "champions regional cooperation frameworks for",
    ],
    closers: [
      "Africa is not a passive stakeholder in this debate — it must lead.",
      "Kenya calls for partnership, not paternalism.",
    ],
  },
  {
    code: "DEU",
    name: "Germany",
    formalName: "Germany",
    bloc: "European Union",
    priorities: [
      "the rules-based international order",
      "robust development and humanitarian financing",
      "multilateral verification mechanisms",
      "cautious, coordinated use of hard power",
    ],
    openers: [
      "Germany, in close coordination with European partners, wishes to state its position clearly.",
      "Berlin believes verifiable, multilateral mechanisms are essential to any credible outcome here.",
      "The German delegation has pledged significant financing and expects matching commitment from others.",
    ],
    stanceVerbs: [
      "insists on verifiable, multilateral mechanisms for",
      "will substantially increase financing to address",
      "cautions strongly against unilateral measures regarding",
      "reaffirms its unwavering commitment to the rules-based order on",
    ],
    closers: [
      "Germany believes multilateralism, patiently pursued, still delivers results.",
      "We call for verification, not just declarations.",
    ],
  },
  {
    code: "JPN",
    name: "Japan",
    formalName: "Japan",
    bloc: "Atlantic Alliance",
    priorities: [
      "a free and open, rules-based order",
      "close alliance coordination",
      "economic security and supply chain resilience",
      "constitutional constraints on the use of force",
    ],
    openers: [
      "Japan, upholding its commitment to a free and open international order, wishes to state its position.",
      "Tokyo, in close coordination with allies, underscores the urgency of this file.",
      "The Japanese delegation, mindful of its constitutional principles, calls for a measured response.",
    ],
    stanceVerbs: [
      "firmly supports a free and open approach to",
      "calls for close alliance coordination on",
      "will contribute economic and technical, though not military, support toward",
      "urges restraint and dialogue to prevent further escalation of",
    ],
    closers: [
      "Japan stands ready to contribute to peace through non-military means.",
      "Stability on this file serves the interests of the entire international community.",
    ],
  },
  {
    code: "UKR",
    name: "Ukraine",
    formalName: "Ukraine",
    bloc: "Eastern Frontline States",
    priorities: [
      "territorial sovereignty and the UN Charter",
      "accountability for violations of international law",
      "urgent security and reconstruction assistance",
      "solidarity from the international community",
    ],
    openers: [
      "Ukraine wishes to remind this body that the UN Charter is not optional, even when inconvenient.",
      "Speaking from direct experience, the Ukrainian delegation must be blunt with this committee.",
      "On behalf of a nation defending its sovereignty, Kyiv calls for clarity, not vague language.",
    ],
    stanceVerbs: [
      "demands full accountability for",
      "urges immediate, concrete support regarding",
      "will not accept a false equivalence concerning",
      "calls on every member state to state its position clearly on",
    ],
    closers: [
      "Silence in the face of aggression is itself a choice.",
      "Ukraine thanks those who have stood, and continue to stand, on the side of the Charter.",
    ],
  },
  {
    code: "NGA",
    name: "Nigeria",
    formalName: "Nigeria",
    bloc: "African Union Caucus",
    priorities: [
      "regional leadership through ECOWAS",
      "counterterrorism and security cooperation",
      "equitable development financing",
      "African representation in global governance",
    ],
    openers: [
      "Nigeria, as a leading voice within ECOWAS, wishes to stress the urgency of this file.",
      "Abuja believes regional leadership must be matched by real international support.",
      "The Nigerian delegation calls for concrete partnership, not pledges alone, on this issue.",
    ],
    stanceVerbs: [
      "champions regional leadership on",
      "calls for concrete, predictable partnership to address",
      "will not accept Africa being sidelined in decisions about",
      "insists on greater representation in the governance of",
    ],
    closers: [
      "Nigeria will continue to lead regionally while calling for genuine global partnership.",
      "Africa's voice must carry real weight in this body, not just words.",
    ],
  },
  {
    code: "CAN",
    name: "Canada",
    formalName: "Canada",
    bloc: "Atlantic Alliance",
    priorities: [
      "peacekeeping and multilateral institutions",
      "feminist and inclusive development policy",
      "climate action financing",
      "a rules-based international order",
    ],
    openers: [
      "Canada wishes to reaffirm its longstanding commitment to peacekeeping and multilateral solutions.",
      "Ottawa believes this committee's credibility depends on inclusive, evidence-based outcomes.",
      "The Canadian delegation has consulted closely with allies ahead of today's session.",
    ],
    stanceVerbs: [
      "champions an inclusive, multilateral approach to",
      "calls for evidence-based, gender-responsive measures on",
      "will contribute peacekeeping and technical capacity toward",
      "cannot support a unilateral approach to",
    ],
    closers: [
      "Canada stands ready to contribute peacekeeping capacity and technical expertise.",
      "Multilateralism, done well, remains our strongest tool here.",
    ],
  },
  {
    code: "MEX",
    name: "Mexico",
    formalName: "Mexico",
    bloc: "Latin American Bloc",
    priorities: [
      "regional stability in Latin America",
      "migration governance rooted in human rights",
      "South-South development cooperation",
      "non-intervention and peaceful dispute resolution",
    ],
    openers: [
      "Mexico, speaking for much of the region, wishes to center human rights in this discussion.",
      "Mexico City believes durable solutions must come from dialogue, not coercion.",
      "The Mexican delegation recalls this body's uneven attention to Latin American priorities.",
    ],
    stanceVerbs: [
      "insists on a human-rights-centered approach to",
      "calls for regional ownership of solutions to",
      "rejects coercive unilateral measures regarding",
      "champions South-South cooperation on",
    ],
    closers: [
      "Mexico calls for solutions built with the region, not imposed on it.",
      "Dialogue remains our tradition and our recommendation to this body.",
    ],
  },
  {
    code: "ZAF",
    name: "South Africa",
    formalName: "South Africa",
    bloc: "African Union Caucus",
    priorities: [
      "reform of global governance institutions",
      "African Union coordination and solidarity",
      "equitable access to development finance",
      "accountability for historical injustice",
    ],
    openers: [
      "South Africa, speaking with the weight of its own history, cannot accept half-measures here.",
      "Pretoria believes genuine reform requires confronting uncomfortable power imbalances.",
      "The South African delegation stands firmly with the broader African position on this file.",
    ],
    stanceVerbs: [
      "demands structural reform of",
      "will not accept a token response to",
      "insists on accountability regarding",
      "champions African-led solutions to",
    ],
    closers: [
      "South Africa did not overcome injustice at home to stay silent on injustice abroad.",
      "Real reform, not rhetoric, is what this moment demands.",
    ],
  },
  {
    code: "EGY",
    name: "Egypt",
    formalName: "The Arab Republic of Egypt",
    bloc: "Middle East Coalition",
    priorities: [
      "regional stability and mediation",
      "Nile Basin water security",
      "Arab League coordination",
      "counterterrorism cooperation",
    ],
    openers: [
      "Egypt, drawing on its history as a regional mediator, urges calm and careful diplomacy.",
      "Cairo believes stability in the region cannot be separated from this committee's decisions.",
      "The Egyptian delegation speaks with the weight of regional consequence in mind.",
    ],
    stanceVerbs: [
      "urges regional mediation and dialogue on",
      "will not accept measures that destabilize",
      "calls for careful, phased action regarding",
      "insists on respect for water and resource security in",
    ],
    closers: [
      "Egypt stands ready to mediate where others cannot.",
      "Regional stability must remain this committee's compass.",
    ],
  },
  {
    code: "SAU",
    name: "Saudi Arabia",
    formalName: "The Kingdom of Saudi Arabia",
    bloc: "Middle East Coalition",
    priorities: [
      "regional security and stability",
      "energy market stability",
      "Gulf Cooperation Council coordination",
      "gradual, sovereignty-respecting reform",
    ],
    openers: [
      "The Kingdom of Saudi Arabia wishes to underscore the centrality of regional stability to this file.",
      "Riyadh, in coordination with Gulf partners, calls for measured, sovereignty-respecting action.",
      "The Saudi delegation cautions against solutions designed without regional input.",
    ],
    stanceVerbs: [
      "insists on regional stability as a precondition for",
      "will coordinate closely with Gulf partners on",
      "cautions against externally imposed timelines for",
      "supports gradual, sovereignty-respecting progress on",
    ],
    closers: [
      "The Kingdom stands ready to contribute to regional stability through patient diplomacy.",
      "Lasting solutions must respect the sovereignty of those most affected.",
    ],
  },
  {
    code: "ISR",
    name: "Israel",
    formalName: "The State of Israel",
    bloc: "Middle East Coalition",
    priorities: [
      "national security and self-defense",
      "regional normalization agreements",
      "technology and innovation partnerships",
      "combating regional terrorism",
    ],
    openers: [
      "Israel wishes to state plainly that security concerns cannot be treated as an afterthought.",
      "Jerusalem believes this committee must acknowledge the security realities facing the region.",
      "The Israeli delegation will not accept a framing that ignores its right to self-defense.",
    ],
    stanceVerbs: [
      "will not compromise on the security of",
      "champions technology-driven solutions to",
      "insists on explicit recognition of the right to self-defense regarding",
      "calls for regional partnerships to address",
    ],
    closers: [
      "Israel stands ready to partner with any state genuinely committed to regional security.",
      "Security and dialogue are not mutually exclusive — we pursue both.",
    ],
  },
  {
    code: "TUR",
    name: "Turkey",
    formalName: "The Republic of Türkiye",
    bloc: "Middle East Coalition",
    priorities: [
      "regional mediation and independent foreign policy",
      "counterterrorism and border security",
      "humanitarian leadership on displacement",
      "NATO and regional coordination balanced with autonomy",
    ],
    openers: [
      "Türkiye, bridging two continents, believes it has a unique role to play in this discussion.",
      "Ankara has hosted more displaced persons than nearly any nation and speaks from direct experience.",
      "The Turkish delegation calls for pragmatic, independent-minded solutions.",
    ],
    stanceVerbs: [
      "calls for pragmatic, independent solutions to",
      "insists on burden-sharing regarding",
      "will pursue an independent foreign policy line on",
      "champions humanitarian leadership on",
    ],
    closers: [
      "Türkiye has carried this burden before and will speak plainly about what fair burden-sharing looks like.",
      "Bridging divides is not just our geography — it is our diplomatic tradition.",
    ],
  },
  {
    code: "IDN",
    name: "Indonesia",
    formalName: "The Republic of Indonesia",
    bloc: "Non-Aligned Voices",
    priorities: [
      "ASEAN centrality and regional cooperation",
      "non-alignment and strategic independence",
      "maritime security in Southeast Asia",
      "development financing for the Global South",
    ],
    openers: [
      "Indonesia, as the world's largest archipelagic nation, speaks with a direct stake in this file.",
      "Jakarta, upholding its non-aligned tradition, urges this committee to avoid bloc politics.",
      "The Indonesian delegation speaks on behalf of ASEAN centrality on this issue.",
    ],
    stanceVerbs: [
      "upholds ASEAN centrality in addressing",
      "urges a non-aligned, pragmatic approach to",
      "insists on regional ownership of solutions regarding",
      "calls for balanced development financing for",
    ],
    closers: [
      "Indonesia will continue to champion an independent, active foreign policy on this file.",
      "ASEAN centrality is not negotiable in any durable regional solution.",
    ],
  },
  {
    code: "AUS",
    name: "Australia",
    formalName: "Australia",
    bloc: "Asia-Pacific Partnership",
    priorities: [
      "a free and open Indo-Pacific",
      "close alliance coordination",
      "Pacific Islands partnership and climate resilience",
      "rules-based maritime order",
    ],
    openers: [
      "Australia, as a Pacific nation, wishes to underscore the stakes of this file for our region.",
      "Canberra, in close coordination with allies, calls for a rules-based approach.",
      "The Australian delegation speaks with our Pacific Island partners squarely in mind.",
    ],
    stanceVerbs: [
      "champions a free and open approach to",
      "will coordinate closely with regional partners on",
      "insists on a rules-based maritime order regarding",
      "calls for climate resilience financing tied to",
    ],
    closers: [
      "Australia stands with our Pacific family on this and every related file.",
      "A free, open, and rules-based region serves everyone's interest, not just our own.",
    ],
  },
  {
    code: "KOR",
    name: "South Korea",
    formalName: "The Republic of Korea",
    bloc: "Asia-Pacific Partnership",
    priorities: [
      "regional security and alliance coordination",
      "technology and semiconductor supply chain resilience",
      "development cooperation leadership",
      "a rules-based multilateral order",
    ],
    openers: [
      "The Republic of Korea wishes to draw on its own development experience in this discussion.",
      "Seoul, in close coordination with allies, calls for concrete, implementable measures.",
      "The Korean delegation believes technology partnership can be part of the solution here.",
    ],
    stanceVerbs: [
      "champions technology-driven partnership on",
      "calls for concrete, implementable measures regarding",
      "will coordinate closely with allies on",
      "insists on supply chain resilience in addressing",
    ],
    closers: [
      "Korea's own development journey shows durable partnership delivers results.",
      "We call on this body to match ambition with implementable detail.",
    ],
  },
  {
    code: "PAK",
    name: "Pakistan",
    formalName: "The Islamic Republic of Pakistan",
    bloc: "Non-Aligned Voices",
    priorities: [
      "regional security and strategic balance",
      "climate vulnerability and adaptation financing",
      "South Asian development cooperation",
      "self-determination and sovereignty",
    ],
    openers: [
      "Pakistan, among the nations most exposed to climate disaster, speaks with direct urgency.",
      "Islamabad calls on this committee to recognize the strategic realities of South Asia.",
      "The Pakistani delegation urges a balanced, non-aligned approach to this file.",
    ],
    stanceVerbs: [
      "urges urgent climate adaptation financing for",
      "calls for a balanced, non-aligned approach to",
      "insists on the principle of self-determination regarding",
      "will not accept a one-sided framing of",
    ],
    closers: [
      "Pakistan has lived the consequences of climate inaction — this committee must not repeat them.",
      "Balance and fairness, not bloc allegiance, should guide this committee's response.",
    ],
  },
  {
    code: "ARG",
    name: "Argentina",
    formalName: "The Argentine Republic",
    bloc: "Latin American Bloc",
    priorities: [
      "regional economic stability",
      "Latin American development cooperation",
      "sovereign debt reform",
      "multilateral, non-coercive dispute resolution",
    ],
    openers: [
      "Argentina, drawing on hard-won experience with sovereign debt, speaks candidly on this file.",
      "Buenos Aires believes durable solutions require honest reckoning with debt sustainability.",
      "The Argentine delegation stands with fellow Latin American nations on this issue.",
    ],
    stanceVerbs: [
      "insists on honest reckoning with",
      "champions regional economic solidarity on",
      "calls for sovereign debt reform tied to",
      "rejects one-size-fits-all conditionality regarding",
    ],
    closers: [
      "Argentina speaks from experience: unsustainable terms produce unsustainable outcomes.",
      "Regional solidarity remains our surest path through this challenge.",
    ],
  },
  {
    code: "ITA",
    name: "Italy",
    formalName: "The Italian Republic",
    bloc: "European Union",
    priorities: [
      "Mediterranean stability and migration cooperation",
      "European Union coordination",
      "cultural heritage protection",
      "balanced, phased multilateral action",
    ],
    openers: [
      "Italy, at the crossroads of Europe and the Mediterranean, speaks with a direct stake in this file.",
      "Rome, in close coordination with European partners, calls for a balanced, phased approach.",
      "The Italian delegation wishes to highlight the Mediterranean dimension of this discussion.",
    ],
    stanceVerbs: [
      "calls for a balanced, phased approach to",
      "insists on Mediterranean stability as central to",
      "will coordinate closely with European partners on",
      "champions cultural heritage protections within",
    ],
    closers: [
      "Italy stands at a crossroads that gives it both a stake and a responsibility here.",
      "Balanced, phased action serves this committee better than sweeping gestures.",
    ],
  },
];

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  beginner: {
    label: "Beginner",
    description: "Generous speaking time, a supportive chair, and a slower pace.",
    openingSpeechTime: 120,
    caucusSpeechTime: 60,
    pointResponseTime: 45,
    typingDelayMs: 1600,
    readPauseMs: 1400,
    pointOfInquiry: false,
    chairTone: "supportive",
  },
  intermediate: {
    label: "Intermediate",
    description: "Standard MUN pace, procedure, and speaking times.",
    openingSpeechTime: 90,
    caucusSpeechTime: 45,
    pointResponseTime: 30,
    typingDelayMs: 1200,
    readPauseMs: 1100,
    pointOfInquiry: true,
    chairTone: "neutral",
  },
  advanced: {
    label: "Advanced",
    description: "Fast-paced, assertive delegates, and strict enforcement.",
    openingSpeechTime: 60,
    caucusSpeechTime: 30,
    pointResponseTime: 20,
    typingDelayMs: 850,
    readPauseMs: 800,
    pointOfInquiry: true,
    chairTone: "strict",
  },
};

export function committeeTopics(committeeId: string): Topic[] {
  return TOPICS.filter((t) => t.committeeId === committeeId);
}

/** Deterministically pick AI seatmates: the fixed roster, minus the user's country, first N left. */
export function pickAiDelegates(userCountryCode: string, count: number): Country[] {
  return COUNTRIES.filter((c) => c.code !== userCountryCode).slice(0, count);
}

/**
 * A generic-but-usable diplomatic voice for any of the 195 selectable
 * delegations that don't have a hand-written profile in COUNTRIES. It makes
 * no claims about a real country's actual foreign policy — just enough
 * plausible, reusable phrasing for the simulator's local statement generator
 * and AI prompts to work for every delegation, not just the curated 25.
 */
function synthesizeCountry(code: string, name: string): Country {
  return {
    code,
    name,
    formalName: name,
    bloc: "Independent Delegation",
    priorities: [
      "national sovereignty and self-determination",
      "constructive multilateral engagement",
      "equitable and sustainable development",
      "adherence to international law",
    ],
    openers: [
      `The delegation of ${name} thanks the Chair and looks forward to constructive engagement on this file.`,
      `${name} wishes to state its position clearly as this committee begins deliberation.`,
      `On behalf of ${name}, this delegation welcomes the opportunity for open dialogue on this issue.`,
    ],
    stanceVerbs: [
      "calls for constructive dialogue on",
      "urges careful, balanced consideration of",
      "supports a multilateral approach to",
      "cannot support unilateral measures regarding",
    ],
    closers: [
      `${name} looks forward to working with this committee toward a fair and durable outcome.`,
      "This delegation thanks the Chair and yields the floor.",
    ],
  };
}

/**
 * Resolves a delegation name (from the full WORLD_COUNTRIES list, or free
 * text) to a full Country profile: the hand-written one from COUNTRIES when
 * available, otherwise a synthesized generic profile so every UN member
 * state and observer state works in the simulator.
 */
export function resolveCountry(name: string): Country {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  const known = COUNTRIES.find((c) => c.name.toLowerCase() === lower);
  if (known) return known;

  const listed = WORLD_COUNTRIES.find((c) => c.name.toLowerCase() === lower);
  if (listed) return synthesizeCountry(listed.code, listed.name);

  return synthesizeCountry(trimmed.slice(0, 3).toUpperCase() || "DEL", trimmed || "Unnamed Delegation");
}
