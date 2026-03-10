import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// State-specific institution lookup maps
// ---------------------------------------------------------------------------

const UNI_INSTITUTIONS: Record<string, string[]> = {
  NSW: ['University of Sydney', 'UNSW Sydney', 'University of Technology Sydney', 'Macquarie University', 'Western Sydney University'],
  VIC: ['University of Melbourne', 'Monash University', 'RMIT University', 'Deakin University', 'Swinburne University of Technology'],
  QLD: ['University of Queensland', 'Queensland University of Technology', 'Griffith University', 'James Cook University', 'University of the Sunshine Coast'],
  WA: ['University of Western Australia', 'Curtin University', 'Edith Cowan University', 'Murdoch University'],
  SA: ['University of Adelaide', 'Flinders University', 'University of South Australia'],
  TAS: ['University of Tasmania'],
};

const TAFE_INSTITUTIONS: Record<string, string[]> = {
  NSW: ['TAFE NSW Sydney', 'TAFE NSW Western Sydney', 'TAFE NSW Hunter'],
  VIC: ['Melbourne Polytechnic', 'Holmesglen Institute', 'Box Hill Institute', 'Chisholm Institute'],
  QLD: ['TAFE Queensland Brisbane', 'TAFE Queensland Gold Coast', 'TAFE Queensland SkillsTech'],
  WA: ['North Metropolitan TAFE', 'South Metropolitan TAFE', 'Central Regional TAFE'],
  SA: ['TAFE SA Adelaide', 'TAFE SA Regency'],
  TAS: ['TasTAFE Hobart', 'TasTAFE Launceston'],
};

const SPORTS_INSTITUTIONS: Record<string, string[]> = {
  NSW: ['University of Sydney – Exercise and Sport Science', 'UNSW Sydney – Exercise Physiology', 'Australian Catholic University Sydney'],
  VIC: ['Deakin University – Exercise and Sport Science', 'Victoria University – Sport Science', 'RMIT University – Health and Biomedical Sciences'],
  QLD: ['University of Queensland – Human Movement Studies', 'Griffith University – Sport Development', 'Queensland Academy of Sport'],
  WA: ['Edith Cowan University – Exercise and Sports Science', 'Curtin University – Exercise Science', 'Western Australian Institute of Sport'],
};

const ARTS_INSTITUTIONS: Record<string, string[]> = {
  NSW: ['National Art School Sydney', 'Sydney Film School', 'UNSW Art & Design', 'Australian Film Television and Radio School'],
  VIC: ['Victorian College of the Arts (UniMelb)', 'RMIT School of Art', 'Swinburne Film and Television', 'Melbourne Polytechnic – Creative Industries'],
  QLD: ['Queensland College of Art (Griffith)', 'QUT Creative Industries', 'Griffith Film School'],
  WA: ['Edith Cowan University – Western Australian Academy of Performing Arts', 'Curtin University – School of Design and the Built Environment'],
};

// ---------------------------------------------------------------------------
// State-specific subject name lookup
// ---------------------------------------------------------------------------

interface StateSubjects {
  mathsAdvanced: string;
  english: string;
  physics: string;
  chemistry: string;
  biology: string;
  business: string;
  digitalTech: string;
  healthPE: string;
  visualArts: string;
  mediaArts: string;
}

const STATE_SUBJECTS: Record<string, StateSubjects> = {
  NSW: {
    mathsAdvanced: 'Mathematics Advanced',
    english: 'English Advanced',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    business: 'Business Studies',
    digitalTech: 'Software Design and Development',
    healthPE: 'Personal Development, Health and Physical Education',
    visualArts: 'Visual Arts',
    mediaArts: 'Media Studies',
  },
  VIC: {
    mathsAdvanced: 'Mathematical Methods',
    english: 'English',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    business: 'Business Management',
    digitalTech: 'Algorithmics (HESS)',
    healthPE: 'Physical Education',
    visualArts: 'Visual Communication Design',
    mediaArts: 'Media',
  },
  QLD: {
    mathsAdvanced: 'Mathematical Methods',
    english: 'English',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    business: 'Business',
    digitalTech: 'Digital Solutions',
    healthPE: 'Health and Physical Education',
    visualArts: 'Visual Art',
    mediaArts: 'Film, Television and New Media',
  },
  WA: {
    mathsAdvanced: 'Mathematics Methods ATAR',
    english: 'English ATAR',
    physics: 'Physics ATAR',
    chemistry: 'Chemistry ATAR',
    biology: 'Human Biology ATAR',
    business: 'Accounting and Finance ATAR',
    digitalTech: 'Computer Science ATAR',
    healthPE: 'Health Studies ATAR',
    visualArts: 'Visual Arts ATAR',
    mediaArts: 'Media Production and Analysis ATAR',
  },
  SA: {
    mathsAdvanced: 'Mathematical Methods',
    english: 'English',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    business: 'Business and Enterprise',
    digitalTech: 'Digital Technologies',
    healthPE: 'Physical Education',
    visualArts: 'Visual Arts – Art',
    mediaArts: 'Media Studies',
  },
  TAS: {
    mathsAdvanced: 'Mathematics Methods',
    english: 'English',
    physics: 'Physical Sciences',
    chemistry: 'Chemistry',
    biology: 'Biology',
    business: 'Accounting',
    digitalTech: 'Information Technology',
    healthPE: 'Health Studies',
    visualArts: 'Art Production',
    mediaArts: 'Media Production',
  },
};

// ---------------------------------------------------------------------------
// Helper: build StatePathway data for a career
// ---------------------------------------------------------------------------

type PathwayInput = {
  state: string;
  pathwayType: string;
  subjects: string[];
  rankTarget?: number | null;
  institutions: string[];
  duration: string;
  entryRequirements?: string;
};

function uniPathway(
  stateKey: string,
  subjectKeys: (keyof StateSubjects)[],
  atar: number,
  duration: string,
  entryReqs?: string,
): PathwayInput {
  const subj = STATE_SUBJECTS[stateKey];
  return {
    state: stateKey,
    pathwayType: 'UNIVERSITY',
    subjects: subjectKeys.map((k) => subj[k]),
    rankTarget: atar,
    institutions: UNI_INSTITUTIONS[stateKey],
    duration,
    entryRequirements: entryReqs,
  };
}

function tafePathway(
  stateKey: string,
  subjects: string[],
  duration: string,
  entryReqs?: string,
): PathwayInput {
  return {
    state: stateKey,
    pathwayType: 'TAFE',
    subjects,
    rankTarget: null,
    institutions: TAFE_INSTITUTIONS[stateKey],
    duration,
    entryRequirements: entryReqs,
  };
}

function apprenticeshipPathway(
  stateKey: string,
  subjects: string[],
  duration: string,
  entryReqs?: string,
): PathwayInput {
  return {
    state: stateKey,
    pathwayType: 'APPRENTICESHIP',
    subjects,
    rankTarget: null,
    institutions: [`Registered employers and group training organisations in ${stateKey}`],
    duration,
    entryRequirements: entryReqs,
  };
}

function sportsPathway(stateKey: string, atar: number, duration: string, entryReqs?: string): PathwayInput {
  const subj = STATE_SUBJECTS[stateKey];
  return {
    state: stateKey,
    pathwayType: 'SPORTS',
    subjects: [subj.healthPE, subj.biology, subj.english],
    rankTarget: atar,
    institutions: SPORTS_INSTITUTIONS[stateKey] ?? UNI_INSTITUTIONS[stateKey],
    duration,
    entryRequirements: entryReqs,
  };
}

function artsPathway(stateKey: string, subjects: string[], duration: string, entryReqs?: string): PathwayInput {
  return {
    state: stateKey,
    pathwayType: 'ARTS',
    subjects,
    rankTarget: null,
    institutions: ARTS_INSTITUTIONS[stateKey] ?? UNI_INSTITUTIONS[stateKey],
    duration,
    entryRequirements: entryReqs,
  };
}

// ---------------------------------------------------------------------------
// Career definitions
// ---------------------------------------------------------------------------

interface CareerSeed {
  title: string;
  slug: string;
  description: string;
  image: string;
  dayInLife: string;
  progression: { level: string; years: string; salary: string; description: string; color: string }[];
  impact: string;
  salaryLow: number;
  salaryHigh: number;
  growthRate: number;
  skills: string[];
  category: string;
  pathways: PathwayInput[];
}

const STATES_CORE = ['NSW', 'VIC', 'QLD', 'WA'] as const;

const careers: CareerSeed[] = [
  // 1. Software Developer
  {
    title: 'Software Developer',
    slug: 'software-developer',
    description:
      'Software developers design, build, and maintain applications and systems that power everything from mobile apps to large-scale cloud platforms. This fast-growing field offers excellent career prospects, flexible work environments, and the chance to solve real-world problems through code. Strong analytical thinking and a passion for technology are key traits for success.',
    image: '/images/careers/software-developer.png',
    dayInLife: "You start the day with a stand-up meeting with your team. Grab a coffee, then dive into code. Maybe you're building a feature for a mobile app this morning, squashing bugs after lunch. You might pair-program with a colleague, review someone's pull request, or whiteboard a solution to a tricky problem. No two days are the same.",
    progression: [
      { level: 'Junior Developer', years: '0-2 years', salary: '~$75k', description: 'Learning the ropes, writing code with guidance', color: '#22c55e' },
      { level: 'Mid-Level Developer', years: '2-5 years', salary: '~$100k', description: 'Building features solo, mentoring juniors', color: '#3b82f6' },
      { level: 'Senior Developer', years: '5-8 years', salary: '~$130k', description: 'Leading technical decisions, designing systems', color: '#8b5cf6' },
      { level: 'Tech Lead / CTO', years: '8+ years', salary: '~$180k+', description: 'Setting direction for entire teams', color: '#eab308' },
    ],
    impact: "Software developers build the apps and systems billions of people use every day. From healthcare apps that save lives to education platforms that teach kids worldwide \u2014 the code you write can literally change how society works.",
    salaryLow: 72000,
    salaryHigh: 140000,
    growthRate: 22,
    skills: ['Programming (Python, JavaScript, Java)', 'Problem Solving', 'Version Control (Git)', 'Software Testing', 'Agile Methodology', 'Communication'],
    category: 'TECHNOLOGY',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['mathsAdvanced', 'english', 'digitalTech'], 80, '3-4 years', 'Bachelor of Computer Science or Software Engineering. Strong maths background recommended.')),
      uniPathway('SA', ['mathsAdvanced', 'english', 'digitalTech'], 75, '3-4 years', 'Bachelor of Computer Science or Software Engineering.'),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate IV in Information Technology', 'Diploma of Information Technology'], '1-2 years', 'Year 10 completion. Portfolio of projects may assist entry.')),
    ],
  },

  // 2. Registered Nurse
  {
    title: 'Registered Nurse',
    slug: 'registered-nurse',
    description:
      'Registered nurses provide essential healthcare to patients in hospitals, clinics, aged care, and community settings. The role involves assessing patient needs, administering treatments, and working as part of a multidisciplinary healthcare team. Nursing offers a deeply rewarding career with strong job security and diverse specialisation pathways.',
    image: '/images/careers/registered-nurse.png',
    dayInLife: "Your shift starts with a handover from the night team. You check on your patients, take observations, administer medications, and update charts. Maybe you're helping a post-surgery patient walk for the first time, or comforting a worried family member. It's fast-paced, emotionally demanding, but incredibly rewarding.",
    progression: [
      { level: 'Graduate Nurse', years: '0-1 year', salary: '~$65k', description: 'Learning under supervision in a graduate program', color: '#22c55e' },
      { level: 'Registered Nurse', years: '1-5 years', salary: '~$80k', description: 'Working independently across wards and settings', color: '#3b82f6' },
      { level: 'Clinical Nurse Specialist', years: '5-10 years', salary: '~$100k', description: 'Specialising in a specific area like ICU or paediatrics', color: '#8b5cf6' },
      { level: 'Nurse Unit Manager', years: '10+ years', salary: '~$120k+', description: 'Leading a nursing team and managing a ward', color: '#eab308' },
    ],
    impact: "Nurses are the backbone of healthcare. You'll be the person patients see most, the one who notices when something's wrong, and the one who makes people feel cared for during their most vulnerable moments. Nurses literally save lives every single day.",
    salaryLow: 65000,
    salaryHigh: 110000,
    growthRate: 14.5,
    skills: ['Patient Assessment', 'Clinical Skills', 'Empathy and Compassion', 'Critical Thinking', 'Teamwork', 'Time Management'],
    category: 'HEALTH',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['english', 'biology', 'chemistry'], 70, '3 years', 'Bachelor of Nursing. Clinical placements are mandatory. AHPRA registration required upon graduation.')),
      uniPathway('SA', ['english', 'biology', 'chemistry'], 65, '3 years', 'Bachelor of Nursing at Flinders or UniSA. Clinical placements required.'),
      uniPathway('TAS', ['english', 'biology', 'chemistry'], 65, '3 years', 'Bachelor of Nursing at University of Tasmania.'),
    ],
  },

  // 3. Electrician
  {
    title: 'Electrician',
    slug: 'electrician',
    description:
      'Electricians install, maintain, and repair electrical wiring and systems in homes, commercial buildings, and industrial sites. With the growth of renewable energy, smart home technology, and electric vehicles, skilled electricians are in higher demand than ever. This hands-on trade offers strong earning potential and the option to eventually run your own business.',
    image: '/images/careers/electrician.png',
    dayInLife: "You start early on a residential job site, reading blueprints and planning the wiring layout. By mid-morning you're running cables through walls, installing outlets, and connecting switchboards. After lunch, you might head to a different site to troubleshoot a fault. Every day brings a different challenge and a different location.",
    progression: [
      { level: 'Apprentice Electrician', years: '0-4 years', salary: '~$35-55k', description: 'Learning on the job while studying at TAFE', color: '#22c55e' },
      { level: 'Licensed Electrician', years: '4-8 years', salary: '~$75k', description: 'Working independently on residential and commercial jobs', color: '#3b82f6' },
      { level: 'Senior / Specialist', years: '8-12 years', salary: '~$95k', description: 'Solar, EV charging, or industrial specialisation', color: '#8b5cf6' },
      { level: 'Business Owner / Contractor', years: '10+ years', salary: '~$120k+', description: 'Running your own electrical business', color: '#eab308' },
    ],
    impact: "Electricians keep the lights on \u2014 literally. You'll be at the forefront of Australia's clean energy transition, installing solar panels, EV chargers, and smart home systems. Without electricians, modern life simply doesn't function.",
    salaryLow: 65000,
    salaryHigh: 110000,
    growthRate: 11,
    skills: ['Electrical Systems Knowledge', 'Blueprint Reading', 'Problem Solving', 'Safety Compliance', 'Mathematics', 'Physical Fitness'],
    category: 'TRADES',
    pathways: [
      ...STATES_CORE.map((s) => apprenticeshipPathway(s, ['Certificate III in Electrotechnology Electrician'], '3-4 years', 'Year 10 completion. Must pass colour vision test. Electrical licence required upon completion.')),
      apprenticeshipPathway('SA', ['Certificate III in Electrotechnology Electrician'], '3-4 years', 'Year 10 completion. Electrical licence required.'),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate III in Electrotechnology Electrician', 'Pre-apprenticeship in Electrotechnology'], '6 months - 1 year (pre-apprenticeship)', 'Year 10 completion. Pre-apprenticeship can lead to a full apprenticeship.')),
    ],
  },

  // 4. Graphic Designer
  {
    title: 'Graphic Designer',
    slug: 'graphic-designer',
    description:
      'Graphic designers create visual content for print, digital media, branding, and advertising. They combine creativity with technical skills in design software to communicate ideas and messages effectively. This career suits students who are passionate about art, design, and visual storytelling.',
    image: '/images/careers/graphic-designer.png',
    dayInLife: "You arrive at the studio, check your brief for the day \u2014 maybe it's a rebrand for a local cafe. You sketch concepts, choose typefaces, play with colour palettes in Figma or Illustrator. After a client feedback session, you refine the designs. You might also work on social media graphics, packaging, or a website mockup.",
    progression: [
      { level: 'Junior Designer', years: '0-2 years', salary: '~$55k', description: 'Assisting senior designers, building your portfolio', color: '#22c55e' },
      { level: 'Mid-Level Designer', years: '2-5 years', salary: '~$70k', description: 'Owning projects, working directly with clients', color: '#3b82f6' },
      { level: 'Senior Designer', years: '5-8 years', salary: '~$85k', description: 'Leading creative direction on major projects', color: '#8b5cf6' },
      { level: 'Creative Director', years: '8+ years', salary: '~$110k+', description: 'Setting the visual identity for brands and agencies', color: '#eab308' },
    ],
    impact: "Every brand, app, website, and product you interact with was shaped by a designer. Graphic designers create the visual language of our culture \u2014 from campaign posters that drive social change to apps that make complex information accessible to everyone.",
    salaryLow: 55000,
    salaryHigh: 95000,
    growthRate: 8,
    skills: ['Adobe Creative Suite', 'Typography', 'Colour Theory', 'Layout and Composition', 'Creativity', 'Client Communication'],
    category: 'CREATIVE',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['visualArts', 'english', 'mediaArts'], 65, '3-4 years', 'Bachelor of Design or Visual Communication. Portfolio submission typically required.')),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate IV in Design', 'Diploma of Graphic Design'], '1-2 years', 'Year 10 or 12 completion. Portfolio of creative work recommended.')),
      ...(['NSW', 'VIC', 'QLD'] as const).map((s) => {
        const subj = STATE_SUBJECTS[s];
        return artsPathway(s, [subj.visualArts, subj.mediaArts, subj.english], '2-3 years', 'Portfolio submission and interview. Passion for visual arts essential.');
      }),
    ],
  },

  // 5. Physiotherapist
  {
    title: 'Physiotherapist',
    slug: 'physiotherapist',
    description:
      'Physiotherapists help people recover from injuries, manage chronic conditions, and improve their physical mobility and wellbeing. They work in hospitals, private practices, sports clubs, and rehabilitation centres. This career combines a strong understanding of human anatomy with hands-on patient care and is ideal for students interested in both health and sport.',
    image: '/images/careers/physiotherapist.png',
    dayInLife: "Your morning starts with back-to-back patient sessions \u2014 maybe helping someone recover from knee surgery, then working with an elderly patient on their balance. After lunch, you might head to a local sports club to treat athletes. You write treatment plans, track patient progress, and celebrate their recovery milestones with them.",
    progression: [
      { level: 'Graduate Physio', years: '0-2 years', salary: '~$70k', description: 'Working under supervision, building clinical experience', color: '#22c55e' },
      { level: 'Physiotherapist', years: '2-5 years', salary: '~$85k', description: 'Treating patients independently, developing specialisations', color: '#3b82f6' },
      { level: 'Senior Physio / Specialist', years: '5-10 years', salary: '~$105k', description: 'Sports physio, neuro rehab, or musculoskeletal expert', color: '#8b5cf6' },
      { level: 'Practice Owner / Director', years: '10+ years', salary: '~$130k+', description: 'Running your own practice or leading a hospital team', color: '#eab308' },
    ],
    impact: "Physiotherapists give people their independence back. Whether it's helping someone walk after an accident, getting an athlete back on the field, or improving quality of life for someone with a chronic condition \u2014 you make a direct, visible difference in people's lives.",
    salaryLow: 70000,
    salaryHigh: 120000,
    growthRate: 16.5,
    skills: ['Anatomy and Physiology', 'Manual Therapy Techniques', 'Patient Communication', 'Exercise Prescription', 'Clinical Reasoning', 'Empathy'],
    category: 'HEALTH',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['biology', 'chemistry', 'healthPE', 'english'], 90, '4 years', 'Bachelor of Physiotherapy. High ATAR required. Clinical placements mandatory. AHPRA registration upon graduation.')),
      uniPathway('SA', ['biology', 'chemistry', 'healthPE', 'english'], 88, '4 years', 'Bachelor of Physiotherapy at UniSA. Clinical placements mandatory.'),
    ],
  },

  // 6. Carpenter
  {
    title: 'Carpenter',
    slug: 'carpenter',
    description:
      'Carpenters construct, install, and repair structures and fittings made from timber and other materials. They work on residential homes, commercial buildings, and renovation projects. Carpentry is a versatile trade that offers strong career stability, opportunities for specialisation in areas like cabinetmaking or formwork, and a pathway to running your own business.',
    image: '/images/careers/carpenter.png',
    dayInLife: "You're on site by 7am, measuring and cutting timber frames for a new house. By mid-morning, you're fitting wall frames and roof trusses with your team. After lunch, you switch to detailed work \u2014 hanging doors, fitting skirting boards. You check your plans, double-check your measurements, and see the structure take shape around you.",
    progression: [
      { level: 'Apprentice Carpenter', years: '0-4 years', salary: '~$35-50k', description: 'Learning the trade on building sites', color: '#22c55e' },
      { level: 'Qualified Carpenter', years: '4-8 years', salary: '~$70k', description: 'Working on residential and commercial builds', color: '#3b82f6' },
      { level: 'Specialist / Foreman', years: '8-12 years', salary: '~$90k', description: 'Cabinetmaking, formwork, or site supervision', color: '#8b5cf6' },
      { level: 'Builder / Business Owner', years: '10+ years', salary: '~$110k+', description: 'Running your own building or renovation business', color: '#eab308' },
    ],
    impact: "Carpenters build the homes people live in, the schools kids learn in, and the offices people work in. You create something physical and lasting \u2014 every building you help construct becomes part of someone's life story.",
    salaryLow: 60000,
    salaryHigh: 100000,
    growthRate: 9.5,
    skills: ['Blueprint Reading', 'Measurement and Mathematics', 'Hand and Power Tool Operation', 'Physical Fitness', 'Attention to Detail', 'Problem Solving'],
    category: 'TRADES',
    pathways: [
      ...STATES_CORE.map((s) => apprenticeshipPathway(s, ['Certificate III in Carpentry'], '3-4 years', 'Year 10 completion. Employer-sponsored apprenticeship. White Card (construction induction) required.')),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate II in Construction Pathways', 'Certificate III in Carpentry'], '6 months - 1 year (pre-apprenticeship)', 'Year 10 completion. Pre-apprenticeship helps secure an employer.')),
    ],
  },

  // 7. Cybersecurity Analyst
  {
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    description:
      'Cybersecurity analysts protect organisations from digital threats by monitoring networks, identifying vulnerabilities, and responding to security incidents. With cyberattacks becoming more frequent and sophisticated, this is one of the fastest-growing career fields in Australia. It suits students who enjoy problem solving, technology, and investigative thinking.',
    image: '/images/careers/cybersecurity-analyst.png',
    dayInLife: "You start by checking overnight security alerts on your dashboard. A suspicious login attempt catches your eye \u2014 you investigate, trace the source, and block the threat. After a team briefing, you run vulnerability scans on the company's systems and write a report. You might also run a phishing simulation to test employee awareness.",
    progression: [
      { level: 'Junior Security Analyst', years: '0-2 years', salary: '~$80k', description: 'Monitoring alerts, learning security tools', color: '#22c55e' },
      { level: 'Security Analyst', years: '2-5 years', salary: '~$110k', description: 'Investigating incidents, running penetration tests', color: '#3b82f6' },
      { level: 'Senior Analyst / Engineer', years: '5-8 years', salary: '~$140k', description: 'Designing security architecture, leading incident response', color: '#8b5cf6' },
      { level: 'CISO / Security Director', years: '10+ years', salary: '~$200k+', description: 'Setting cybersecurity strategy for the whole organisation', color: '#eab308' },
    ],
    impact: "Cybersecurity analysts protect hospitals, banks, schools, and governments from hackers. In a world where data breaches can affect millions of people, you're the last line of defence keeping everyone's personal information safe.",
    salaryLow: 80000,
    salaryHigh: 150000,
    growthRate: 32,
    skills: ['Network Security', 'Threat Analysis', 'Security Tools (SIEM, Firewalls)', 'Risk Assessment', 'Ethical Hacking', 'Analytical Thinking'],
    category: 'TECHNOLOGY',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['mathsAdvanced', 'digitalTech', 'english'], 82, '3-4 years', 'Bachelor of Cybersecurity or Computer Science (Cybersecurity major). Industry certifications (CompTIA Security+, CEH) are highly valued.')),
      uniPathway('SA', ['mathsAdvanced', 'digitalTech', 'english'], 78, '3-4 years', 'Bachelor of Cybersecurity at University of South Australia.'),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate IV in Cyber Security', 'Diploma of Information Technology (Cyber Security)'], '1-2 years', 'Year 12 completion recommended. Industry certifications can supplement.')),
    ],
  },

  // 8. Chef / Commercial Cook
  {
    title: 'Chef / Commercial Cook',
    slug: 'chef-commercial-cook',
    description:
      'Chefs and commercial cooks prepare meals in restaurants, hotels, catering companies, and institutional kitchens. This creative and fast-paced career combines culinary artistry with business skills. The hospitality industry offers opportunities to travel, specialise in cuisines, and eventually open your own restaurant or food business.',
    image: '/images/careers/chef.png',
    dayInLife: "You arrive before the lunch rush to prep ingredients \u2014 dicing vegetables, making sauces, checking stock levels. Orders start flying in and the kitchen kicks into high gear. You're plating dishes, coordinating with the team, tasting and adjusting. After service winds down, you plan tomorrow's specials and experiment with a new recipe idea.",
    progression: [
      { level: 'Apprentice Cook', years: '0-3 years', salary: '~$40-50k', description: 'Learning in a commercial kitchen, mastering basics', color: '#22c55e' },
      { level: 'Qualified Cook / Chef de Partie', years: '3-6 years', salary: '~$60k', description: 'Running a section of the kitchen', color: '#3b82f6' },
      { level: 'Sous Chef', years: '6-10 years', salary: '~$75k', description: 'Second-in-command, managing the kitchen team', color: '#8b5cf6' },
      { level: 'Head Chef / Owner', years: '10+ years', salary: '~$95k+', description: 'Running the kitchen or owning your own restaurant', color: '#eab308' },
    ],
    impact: "Chefs feed communities, celebrate cultures through food, and create experiences that bring people together. From neighbourhood cafes to fine dining, the meals you create become part of people's celebrations, comfort, and daily lives.",
    salaryLow: 50000,
    salaryHigh: 85000,
    growthRate: 7,
    skills: ['Food Preparation and Cooking', 'Menu Planning', 'Kitchen Safety and Hygiene', 'Time Management', 'Creativity', 'Teamwork'],
    category: 'SERVICES',
    pathways: [
      ...STATES_CORE.map((s) => apprenticeshipPathway(s, ['Certificate III in Commercial Cookery', 'Certificate IV in Kitchen Management'], '3-4 years', 'Year 10 completion. Employer-based apprenticeship in a commercial kitchen.')),
      apprenticeshipPathway('TAS', ['Certificate III in Commercial Cookery'], '3-4 years', 'Year 10 completion.'),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate III in Commercial Cookery', 'Diploma of Hospitality Management'], '1-2 years', 'Year 10 completion. Practical kitchen assessments.')),
    ],
  },

  // 9. Civil Engineer
  {
    title: 'Civil Engineer',
    slug: 'civil-engineer',
    description:
      'Civil engineers design, plan, and oversee the construction of infrastructure such as roads, bridges, dams, and buildings. They play a crucial role in shaping the built environment and ensuring public safety. This career is ideal for students with strong maths and physics skills who want to make a tangible impact on their communities.',
    image: '/images/careers/civil-engineer.png',
    dayInLife: "Your morning starts reviewing design plans for a new bridge on your CAD software. After a meeting with the project manager, you head to the construction site to inspect progress and check that work meets specifications. Back in the office, you run structural calculations and update the project timeline. You might also review environmental impact data.",
    progression: [
      { level: 'Graduate Engineer', years: '0-2 years', salary: '~$75k', description: 'Assisting senior engineers, learning design software', color: '#22c55e' },
      { level: 'Civil Engineer', years: '2-5 years', salary: '~$95k', description: 'Designing structures and managing smaller projects', color: '#3b82f6' },
      { level: 'Senior Engineer', years: '5-10 years', salary: '~$125k', description: 'Leading major infrastructure projects', color: '#8b5cf6' },
      { level: 'Principal / Director', years: '10+ years', salary: '~$160k+', description: 'Setting strategy for engineering firms or government departments', color: '#eab308' },
    ],
    impact: "Civil engineers shape the physical world around us. The roads you drive on, the bridges you cross, the buildings you enter \u2014 all designed by civil engineers. You'll build infrastructure that serves communities for decades.",
    salaryLow: 75000,
    salaryHigh: 140000,
    growthRate: 10,
    skills: ['Structural Analysis', 'CAD Software', 'Mathematics', 'Project Management', 'Environmental Awareness', 'Technical Report Writing'],
    category: 'SCIENCE',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['mathsAdvanced', 'physics', 'english'], 85, '4 years', 'Bachelor of Civil Engineering (Honours). Engineers Australia accreditation required for professional registration.')),
      uniPathway('SA', ['mathsAdvanced', 'physics', 'english'], 82, '4 years', 'Bachelor of Civil Engineering (Honours) at University of Adelaide or UniSA.'),
      uniPathway('TAS', ['mathsAdvanced', 'physics', 'english'], 78, '4 years', 'Bachelor of Engineering at University of Tasmania (Civil specialisation).'),
    ],
  },

  // 10. Sports Scientist
  {
    title: 'Sports Scientist',
    slug: 'sports-scientist',
    description:
      'Sports scientists apply scientific principles to optimise athletic performance, prevent injuries, and support athlete wellbeing. They work with professional sports teams, athletic institutes, and fitness organisations. This career is perfect for students passionate about both sport and science who want to help athletes reach their full potential.',
    image: '/images/careers/sports-scientist.png',
    dayInLife: "You start the day analysing GPS data from yesterday's training session, identifying which athletes are fatiguing. Then you run fitness tests with the squad \u2014 VO2 max, sprint times, agility drills. After lunch, you meet with the head coach to adjust the training program. You might also review nutrition plans or help an injured player with their rehab protocol.",
    progression: [
      { level: 'Graduate Sport Scientist', years: '0-2 years', salary: '~$60k', description: 'Collecting data, assisting with testing and rehab', color: '#22c55e' },
      { level: 'Sport Scientist', years: '2-5 years', salary: '~$75k', description: 'Running performance programs for teams or athletes', color: '#3b82f6' },
      { level: 'Senior Sport Scientist', years: '5-10 years', salary: '~$95k', description: 'Leading performance departments at clubs or institutes', color: '#8b5cf6' },
      { level: 'Head of Performance', years: '10+ years', salary: '~$120k+', description: 'Overseeing all performance and sport science for a professional organisation', color: '#eab308' },
    ],
    impact: "Sports scientists help athletes achieve things they never thought possible. You'll push the boundaries of human performance, prevent injuries that could end careers, and use science to give Australian athletes the edge on the world stage.",
    salaryLow: 60000,
    salaryHigh: 105000,
    growthRate: 18,
    skills: ['Exercise Physiology', 'Data Analysis', 'Biomechanics', 'Strength and Conditioning', 'Athlete Communication', 'Research Methods'],
    category: 'SPORTS',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['biology', 'healthPE', 'mathsAdvanced', 'english'], 78, '3-4 years', 'Bachelor of Sport and Exercise Science. ESSA accreditation pathway available.')),
      ...(['NSW', 'VIC', 'QLD', 'WA'] as const).map((s) => sportsPathway(s, 75, '3-4 years', 'Bachelor of Exercise and Sport Science at a sports-specialist institution. Practical placements with sporting clubs.')),
    ],
  },

  // 11. Accountant
  {
    title: 'Accountant',
    slug: 'accountant',
    description:
      'Accountants manage financial records, prepare tax returns, conduct audits, and advise businesses on financial matters. With every organisation needing financial expertise, accountants enjoy strong job security and diverse industry options. This career suits detail-oriented students with strong numeracy skills who are interested in business and finance.',
    image: '/images/careers/accountant.png',
    dayInLife: "You start the morning reviewing a client's financial statements in Xero. You spot a few discrepancies and investigate. Mid-morning, you jump on a call with a small business owner to discuss their tax strategy. After lunch, you work on a quarterly BAS return and draft a report for a company's board meeting. Tax season means longer hours, but the rest of the year is pretty balanced.",
    progression: [
      { level: 'Graduate Accountant', years: '0-2 years', salary: '~$65k', description: 'Preparing basic returns and financial reports', color: '#22c55e' },
      { level: 'Accountant', years: '2-5 years', salary: '~$80k', description: 'Managing client portfolios, complex returns', color: '#3b82f6' },
      { level: 'Senior Accountant / Manager', years: '5-10 years', salary: '~$110k', description: 'Leading teams, business advisory, audit management', color: '#8b5cf6' },
      { level: 'Partner / CFO', years: '10+ years', salary: '~$150k+', description: 'Running an accounting firm or leading finance for a corporation', color: '#eab308' },
    ],
    impact: "Accountants keep businesses running and help families manage their finances. From making sure small businesses survive to advising on billion-dollar corporate decisions, you'll be trusted with the financial health of organisations and individuals.",
    salaryLow: 65000,
    salaryHigh: 130000,
    growthRate: 6,
    skills: ['Financial Analysis', 'Accounting Software (Xero, MYOB)', 'Attention to Detail', 'Tax Regulations', 'Communication', 'Spreadsheet Proficiency'],
    category: 'BUSINESS',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['mathsAdvanced', 'business', 'english'], 75, '3-4 years', 'Bachelor of Accounting or Commerce (Accounting major). CPA or CA accreditation pursued post-degree.')),
      uniPathway('SA', ['mathsAdvanced', 'business', 'english'], 70, '3-4 years', 'Bachelor of Accounting at UniSA or Flinders University.'),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate IV in Accounting and Bookkeeping', 'Diploma of Accounting'], '1-2 years', 'Year 12 completion. Pathway to CPA/CA with further study.')),
    ],
  },

  // 12. Primary/Secondary Teacher
  {
    title: 'Primary/Secondary Teacher',
    slug: 'primary-secondary-teacher',
    description:
      'Teachers educate and inspire the next generation across primary and secondary school settings. They develop lesson plans, assess student progress, and create supportive learning environments. Teaching is one of the most impactful careers, offering the chance to shape young minds, with strong demand across all Australian states.',
    image: '/images/careers/teacher.png',
    dayInLife: "You arrive before the bell to set up for the day's lessons. First period is a hands-on science experiment with Year 8 \u2014 controlled chaos but they love it. You mark some assignments during your free period, meet with a parent about their child's progress, then teach a Year 11 class. After school, you coach the debating team and plan tomorrow's lessons.",
    progression: [
      { level: 'Graduate Teacher', years: '0-2 years', salary: '~$73k', description: 'Learning classroom management, teaching basics', color: '#22c55e' },
      { level: 'Proficient Teacher', years: '2-5 years', salary: '~$85k', description: 'Developing expertise in your subject area', color: '#3b82f6' },
      { level: 'Highly Accomplished Teacher', years: '5-10 years', salary: '~$100k', description: 'Mentoring other teachers, leading curriculum development', color: '#8b5cf6' },
      { level: 'Head of Department / Principal', years: '10+ years', salary: '~$130k+', description: 'Leading a school or department', color: '#eab308' },
    ],
    impact: "Teachers shape the future by shaping the people who'll build it. Every doctor, engineer, artist, and leader started with a teacher who believed in them. You'll be that person for hundreds of students throughout your career.",
    salaryLow: 73000,
    salaryHigh: 115000,
    growthRate: 8.5,
    skills: ['Lesson Planning', 'Classroom Management', 'Communication', 'Patience', 'Subject Matter Expertise', 'Adaptability'],
    category: 'EDUCATION',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['english', 'mathsAdvanced'], 72, '4 years', 'Bachelor of Education (Primary or Secondary). Alternatively, a bachelor degree in a discipline plus a Master of Teaching (2 years). NESA/VIT registration required.')),
      uniPathway('SA', ['english', 'mathsAdvanced'], 68, '4 years', 'Bachelor of Education at University of South Australia or Flinders.'),
      uniPathway('TAS', ['english', 'mathsAdvanced'], 65, '4 years', 'Bachelor of Education at University of Tasmania.'),
    ],
  },

  // 13. Plumber
  {
    title: 'Plumber',
    slug: 'plumber',
    description:
      'Plumbers install, repair, and maintain water, gas, and drainage systems in residential and commercial properties. With ongoing demand for new housing and renovations, plumbing remains one of the most secure and well-paying trades. The role offers hands-on work, variety, and strong opportunities for self-employment.',
    image: '/images/careers/plumber.png',
    dayInLife: "Your morning starts with a call-out to fix a burst pipe in a family home. You diagnose the issue, replace the section, and test the water pressure. Next, you head to a new build to rough-in the plumbing for the kitchen and bathrooms. You read plans, cut and join pipes, and make sure everything meets code. Each job is different.",
    progression: [
      { level: 'Apprentice Plumber', years: '0-4 years', salary: '~$35-55k', description: 'Learning plumbing skills on the job', color: '#22c55e' },
      { level: 'Licensed Plumber', years: '4-8 years', salary: '~$75k', description: 'Working independently on residential and commercial jobs', color: '#3b82f6' },
      { level: 'Senior / Gas Fitter', years: '8-12 years', salary: '~$95k', description: 'Gas fitting, roofing, or drainage specialisation', color: '#8b5cf6' },
      { level: 'Business Owner', years: '10+ years', salary: '~$120k+', description: 'Running your own plumbing business', color: '#eab308' },
    ],
    impact: "Plumbers provide clean water and safe sanitation \u2014 two of the most fundamental needs for human health. Without plumbers, modern cities couldn't function. You'll keep communities healthy and safe every single day.",
    salaryLow: 65000,
    salaryHigh: 115000,
    growthRate: 10.5,
    skills: ['Pipe Fitting and Soldering', 'Blueprint Reading', 'Problem Diagnosis', 'Building Code Knowledge', 'Mathematics', 'Customer Service'],
    category: 'TRADES',
    pathways: [
      ...STATES_CORE.map((s) => apprenticeshipPathway(s, ['Certificate III in Plumbing'], '4 years', 'Year 10 completion. Plumbing licence required upon completion. White Card required.')),
      apprenticeshipPathway('SA', ['Certificate III in Plumbing'], '4 years', 'Year 10 completion. Plumbing licence required.'),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate II in Plumbing (Pre-apprenticeship)', 'Certificate III in Plumbing'], '6 months - 1 year (pre-apprenticeship)', 'Year 10 completion. Pre-apprenticeship provides foundation skills.')),
    ],
  },

  // 14. Data Analyst
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    description:
      'Data analysts collect, process, and interpret data to help organisations make informed decisions. They use statistical tools, visualisation software, and programming languages to uncover trends and insights. This rapidly growing field spans every industry, from healthcare to finance, and is ideal for students who enjoy maths, patterns, and logical reasoning.',
    image: '/images/careers/data-analyst.png',
    dayInLife: "You start by pulling data from the company's database using SQL. You clean and process it in Python, looking for patterns. Mid-morning, you build a dashboard in Tableau to visualise customer trends for the marketing team. After lunch, you present your findings to the leadership team and recommend actions based on the data. They love the insights.",
    progression: [
      { level: 'Junior Data Analyst', years: '0-2 years', salary: '~$70k', description: 'Writing queries, building basic reports and dashboards', color: '#22c55e' },
      { level: 'Data Analyst', years: '2-5 years', salary: '~$90k', description: 'Leading analysis projects, presenting to stakeholders', color: '#3b82f6' },
      { level: 'Senior Analyst / Data Scientist', years: '5-8 years', salary: '~$120k', description: 'Building predictive models, leading analytics teams', color: '#8b5cf6' },
      { level: 'Head of Analytics / CDO', years: '10+ years', salary: '~$160k+', description: 'Setting data strategy for the whole organisation', color: '#eab308' },
    ],
    impact: "Data analysts help organisations make smarter decisions that affect millions of people. From predicting disease outbreaks to optimising public transport routes \u2014 your analysis turns raw numbers into real-world improvements.",
    salaryLow: 70000,
    salaryHigh: 130000,
    growthRate: 25,
    skills: ['SQL and Databases', 'Python or R', 'Data Visualisation (Tableau, Power BI)', 'Statistical Analysis', 'Critical Thinking', 'Communication'],
    category: 'TECHNOLOGY',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['mathsAdvanced', 'english', 'digitalTech'], 78, '3 years', 'Bachelor of Data Science, Analytics, or Information Technology. Statistics and programming units essential.')),
      uniPathway('SA', ['mathsAdvanced', 'english', 'digitalTech'], 74, '3 years', 'Bachelor of Data Analytics at UniSA or University of Adelaide.'),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate IV in Information Technology', 'Diploma of Information Technology (Data Management)'], '1-2 years', 'Year 12 completion. Leads to entry-level data roles or university pathway.')),
    ],
  },

  // 15. Paramedic
  {
    title: 'Paramedic',
    slug: 'paramedic',
    description:
      'Paramedics are frontline healthcare professionals who respond to medical emergencies, provide life-saving treatment, and transport patients to hospital. They work under high-pressure conditions and must make rapid clinical decisions. This career is rewarding for students who want to make a direct difference in people\'s lives and thrive in dynamic environments.',
    image: '/images/careers/paramedic.png',
    dayInLife: "You start your 12-hour shift checking the ambulance \u2014 equipment, medications, defibrillator. Your first call is a chest pain case. You assess the patient, administer oxygen, run an ECG, and transport them to hospital. Between calls, you restock the ambo and debrief with your partner. Every shift is different and you never know what's coming next.",
    progression: [
      { level: 'Graduate Paramedic', years: '0-2 years', salary: '~$70k', description: 'Working under supervision on an ambulance', color: '#22c55e' },
      { level: 'Paramedic', years: '2-5 years', salary: '~$85k', description: 'Responding independently to emergencies', color: '#3b82f6' },
      { level: 'Intensive Care Paramedic', years: '5-10 years', salary: '~$100k', description: 'Advanced life support, critical cases', color: '#8b5cf6' },
      { level: 'Team Leader / Educator', years: '10+ years', salary: '~$115k+', description: 'Leading ambulance teams or training the next generation', color: '#eab308' },
    ],
    impact: "Paramedics are often the first medical professionals on the scene when someone's life is in danger. You'll save lives, comfort people in their worst moments, and be the person communities rely on when every second counts.",
    salaryLow: 70000,
    salaryHigh: 110000,
    growthRate: 12,
    skills: ['Emergency Medical Care', 'Patient Assessment', 'Decision Making Under Pressure', 'Physical Fitness', 'Teamwork', 'Communication'],
    category: 'HEALTH',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['biology', 'english', 'healthPE'], 75, '3 years', 'Bachelor of Paramedicine or Paramedic Science. Clinical placements with ambulance services mandatory. AHPRA registration required.')),
      uniPathway('SA', ['biology', 'english', 'healthPE'], 72, '3 years', 'Bachelor of Paramedic Science at Flinders University. Ambulance placements included.'),
      uniPathway('TAS', ['biology', 'english', 'healthPE'], 70, '3 years', 'Bachelor of Paramedicine at University of Tasmania.'),
    ],
  },

  // 16. Film/Media Producer
  {
    title: 'Film/Media Producer',
    slug: 'film-media-producer',
    description:
      'Film and media producers oversee the creation of content for television, film, online platforms, and advertising. They manage budgets, coordinate production teams, and guide creative projects from concept to completion. This career combines creative vision with business acumen and suits students with strong organisational skills and a passion for storytelling.',
    image: '/images/careers/film-producer.png',
    dayInLife: "Your morning starts with a production meeting \u2014 going over today's shooting schedule with the director, camera crew, and actors. You check the budget, coordinate with the location manager, and solve a last-minute equipment issue. During filming, you oversee everything runs on time and on budget. In post-production, you work with editors to shape the final cut.",
    progression: [
      { level: 'Production Assistant', years: '0-2 years', salary: '~$50k', description: 'Learning the ropes on film and TV sets', color: '#22c55e' },
      { level: 'Producer / Content Creator', years: '2-5 years', salary: '~$70k', description: 'Managing smaller productions and digital content', color: '#3b82f6' },
      { level: 'Senior Producer', years: '5-10 years', salary: '~$95k', description: 'Leading major productions, managing large teams', color: '#8b5cf6' },
      { level: 'Executive Producer / Owner', years: '10+ years', salary: '~$130k+', description: 'Running a production company or overseeing slate of projects', color: '#eab308' },
    ],
    impact: "Film and media producers create the stories that shape culture. From documentaries that expose injustice to entertainment that brings people together \u2014 the content you produce can change how people see the world.",
    salaryLow: 55000,
    salaryHigh: 110000,
    growthRate: 9,
    skills: ['Project Management', 'Video Production', 'Scriptwriting', 'Budget Management', 'Creative Direction', 'Networking'],
    category: 'CREATIVE',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['english', 'mediaArts', 'visualArts'], 68, '3-4 years', 'Bachelor of Film, Television and Screen Production or Media and Communications. Practical studio experience essential.')),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate IV in Screen and Media', 'Diploma of Screen and Media'], '1-2 years', 'Year 10 or 12 completion. Showreel or portfolio recommended.')),
      ...(['NSW', 'VIC', 'QLD'] as const).map((s) => {
        const subj = STATE_SUBJECTS[s];
        return artsPathway(s, [subj.mediaArts, subj.english, subj.visualArts], '2-3 years', 'Portfolio and showreel submission. Audition or interview may be required.');
      }),
    ],
  },

  // 17. Veterinarian
  {
    title: 'Veterinarian',
    slug: 'veterinarian',
    description:
      'Veterinarians diagnose, treat, and prevent illness and injury in animals, from household pets to livestock and wildlife. They work in clinics, hospitals, farms, zoos, and research settings. This competitive career demands strong academic performance in science, a genuine love for animals, and excellent interpersonal skills for communicating with pet owners.',
    image: '/images/careers/veterinarian.png',
    dayInLife: "Your morning starts with consultations \u2014 a dog with a limp, a cat that's stopped eating, a rabbit needing vaccinations. You run blood tests, take X-rays, and perform a dental cleaning on a senior dog. After lunch, you do a surgery to remove a tumour. You call the owner with the good news, write up your notes, and check on your hospitalised patients.",
    progression: [
      { level: 'Graduate Veterinarian', years: '0-2 years', salary: '~$70k', description: 'Working under supervision in a clinic', color: '#22c55e' },
      { level: 'Veterinarian', years: '2-5 years', salary: '~$85k', description: 'Running consultations and surgeries independently', color: '#3b82f6' },
      { level: 'Senior / Specialist Vet', years: '5-10 years', salary: '~$110k', description: 'Emergency vet, surgeon, or wildlife specialist', color: '#8b5cf6' },
      { level: 'Practice Owner / Professor', years: '10+ years', salary: '~$140k+', description: 'Owning a vet practice or leading veterinary research', color: '#eab308' },
    ],
    impact: "Veterinarians protect both animal welfare and public health. From caring for beloved family pets to preventing disease outbreaks in livestock that feed millions \u2014 you'll safeguard the bond between humans and animals.",
    salaryLow: 70000,
    salaryHigh: 120000,
    growthRate: 11.5,
    skills: ['Animal Anatomy and Physiology', 'Surgical Skills', 'Diagnostic Reasoning', 'Empathy', 'Science Communication', 'Business Management'],
    category: 'SCIENCE',
    pathways: [
      uniPathway('NSW', ['biology', 'chemistry', 'physics', 'english'], 93, '5-6 years', 'Bachelor of Veterinary Biology / Doctor of Veterinary Medicine at University of Sydney. Very competitive entry.'),
      uniPathway('VIC', ['biology', 'chemistry', 'physics', 'english'], 92, '5-6 years', 'Bachelor of Veterinary Science at University of Melbourne. Limited places available.'),
      uniPathway('QLD', ['biology', 'chemistry', 'physics', 'english'], 90, '5 years', 'Bachelor of Veterinary Science (Honours) at University of Queensland or James Cook University.'),
      uniPathway('WA', ['biology', 'chemistry', 'physics', 'english'], 92, '5 years', 'Bachelor of Science / Doctor of Veterinary Medicine at Murdoch University.'),
      uniPathway('SA', ['biology', 'chemistry', 'physics', 'english'], 90, '5-6 years', 'Bachelor of Veterinary Science. May require interstate study or UniAdelaide pathway.'),
    ],
  },

  // 18. Marketing Manager
  {
    title: 'Marketing Manager',
    slug: 'marketing-manager',
    description:
      'Marketing managers develop and execute strategies to promote products, services, and brands across digital and traditional channels. They analyse market trends, manage campaigns, and measure business impact. This career suits students with strong communication skills, creativity, and an interest in consumer behaviour and digital media.',
    image: '/images/careers/marketing-manager.png',
    dayInLife: "You start with a team standup to review campaign performance. Instagram ads are killing it, but the email open rate needs work. You brief the design team on a new product launch campaign, then jump into Google Analytics to track website conversions. After lunch, you brainstorm content ideas for TikTok with the social media team and draft a strategy doc for the CEO.",
    progression: [
      { level: 'Marketing Coordinator', years: '0-2 years', salary: '~$60k', description: 'Supporting campaigns, managing social media', color: '#22c55e' },
      { level: 'Marketing Specialist', years: '2-5 years', salary: '~$80k', description: 'Running campaigns across digital and traditional channels', color: '#3b82f6' },
      { level: 'Marketing Manager', years: '5-8 years', salary: '~$110k', description: 'Leading the marketing team and strategy', color: '#8b5cf6' },
      { level: 'CMO / VP Marketing', years: '10+ years', salary: '~$160k+', description: 'Setting marketing direction for the whole business', color: '#eab308' },
    ],
    impact: "Marketing managers help businesses grow and reach people with products and services that improve their lives. From launching campaigns that raise awareness for social causes to helping small businesses find their audience \u2014 you'll connect people with what matters.",
    salaryLow: 70000,
    salaryHigh: 135000,
    growthRate: 10,
    skills: ['Digital Marketing (SEO, SEM, Social Media)', 'Campaign Management', 'Data Analysis', 'Brand Strategy', 'Communication', 'Budget Management'],
    category: 'BUSINESS',
    pathways: [
      ...STATES_CORE.map((s) => uniPathway(s, ['english', 'business', 'mathsAdvanced'], 73, '3 years', 'Bachelor of Marketing, Commerce (Marketing major), or Business. Internships highly recommended for industry experience.')),
      uniPathway('SA', ['english', 'business', 'mathsAdvanced'], 68, '3 years', 'Bachelor of Marketing at UniSA or University of Adelaide.'),
      uniPathway('TAS', ['english', 'business', 'mathsAdvanced'], 65, '3 years', 'Bachelor of Business at University of Tasmania (Marketing specialisation).'),
      ...STATES_CORE.map((s) => tafePathway(s, ['Certificate IV in Marketing and Communication', 'Diploma of Marketing and Communication'], '1-2 years', 'Year 12 completion. Pathway to university or direct marketing roles.')),
    ],
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log('Starting CareerIgnite database seed...\n');

  // ---- Step 1: Clean existing data in correct order ----
  console.log('Deleting existing data...');
  await prisma.statePathway.deleteMany();
  console.log('  - StatePathway records deleted');
  await prisma.planCareer.deleteMany();
  console.log('  - PlanCareer records deleted');
  await prisma.plan.deleteMany();
  console.log('  - Plan records deleted');
  await prisma.career.deleteMany();
  console.log('  - Career records deleted');
  console.log('Existing data cleared.\n');

  // ---- Step 2: Seed careers with pathways ----
  console.log(`Seeding ${careers.length} careers with state pathways...\n`);

  for (const career of careers) {
    const created = await prisma.career.create({
      data: {
        title: career.title,
        slug: career.slug,
        description: career.description,
        image: career.image,
        dayInLife: career.dayInLife,
        progression: career.progression,
        impact: career.impact,
        salaryLow: career.salaryLow,
        salaryHigh: career.salaryHigh,
        growthRate: career.growthRate,
        skills: career.skills,
        category: career.category as any,
        pathways: {
          create: career.pathways.map((p) => ({
            state: p.state as any,
            pathwayType: p.pathwayType as any,
            subjects: p.subjects,
            rankTarget: p.rankTarget ?? null,
            institutions: p.institutions,
            duration: p.duration,
            entryRequirements: p.entryRequirements ?? null,
          })),
        },
      },
      include: {
        pathways: true,
      },
    });

    console.log(
      `  [${careers.indexOf(career) + 1}/${careers.length}] ${created.title} — ${created.pathways.length} pathways created`,
    );
  }

  // ---- Step 3: Expanded careers ----
  const { seedExpandedCareers } = await import('./seed-careers-expanded');
  await seedExpandedCareers();

  // ---- Step 4: RIASEC data ----
  const { seedRiasecData } = await import('./seed-riasec');
  await seedRiasecData();

  // ---- Step 5: Summary ----
  const careerCount = await prisma.career.count();
  const pathwayCount = await prisma.statePathway.count();
  console.log(`\nSeed complete!`);
  console.log(`  Total careers:  ${careerCount}`);
  console.log(`  Total pathways: ${pathwayCount}`);
}

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------

main()
  .then(() => {
    console.log('\nSeed finished successfully.');
  })
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
