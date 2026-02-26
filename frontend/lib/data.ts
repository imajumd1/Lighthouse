import { Trend, User, Vertical, Source } from './types';

export const VERTICALS: Vertical[] = [
  { id: 'v1', name: 'Healthcare', slug: 'healthcare', color: 'bg-emerald-500' },
  { id: 'v2', name: 'Financial Services', slug: 'financial-services', color: 'bg-blue-500' },
  { id: 'v3', name: 'Retail', slug: 'retail', color: 'bg-orange-500' },
  { id: 'v4', name: 'Manufacturing', slug: 'manufacturing', color: 'bg-slate-500' },
  { id: 'v5', name: 'Technology', slug: 'technology', color: 'bg-purple-500' },
  { id: 'v6', name: 'Legal', slug: 'legal', color: 'bg-indigo-500' },
  { id: 'v7', name: 'Education', slug: 'education', color: 'bg-yellow-500' },
  { id: 'v8', name: 'Government', slug: 'government', color: 'bg-red-500' },
  { id: 'v9', name: 'Energy', slug: 'energy', color: 'bg-green-500' },
  { id: 'v10', name: 'Media', slug: 'media', color: 'bg-pink-500' },
];

export const APPROVED_SOURCES = {
  frontierLabs: [
    'OpenAI Blog', 'Anthropic Blog', 'Google DeepMind Blog', 'Meta AI Blog', 
    'Mistral AI Blog', 'Cohere Blog', 'xAI Blog', 'Stability AI Blog'
  ],
  enterprise: [
    'McKinsey Insights', 'Boston Consulting Group (BCG) Insights', 'Bain & Company Insights', 
    'Harvard Business Review (HBR)', 'Gartner Research', 'Forrester Research', 
    'Deloitte Insights', 'PwC AI Publications'
  ],
  infrastructure: [
    'Databricks Blog', 'Snowflake Blog', 'dbt Labs Blog', 'NVIDIA AI Blog', 
    'Hugging Face Blog', 'Netflix Tech Blog', 'Uber Engineering Blog', 
    'Airbnb Engineering Blog', 'Microsoft Engineering Blog', 'AWS Machine Learning Blog', 
    'Google Cloud AI Blog'
  ],
  academic: [
    'arXiv', 'Stanford HAI Publications', 'MIT CSAIL Research Blog', 
    'Berkeley AI Research (BAIR) Blog', 'Carnegie Mellon AI Research', 
    'Allen Institute for AI (AI2) Blog'
  ],
  vc: [
    'Andreessen Horowitz (a16z) AI Blog', 'Sequoia Capital AI Publications', 
    'Greylock Partners AI Blog', 'Insight Partners AI Blog', 
    'Lightspeed Venture AI Blog', 'Accel AI Market Insights'
  ],
  news: [
    'MIT Technology Review', 'The Information', 'Financial Times', 
    'Bloomberg Technology', 'Wall Street Journal', 'TechCrunch', 'VentureBeat'
  ],
  policy: [
    'European Commission AI Act', 'White House AI Policy', 'OECD AI Policy Observatory', 
    'World Economic Forum', 'Brookings Institution', 'Center for Security and Emerging Technology (CSET)'
  ],
  analysts: [
    'Stratechery', 'The Pragmatic Engineer', 'Not Boring', 'AI Snake Oil', 
    'Import AI', 'The Sequence', 'Latent Space', 'Ben\'s Bites', 
    'Nathan Lambert\'s Interconnects', 'Ethan Mollick\'s One Useful Thing'
  ]
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Marcus Partner',
    email: 'marcus@consulting.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
  },
  {
    id: 'u2',
    name: 'Sarah Strategy',
    email: 'sarah@consulting.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@lighthouse.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
  },
];

export const MOCK_TRENDS: Trend[] = [
  {
    id: 't1',
    title: 'Generative AI in Regulatory Compliance',
    justificationSummary: 'Financial institutions are rapidly adopting LLMs to automate compliance checks and regulatory reporting, reducing costs by up to 40%.',
    whyTrend: 'Regulatory complexity is increasing globally while compliance budgets are shrinking. Generative AI offers a scalable solution to interpret and apply complex regulations in real-time, a capability that traditional rule-based systems lack.',
    howConsultanciesLeverage: 'Consultancies can offer "Compliance-as-a-Service" platforms powered by GenAI, or provide implementation services for custom compliance bots. There is also a significant opportunity in auditing these AI systems for hallucination risks.',
    analysisDetail: 'The convergence of LLMs with regulatory technology (RegTech) is creating a new paradigm. Unlike previous waves of automation that relied on structured data, GenAI can parse unstructured regulatory texts, policy documents, and communication logs. This allows for "intent-based" compliance monitoring rather than just keyword matching. However, the "black box" nature of these models poses a challenge, necessitating new governance frameworks that consultancies are well-positioned to design.',
    affectedVerticals: ['v2', 'v6', 'v8'],
    sourceUrl: 'https://www.ft.com/artificial-intelligence',
    additionalSources: [
      { id: 's1', title: 'The Future of RegTech', url: 'https://www2.deloitte.com/us/en/insights/industry/financial-services/regulatory-technology-regtech-fintech.html', publisher: 'Deloitte Insights', date: '2023-10-10' },
      { id: 's2', title: 'AI Principles', url: 'https://oecd.ai/en/ai-principles', publisher: 'OECD AI Policy Observatory', date: '2023-09-15' }
    ],
    status: 'current',
    dateAdded: '2023-10-15T10:00:00Z',
    author: 'Financial Times',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't2',
    title: 'AI-Driven Drug Discovery Acceleration',
    justificationSummary: 'Pharma giants are partnering with AI startups to shorten drug discovery timelines from years to months, with several AI-designed drugs now entering clinical trials.',
    whyTrend: 'The traditional drug discovery process is prohibitively expensive and slow. AI models can predict molecular interactions with high accuracy, significantly narrowing the search space for potential candidates.',
    howConsultanciesLeverage: 'Strategy firms can advise pharma companies on "AI-first" R&D operating models. Tech consultancies can build the data infrastructure required to train proprietary models on internal research data.',
    analysisDetail: 'AI is moving beyond simple screening to de novo molecule generation. Generative models can design novel protein structures that have never existed in nature but bind perfectly to disease targets. This "inverse design" approach flips the traditional discovery model on its head. The challenge now shifts from discovery to validation, where AI is also being used to simulate clinical trials and predict patient responses.',
    affectedVerticals: ['v1', 'v5'],
    sourceUrl: 'https://blogs.nvidia.com/blog/category/deep-learning/',
    additionalSources: [
      { id: 's3', title: 'Generative AI in Pharma', url: 'https://www.mckinsey.com/industries/life-sciences/our-insights/generative-ai-in-the-pharmaceutical-industry-moving-from-hype-to-reality', publisher: 'McKinsey Insights', date: '2023-10-05' },
      { id: 's4', title: 'AlphaFold Latest', url: 'https://deepmind.google/discover/blog/alphafold-3-predicts-the-structure-and-interactions-of-all-lifes-molecules/', publisher: 'Google DeepMind Blog', date: '2023-09-20' }
    ],
    status: 'current',
    dateAdded: '2023-10-18T14:30:00Z',
    author: 'NVIDIA AI Blog',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't3',
    title: 'Hyper-Personalization in Retail at Scale',
    justificationSummary: 'Retailers are moving beyond simple recommendation engines to real-time, generative content creation for individual shoppers.',
    whyTrend: 'Consumers increasingly expect personalized experiences. GenAI allows retailers to generate unique product descriptions, images, and marketing copy for every user on the fly, increasing conversion rates.',
    howConsultanciesLeverage: 'Marketing consultancies can help brands design "segment-of-one" customer journeys. Implementation partners are needed to integrate GenAI tools with existing e-commerce platforms and CDPs.',
    analysisDetail: 'The shift is from "predictive" personalization (guessing what you might like) to "generative" personalization (creating what you want). This involves real-time rendering of products in contexts relevant to the user (e.g., showing a tent in a forest for a hiker vs. a backyard for a family). This level of personalization requires a robust data foundation and low-latency inference infrastructure.',
    affectedVerticals: ['v3', 'v10'],
    sourceUrl: 'https://www.bcg.com/capabilities/artificial-intelligence/insights',
    additionalSources: [
      { id: 's5', title: 'Personalization at Scale', url: 'https://hbr.org/2023/05/how-generative-ai-will-change-sales', publisher: 'Harvard Business Review', date: '2023-10-12' }
    ],
    status: 'current',
    dateAdded: '2023-10-20T09:15:00Z',
    author: 'BCG Insights',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't4',
    title: 'Autonomous Supply Chain Agents',
    justificationSummary: 'Manufacturing and logistics are deploying autonomous AI agents that can negotiate with suppliers and re-route shipments without human intervention.',
    whyTrend: 'Supply chain disruptions are becoming the norm. Autonomous agents provide the speed and responsiveness needed to adapt to shocks in real-time, which human teams cannot match.',
    howConsultanciesLeverage: 'Operations consultants can redesign supply chain processes to accommodate autonomous decision-making. Change management is critical here as human roles shift from execution to oversight.',
    analysisDetail: 'Unlike traditional optimization software that suggests actions, autonomous agents execute them. They can negotiate spot rates with carriers, trigger re-orders based on predictive demand, and dynamically adjust production schedules. The key innovation is the ability of these agents to communicate with each other across organizational boundaries, creating a self-healing supply network.',
    affectedVerticals: ['v4', 'v3', 'v9'],
    sourceUrl: 'https://www.gartner.com/en/supply-chain/insights',
    additionalSources: [
      { id: 's6', title: 'Supply Chain Optimization', url: 'https://devblogs.microsoft.com/engineering/', publisher: 'Microsoft Engineering Blog', date: '2023-10-25' }
    ],
    status: 'current',
    dateAdded: '2023-10-22T11:45:00Z',
    author: 'Gartner Research',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't5',
    title: 'AI in Predictive Maintenance for Energy Grids',
    justificationSummary: 'Utility companies are using AI to predict equipment failures before they happen, preventing outages and reducing maintenance costs.',
    whyTrend: 'Aging infrastructure and the integration of renewable energy sources are stressing power grids. AI provides the predictive capabilities needed to maintain reliability in a complex, decentralized grid.',
    howConsultanciesLeverage: 'Engineering consultancies can implement IoT sensor networks and AI analytics platforms. Strategy firms can advise on the business case for grid modernization investments.',
    analysisDetail: 'The grid is becoming a bi-directional network with the addition of solar panels and EVs. Traditional grid management software struggles with this complexity. AI models trained on historical weather data, load patterns, and sensor readings can predict transformer failures weeks in advance, allowing for planned maintenance instead of emergency repairs.',
    affectedVerticals: ['v9', 'v8'],
    sourceUrl: 'https://aws.amazon.com/blogs/machine-learning/',
    additionalSources: [
      { id: 's7', title: 'Grid Modernization', url: 'https://cloud.google.com/blog/products/ai-machine-learning', publisher: 'Google Cloud AI Blog', date: '2023-10-28' }
    ],
    status: 'current',
    dateAdded: '2023-10-25T16:20:00Z',
    author: 'AWS Machine Learning Blog',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't6',
    title: 'Legal Tech: Automated Contract Review',
    justificationSummary: 'Law firms and corporate legal departments are adopting AI tools that can review contracts and flag risks in seconds.',
    whyTrend: 'Legal review is a major bottleneck in business transactions. AI can handle routine contract review faster and more consistently than junior lawyers, freeing them for higher-value work.',
    howConsultanciesLeverage: 'Legal tech consultancies can help firms select and train AI models on their specific contract templates. There is also a market for "legal operations" consulting to optimize workflows around these new tools.',
    analysisDetail: 'AI is not just searching for keywords; it is understanding the semantic meaning of clauses. It can identify "poison pill" clauses, compare terms against a company\'s playbook, and suggest redlines. This reduces the cost of due diligence in M&A and accelerates sales cycles by speeding up contract negotiations.',
    affectedVerticals: ['v6', 'v2', 'v5'],
    sourceUrl: 'https://hbr.org/topic/law-and-legal-issues',
    additionalSources: [
      { id: 's8', title: 'Legal AI Trends', url: 'https://www.theinformation.com/topics/artificial-intelligence', publisher: 'The Information', date: '2023-11-01' }
    ],
    status: 'current',
    dateAdded: '2023-10-28T08:00:00Z',
    author: 'Harvard Business Review',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't7',
    title: 'AI-Powered Personalized Learning',
    justificationSummary: 'EdTech platforms are using AI to create adaptive learning paths that adjust to each student\'s pace and understanding.',
    whyTrend: 'The "one-size-fits-all" model of education is failing many students. AI enables mass personalization, potentially closing achievement gaps and improving learning outcomes.',
    howConsultanciesLeverage: 'Education consultants can help institutions integrate AI tools into their curriculum. There is also a need for policy consulting to address data privacy and ethical concerns in student data.',
    analysisDetail: 'Adaptive learning systems use knowledge graphs to map a student\'s understanding. If a student struggles with a concept, the AI doesn\'t just repeat the lesson; it offers a different explanation, a prerequisite concept, or a practice problem. This continuous feedback loop keeps students in the "zone of proximal development" for optimal learning.',
    affectedVerticals: ['v7', 'v5'],
    sourceUrl: 'https://hai.stanford.edu/news',
    additionalSources: [
      { id: 's9', title: 'AI in Education', url: 'https://www.csail.mit.edu/news', publisher: 'MIT CSAIL Research Blog', date: '2023-11-03' }
    ],
    status: 'current',
    dateAdded: '2023-10-30T13:10:00Z',
    author: 'Stanford HAI',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't8',
    title: 'Generative Design in Manufacturing',
    justificationSummary: 'Engineers are using AI to generate thousands of design variations for parts, optimizing for weight, strength, and material usage.',
    whyTrend: 'Sustainable manufacturing requires more efficient parts. Generative design can create organic shapes that are impossible for humans to conceive but are lighter and stronger.',
    howConsultanciesLeverage: 'Product design firms can adopt these tools to offer superior engineering services. Management consultants can advise on the supply chain implications of using additive manufacturing for these complex parts.',
    analysisDetail: 'Generative design software takes constraints (loads, materials, manufacturing methods) as input and "evolves" a design solution. This often results in alien-looking, organic structures that minimize material usage while maximizing structural integrity. This is particularly valuable in aerospace and automotive industries where weight reduction directly translates to fuel efficiency.',
    affectedVerticals: ['v4', 'v9'],
    sourceUrl: 'https://www.technologyreview.com/topic/artificial-intelligence/',
    additionalSources: [
      { id: 's10', title: 'Generative Design', url: 'https://blogs.nvidia.com/', publisher: 'NVIDIA AI Blog', date: '2023-11-04' }
    ],
    status: 'current',
    dateAdded: '2023-11-02T10:30:00Z',
    author: 'MIT Technology Review',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't9',
    title: 'AI in Media Content Creation',
    justificationSummary: 'Media companies are using AI to automate video editing, scriptwriting, and even voice acting.',
    whyTrend: 'The demand for content is insatiable, but production costs are high. AI tools can democratize high-quality content creation and drastically reduce post-production times.',
    howConsultanciesLeverage: 'Media consultancies can help studios implement AI workflows. There is also a significant opportunity in rights management and IP protection consulting for AI-generated content.',
    analysisDetail: 'AI tools can now generate B-roll footage, dub content into multiple languages with the original actor\'s voice, and even de-age actors. This allows for "content atomization," where a single piece of content is automatically repurposed for different platforms and audiences. However, the legal landscape regarding the copyright of AI-generated works remains unsettled.',
    affectedVerticals: ['v10', 'v5'],
    sourceUrl: 'https://a16z.com/category/ai/',
    additionalSources: [
      { id: 's11', title: 'AI in Film', url: 'https://netflixtechblog.com/', publisher: 'Netflix Tech Blog', date: '2023-11-06' }
    ],
    status: 'current',
    dateAdded: '2023-11-05T15:45:00Z',
    author: 'a16z AI Blog',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 't10',
    title: 'Government AI for Public Services',
    justificationSummary: 'Governments are deploying AI chatbots and decision support systems to improve citizen services and reduce bureaucratic backlogs.',
    whyTrend: 'Citizens expect the same level of digital service from government as they get from the private sector. AI can help understaffed agencies deliver better services more efficiently.',
    howConsultanciesLeverage: 'Public sector consultants can lead digital transformation projects. There is a massive need for "responsible AI" consulting to ensure fairness and transparency in government algorithms.',
    analysisDetail: 'AI is being used to triage 311 calls, process tax returns, and even assist judges in sentencing (though this is controversial). The key challenge is ensuring that these systems do not perpetuate historical biases found in training data. "Explainable AI" is a critical requirement for public sector deployments to maintain public trust.',
    affectedVerticals: ['v8', 'v5', 'v1'],
    sourceUrl: 'https://www.brookings.edu/topic/artificial-intelligence/',
    additionalSources: [
      { id: 's12', title: 'AI Governance', url: 'https://oecd.ai/en/ai-principles', publisher: 'OECD AI Policy Observatory', date: '2023-11-09' }
    ],
    status: 'current',
    dateAdded: '2023-11-08T09:00:00Z',
    author: 'Brookings Institution',
    imageUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=1000',
  },
];

