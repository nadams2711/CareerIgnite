import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// State-specific subject pools for realistic subjectCounts
// ---------------------------------------------------------------------------

const QLD_SUBJECTS: Record<string, number>[] = [
  // Pool A – Brisbane State High (creative-leaning)
  {
    'English': 52, 'Mathematical Methods': 38, 'Visual Art': 44, 'Digital Solutions': 22,
    'Chemistry': 18, 'Biology': 26, 'Physics': 16, 'Health and Physical Education': 30,
    'Business': 14, 'Film, Television and New Media': 20, 'Music': 12, 'Japanese': 8,
  },
  // Pool B – Indooroopilly State High (STEM-leaning)
  {
    'English': 48, 'Mathematical Methods': 45, 'Specialist Mathematics': 20, 'Physics': 32,
    'Chemistry': 30, 'Biology': 22, 'Digital Solutions': 28, 'Health and Physical Education': 18,
    'Business': 16, 'Visual Art': 10, 'Economics': 14, 'Chinese': 6,
  },
];

const NSW_SUBJECTS: Record<string, number>[] = [
  // Pool A – Sydney Boys High (academic-heavy)
  {
    'English Advanced': 55, 'Mathematics Advanced': 48, 'Mathematics Extension 1': 30,
    'Physics': 35, 'Chemistry': 32, 'Biology': 20, 'Economics': 24,
    'Software Design and Development': 18, 'Business Studies': 16, 'Visual Arts': 10,
    'Modern History': 14, 'Legal Studies': 12,
  },
  // Pool B – Caringbah High (balanced/practical)
  {
    'English Advanced': 42, 'English Standard': 28, 'Mathematics Advanced': 30,
    'Mathematics Standard 2': 22, 'Biology': 26, 'Chemistry': 18, 'Visual Arts': 32,
    'Personal Development, Health and Physical Education': 35, 'Business Studies': 20,
    'Software Design and Development': 14, 'Music': 16, 'Media Studies': 12,
  },
];

const VIC_SUBJECTS: Record<string, number>[] = [
  // Pool A – Melbourne High (academic)
  {
    'English': 50, 'Mathematical Methods': 46, 'Specialist Mathematics': 28,
    'Physics': 34, 'Chemistry': 30, 'Biology': 18, 'Algorithmics (HESS)': 22,
    'Business Management': 16, 'Economics': 20, 'Physical Education': 14,
    'Visual Communication Design': 10, 'History: Revolutions': 12,
  },
  // Pool B – Box Hill High (arts/tech mix)
  {
    'English': 46, 'Mathematical Methods': 32, 'Media': 26,
    'Visual Communication Design': 34, 'Physics': 18, 'Chemistry': 16,
    'Biology': 22, 'Algorithmics (HESS)': 20, 'Physical Education': 28,
    'Business Management': 14, 'Psychology': 24, 'Studio Arts': 18,
  },
];

const WA_SUBJECTS: Record<string, number>[] = [
  // Pool A – Perth Modern (gifted & talented)
  {
    'English ATAR': 52, 'Mathematics Methods ATAR': 50, 'Mathematics Specialist ATAR': 32,
    'Physics ATAR': 38, 'Chemistry ATAR': 36, 'Human Biology ATAR': 20,
    'Computer Science ATAR': 24, 'Economics ATAR': 18, 'Visual Arts ATAR': 12,
    'French ATAR': 10, 'Music ATAR': 8, 'Politics and Law ATAR': 14,
  },
  // Pool B – Rossmoyne Senior High (well-rounded)
  {
    'English ATAR': 48, 'Mathematics Methods ATAR': 40, 'Chemistry ATAR': 28,
    'Human Biology ATAR': 32, 'Physics ATAR': 22, 'Accounting and Finance ATAR': 20,
    'Computer Science ATAR': 18, 'Health Studies ATAR': 26, 'Visual Arts ATAR': 16,
    'Media Production and Analysis ATAR': 14, 'Chinese: Second Language ATAR': 10,
    'Physical Education Studies ATAR': 24,
  },
];

const SA_SUBJECTS: Record<string, number> = {
  'English': 44, 'Mathematical Methods': 36, 'Physics': 22, 'Chemistry': 24,
  'Biology': 28, 'Digital Technologies': 16, 'Physical Education': 30,
  'Business and Enterprise': 14, 'Visual Arts \u2013 Art': 18, 'Media Studies': 12,
  'Psychology': 20, 'Research Project': 40,
};

const TAS_SUBJECTS: Record<string, number> = {
  'English': 40, 'Mathematics Methods': 30, 'Physical Sciences': 18,
  'Chemistry': 16, 'Biology': 24, 'Information Technology': 14,
  'Health Studies': 22, 'Accounting': 12, 'Art Production': 20,
  'Media Production': 10, 'Environmental Science': 8, 'Psychology': 16,
};

// ---------------------------------------------------------------------------
// Career slug pools for realistic careerCounts
// ---------------------------------------------------------------------------

const CAREER_POOLS: Record<string, number>[][] = [
  // 0 – Creative-heavy
  [
    { 'graphic-designer': 18, 'film-media-producer': 14, 'software-developer': 12, 'registered-nurse': 8, 'electrician': 6, 'primary-secondary-teacher': 10, 'marketing-manager': 9, 'sports-scientist': 5, 'chef-commercial-cook': 4, 'data-analyst': 7, 'accountant': 3, 'physiotherapist': 6 },
  ],
  // 1 – STEM-heavy
  [
    { 'software-developer': 20, 'cybersecurity-analyst': 16, 'data-analyst': 14, 'civil-engineer': 12, 'registered-nurse': 10, 'electrician': 8, 'accountant': 9, 'physiotherapist': 6, 'graphic-designer': 4, 'sports-scientist': 5, 'primary-secondary-teacher': 7, 'veterinarian': 6 },
  ],
  // 2 – Academic/Science
  [
    { 'civil-engineer': 14, 'software-developer': 16, 'registered-nurse': 12, 'veterinarian': 10, 'data-analyst': 11, 'physiotherapist': 8, 'cybersecurity-analyst': 9, 'accountant': 7, 'primary-secondary-teacher': 8, 'electrician': 5, 'marketing-manager': 6, 'sports-scientist': 4 },
  ],
  // 3 – Trades-oriented
  [
    { 'electrician': 16, 'carpenter': 14, 'plumber': 12, 'chef-commercial-cook': 10, 'registered-nurse': 8, 'software-developer': 7, 'sports-scientist': 9, 'primary-secondary-teacher': 6, 'graphic-designer': 5, 'accountant': 4, 'data-analyst': 5, 'physiotherapist': 6 },
  ],
  // 4 – Health-focused
  [
    { 'registered-nurse': 18, 'physiotherapist': 14, 'paramedic': 12, 'veterinarian': 8, 'sports-scientist': 10, 'primary-secondary-teacher': 9, 'software-developer': 6, 'accountant': 5, 'electrician': 4, 'graphic-designer': 5, 'data-analyst': 7, 'chef-commercial-cook': 3 },
  ],
  // 5 – Balanced/services
  [
    { 'software-developer': 10, 'registered-nurse': 10, 'electrician': 10, 'graphic-designer': 8, 'marketing-manager': 12, 'accountant': 11, 'primary-secondary-teacher': 9, 'chef-commercial-cook': 8, 'data-analyst': 7, 'sports-scientist': 6, 'carpenter': 5, 'plumber': 5 },
  ],
  // 6 – Business-leaning
  [
    { 'accountant': 16, 'marketing-manager': 14, 'data-analyst': 12, 'software-developer': 10, 'registered-nurse': 8, 'primary-secondary-teacher': 9, 'civil-engineer': 7, 'graphic-designer': 6, 'electrician': 5, 'physiotherapist': 5, 'chef-commercial-cook': 4, 'cybersecurity-analyst': 8 },
  ],
  // 7 – Sports/PE-leaning
  [
    { 'sports-scientist': 16, 'physiotherapist': 14, 'primary-secondary-teacher': 12, 'registered-nurse': 10, 'paramedic': 8, 'chef-commercial-cook': 6, 'software-developer': 8, 'electrician': 7, 'graphic-designer': 5, 'accountant': 4, 'carpenter': 6, 'marketing-manager': 5 },
  ],
  // 8 – Arts/Media-leaning
  [
    { 'graphic-designer': 22, 'film-media-producer': 18, 'marketing-manager': 10, 'software-developer': 8, 'primary-secondary-teacher': 9, 'chef-commercial-cook': 7, 'registered-nurse': 6, 'data-analyst': 5, 'accountant': 4, 'electrician': 3, 'sports-scientist': 4, 'physiotherapist': 5 },
  ],
  // 9 – Tech/Engineering-heavy
  [
    { 'software-developer': 22, 'cybersecurity-analyst': 18, 'data-analyst': 16, 'civil-engineer': 14, 'electrician': 10, 'accountant': 8, 'registered-nurse': 6, 'graphic-designer': 4, 'primary-secondary-teacher': 5, 'marketing-manager': 6, 'sports-scientist': 3, 'physiotherapist': 4 },
  ],
];

// ---------------------------------------------------------------------------
// School definitions — demo schools with full insights
// ---------------------------------------------------------------------------

interface SchoolSeed {
  code: string;
  name: string;
  suburb: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  interestCounts: Record<string, number>;
  careerPoolIndex: number;
  subjectCounts: Record<string, number>;
  atarAvg: number;
  studentCount: number;
}

const schools: SchoolSeed[] = [
  {
    code: 'brisbane-state-high',
    name: 'Brisbane State High School',
    suburb: 'Brisbane',
    state: 'QLD',
    interestCounts: { CREATIVE: 42, TECHNOLOGY: 28, HEALTH: 18, TRADES: 15, BUSINESS: 12, SCIENCE: 10, EDUCATION: 8, SPORTS: 7, SERVICES: 5 },
    careerPoolIndex: 0,
    subjectCounts: QLD_SUBJECTS[0],
    atarAvg: 74.3,
    studentCount: 195,
  },
  {
    code: 'sydney-boys-high',
    name: 'Sydney Boys High School',
    suburb: 'Surry Hills',
    state: 'NSW',
    interestCounts: { TECHNOLOGY: 48, SCIENCE: 35, BUSINESS: 28, HEALTH: 16, EDUCATION: 10, CREATIVE: 8, TRADES: 5, SPORTS: 12, SERVICES: 4 },
    careerPoolIndex: 1,
    subjectCounts: NSW_SUBJECTS[0],
    atarAvg: 81.6,
    studentCount: 210,
  },
  {
    code: 'melbourne-high',
    name: 'Melbourne High School',
    suburb: 'South Yarra',
    state: 'VIC',
    interestCounts: { SCIENCE: 40, TECHNOLOGY: 38, BUSINESS: 22, HEALTH: 18, EDUCATION: 12, CREATIVE: 10, SPORTS: 8, TRADES: 6, SERVICES: 4 },
    careerPoolIndex: 2,
    subjectCounts: VIC_SUBJECTS[0],
    atarAvg: 80.2,
    studentCount: 230,
  },
  {
    code: 'perth-modern',
    name: 'Perth Modern School',
    suburb: 'Subiaco',
    state: 'WA',
    interestCounts: { TECHNOLOGY: 44, SCIENCE: 42, HEALTH: 20, BUSINESS: 18, EDUCATION: 14, CREATIVE: 12, SPORTS: 10, TRADES: 4, SERVICES: 3 },
    careerPoolIndex: 9,
    subjectCounts: WA_SUBJECTS[0],
    atarAvg: 82.0,
    studentCount: 245,
  },
  {
    code: 'adelaide-high',
    name: 'Adelaide High School',
    suburb: 'Adelaide',
    state: 'SA',
    interestCounts: { HEALTH: 30, SCIENCE: 24, TECHNOLOGY: 22, EDUCATION: 18, BUSINESS: 16, CREATIVE: 14, SPORTS: 12, TRADES: 10, SERVICES: 8 },
    careerPoolIndex: 4,
    subjectCounts: SA_SUBJECTS,
    atarAvg: 72.8,
    studentCount: 175,
  },
  {
    code: 'hobart-college',
    name: 'Hobart College',
    suburb: 'Hobart',
    state: 'TAS',
    interestCounts: { CREATIVE: 26, HEALTH: 24, SERVICES: 18, EDUCATION: 16, TRADES: 14, SPORTS: 12, SCIENCE: 10, TECHNOLOGY: 8, BUSINESS: 6 },
    careerPoolIndex: 5,
    subjectCounts: TAS_SUBJECTS,
    atarAvg: 68.4,
    studentCount: 134,
  },
  {
    code: 'caringbah-high',
    name: 'Caringbah High School',
    suburb: 'Caringbah',
    state: 'NSW',
    interestCounts: { SPORTS: 32, CREATIVE: 28, HEALTH: 22, TRADES: 20, SERVICES: 14, TECHNOLOGY: 12, EDUCATION: 10, BUSINESS: 8, SCIENCE: 6 },
    careerPoolIndex: 7,
    subjectCounts: NSW_SUBJECTS[1],
    atarAvg: 69.7,
    studentCount: 162,
  },
  {
    code: 'indooroopilly-state-high',
    name: 'Indooroopilly State High School',
    suburb: 'Indooroopilly',
    state: 'QLD',
    interestCounts: { TECHNOLOGY: 36, SCIENCE: 30, HEALTH: 22, BUSINESS: 18, EDUCATION: 14, CREATIVE: 12, TRADES: 10, SPORTS: 8, SERVICES: 6 },
    careerPoolIndex: 6,
    subjectCounts: QLD_SUBJECTS[1],
    atarAvg: 76.5,
    studentCount: 188,
  },
  {
    code: 'box-hill-high',
    name: 'Box Hill High School',
    suburb: 'Box Hill',
    state: 'VIC',
    interestCounts: { CREATIVE: 36, TECHNOLOGY: 24, HEALTH: 20, SPORTS: 18, EDUCATION: 14, TRADES: 12, BUSINESS: 10, SCIENCE: 8, SERVICES: 6 },
    careerPoolIndex: 8,
    subjectCounts: VIC_SUBJECTS[1],
    atarAvg: 71.1,
    studentCount: 148,
  },
  {
    code: 'rossmoyne-senior-high',
    name: 'Rossmoyne Senior High School',
    suburb: 'Rossmoyne',
    state: 'WA',
    interestCounts: { TRADES: 28, TECHNOLOGY: 24, HEALTH: 22, BUSINESS: 20, SPORTS: 16, SCIENCE: 14, CREATIVE: 10, EDUCATION: 8, SERVICES: 6 },
    careerPoolIndex: 3,
    subjectCounts: WA_SUBJECTS[1],
    atarAvg: 73.9,
    studentCount: 198,
  },
];

// ---------------------------------------------------------------------------
// Additional ~190 real Australian secondary schools (no insights data)
// ---------------------------------------------------------------------------

interface AdditionalSchoolSeed {
  code: string;
  name: string;
  suburb: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
}

const additionalSchools: AdditionalSchoolSeed[] = [
  // =========================================================================
  // NEW SOUTH WALES (~40 schools)
  // =========================================================================
  { code: 'james-ruse-agricultural-high', name: 'James Ruse Agricultural High School', suburb: 'Carlingford', state: 'NSW' },
  { code: 'fort-street-high', name: 'Fort Street High School', suburb: 'Petersham', state: 'NSW' },
  { code: 'north-sydney-boys-high', name: 'North Sydney Boys High School', suburb: 'Crows Nest', state: 'NSW' },
  { code: 'north-sydney-girls-high', name: 'North Sydney Girls High School', suburb: 'Crows Nest', state: 'NSW' },
  { code: 'sydney-girls-high', name: 'Sydney Girls High School', suburb: 'Surry Hills', state: 'NSW' },
  { code: 'hornsby-girls-high', name: 'Hornsby Girls High School', suburb: 'Hornsby', state: 'NSW' },
  { code: 'baulkham-hills-high', name: 'Baulkham Hills High School', suburb: 'Baulkham Hills', state: 'NSW' },
  { code: 'normanhurst-boys-high', name: 'Normanhurst Boys High School', suburb: 'Normanhurst', state: 'NSW' },
  { code: 'penrith-high', name: 'Penrith High School', suburb: 'Penrith', state: 'NSW' },
  { code: 'hurlstone-agricultural-high', name: 'Hurlstone Agricultural High School', suburb: 'Glenfield', state: 'NSW' },
  { code: 'gosford-high', name: 'Gosford High School', suburb: 'Gosford', state: 'NSW' },
  { code: 'smiths-hill-high', name: 'Smith\'s Hill High School', suburb: 'Wollongong', state: 'NSW' },
  { code: 'manly-selective-campus', name: 'Northern Beaches Secondary College Manly Campus', suburb: 'Manly', state: 'NSW' },
  { code: 'riverside-girls-high', name: 'Riverside Girls High School', suburb: 'Gladesville', state: 'NSW' },
  { code: 'burwood-girls-high', name: 'Burwood Girls High School', suburb: 'Croydon', state: 'NSW' },
  { code: 'randwick-boys-high', name: 'Randwick Boys High School', suburb: 'Randwick', state: 'NSW' },
  { code: 'randwick-girls-high', name: 'Randwick Girls High School', suburb: 'Randwick', state: 'NSW' },
  { code: 'epping-boys-high', name: 'Epping Boys High School', suburb: 'Epping', state: 'NSW' },
  { code: 'chatswood-high', name: 'Chatswood High School', suburb: 'Chatswood', state: 'NSW' },
  { code: 'willoughby-girls-high', name: 'Willoughby Girls High School', suburb: 'Willoughby', state: 'NSW' },
  { code: 'st-george-girls-high', name: 'St George Girls High School', suburb: 'Kogarah', state: 'NSW' },
  { code: 'newcastle-high', name: 'Newcastle High School', suburb: 'Hamilton', state: 'NSW' },
  { code: 'merewether-high', name: 'Merewether High School', suburb: 'Broadmeadow', state: 'NSW' },
  { code: 'callaghan-college-senior', name: 'Callaghan College Senior Campus', suburb: 'Jesmond', state: 'NSW' },
  { code: 'hunter-school-of-performing-arts', name: 'Hunter School of the Performing Arts', suburb: 'Broadmeadow', state: 'NSW' },
  { code: 'canley-vale-high', name: 'Canley Vale High School', suburb: 'Canley Vale', state: 'NSW' },
  { code: 'girraween-high', name: 'Girraween High School', suburb: 'Girraween', state: 'NSW' },
  { code: 'sefton-high', name: 'Sefton High School', suburb: 'Sefton', state: 'NSW' },
  { code: 'tempe-high', name: 'Tempe High School', suburb: 'Tempe', state: 'NSW' },
  { code: 'dulwich-high-school-of-visual-arts', name: 'Dulwich High School of Visual Arts and Design', suburb: 'Dulwich Hill', state: 'NSW' },
  { code: 'macquarie-fields-high', name: 'Macquarie Fields High School', suburb: 'Macquarie Fields', state: 'NSW' },
  { code: 'campbelltown-performing-arts-high', name: 'Campbelltown Performing Arts High School', suburb: 'Campbelltown', state: 'NSW' },
  { code: 'port-macquarie-high', name: 'Port Macquarie High School', suburb: 'Port Macquarie', state: 'NSW' },
  { code: 'coffs-harbour-high', name: 'Coffs Harbour High School', suburb: 'Coffs Harbour', state: 'NSW' },
  { code: 'dubbo-senior-campus', name: 'Dubbo College Senior Campus', suburb: 'Dubbo', state: 'NSW' },
  { code: 'tamworth-high', name: 'Tamworth High School', suburb: 'Tamworth', state: 'NSW' },
  { code: 'wagga-wagga-high', name: 'Wagga Wagga High School', suburb: 'Wagga Wagga', state: 'NSW' },
  { code: 'armidale-secondary-college', name: 'Armidale Secondary College', suburb: 'Armidale', state: 'NSW' },
  { code: 'orange-high', name: 'Orange High School', suburb: 'Orange', state: 'NSW' },
  { code: 'nowra-high', name: 'Nowra High School', suburb: 'Nowra', state: 'NSW' },

  // =========================================================================
  // VICTORIA (~35 schools)
  // =========================================================================
  { code: 'mac-robertson-girls-high', name: 'Mac.Robertson Girls\' High School', suburb: 'Melbourne', state: 'VIC' },
  { code: 'nossal-high', name: 'Nossal High School', suburb: 'Berwick', state: 'VIC' },
  { code: 'suzanne-cory-high', name: 'Suzanne Cory High School', suburb: 'Werribee', state: 'VIC' },
  { code: 'john-monash-science', name: 'John Monash Science School', suburb: 'Clayton', state: 'VIC' },
  { code: 'university-high', name: 'University High School', suburb: 'Parkville', state: 'VIC' },
  { code: 'balwyn-high', name: 'Balwyn High School', suburb: 'Balwyn North', state: 'VIC' },
  { code: 'glen-waverley-secondary', name: 'Glen Waverley Secondary College', suburb: 'Glen Waverley', state: 'VIC' },
  { code: 'mckinnon-secondary', name: 'McKinnon Secondary College', suburb: 'McKinnon', state: 'VIC' },
  { code: 'camberwell-high', name: 'Camberwell High School', suburb: 'Canterbury', state: 'VIC' },
  { code: 'mount-waverley-secondary', name: 'Mount Waverley Secondary College', suburb: 'Mount Waverley', state: 'VIC' },
  { code: 'frankston-high', name: 'Frankston High School', suburb: 'Frankston', state: 'VIC' },
  { code: 'williamstown-high', name: 'Williamstown High School', suburb: 'Williamstown', state: 'VIC' },
  { code: 'northcote-high', name: 'Northcote High School', suburb: 'Northcote', state: 'VIC' },
  { code: 'brunswick-secondary', name: 'Brunswick Secondary College', suburb: 'Brunswick', state: 'VIC' },
  { code: 'kew-high', name: 'Kew High School', suburb: 'Kew East', state: 'VIC' },
  { code: 'templestowe-college', name: 'Templestowe College', suburb: 'Templestowe Lower', state: 'VIC' },
  { code: 'bentleigh-secondary', name: 'Bentleigh Secondary College', suburb: 'Bentleigh East', state: 'VIC' },
  { code: 'eltham-high', name: 'Eltham High School', suburb: 'Eltham', state: 'VIC' },
  { code: 'ringwood-secondary', name: 'Ringwood Secondary College', suburb: 'Ringwood', state: 'VIC' },
  { code: 'footscray-city-college', name: 'Footscray City College', suburb: 'Footscray', state: 'VIC' },
  { code: 'werribee-secondary', name: 'Werribee Secondary College', suburb: 'Werribee', state: 'VIC' },
  { code: 'geelong-high', name: 'Geelong High School', suburb: 'Geelong', state: 'VIC' },
  { code: 'bellarine-secondary', name: 'Bellarine Secondary College', suburb: 'Drysdale', state: 'VIC' },
  { code: 'ballarat-high', name: 'Ballarat High School', suburb: 'Ballarat', state: 'VIC' },
  { code: 'bendigo-senior-secondary', name: 'Bendigo Senior Secondary College', suburb: 'Bendigo', state: 'VIC' },
  { code: 'shepparton-high', name: 'Shepparton High School', suburb: 'Shepparton', state: 'VIC' },
  { code: 'warrnambool-college', name: 'Warrnambool College', suburb: 'Warrnambool', state: 'VIC' },
  { code: 'mildura-senior-college', name: 'Mildura Senior College', suburb: 'Mildura', state: 'VIC' },
  { code: 'swan-hill-college', name: 'Swan Hill College', suburb: 'Swan Hill', state: 'VIC' },
  { code: 'albert-park-college', name: 'Albert Park College', suburb: 'Albert Park', state: 'VIC' },
  { code: 'dandenong-high', name: 'Dandenong High School', suburb: 'Dandenong', state: 'VIC' },
  { code: 'cranbourne-secondary', name: 'Cranbourne Secondary College', suburb: 'Cranbourne', state: 'VIC' },
  { code: 'maribyrnong-college', name: 'Maribyrnong College', suburb: 'Maribyrnong', state: 'VIC' },
  { code: 'mentone-girls-secondary', name: 'Mentone Girls\' Secondary College', suburb: 'Mentone', state: 'VIC' },
  { code: 'pascoe-vale-girls-secondary', name: 'Pascoe Vale Girls Secondary College', suburb: 'Pascoe Vale', state: 'VIC' },

  // =========================================================================
  // QUEENSLAND (~30 schools)
  // =========================================================================
  { code: 'queensland-academy-science-maths', name: 'Queensland Academy for Science Mathematics and Technology', suburb: 'Toowong', state: 'QLD' },
  { code: 'queensland-academy-creative-industries', name: 'Queensland Academy for Creative Industries', suburb: 'Kelvin Grove', state: 'QLD' },
  { code: 'queensland-academy-health-sciences', name: 'Queensland Academy for Health Sciences', suburb: 'Southport', state: 'QLD' },
  { code: 'kenmore-state-high', name: 'Kenmore State High School', suburb: 'Kenmore', state: 'QLD' },
  { code: 'the-gap-state-high', name: 'The Gap State High School', suburb: 'The Gap', state: 'QLD' },
  { code: 'mansfield-state-high', name: 'Mansfield State High School', suburb: 'Mansfield', state: 'QLD' },
  { code: 'mt-gravatt-state-high', name: 'Mount Gravatt State High School', suburb: 'Mount Gravatt', state: 'QLD' },
  { code: 'cavendish-road-state-high', name: 'Cavendish Road State High School', suburb: 'Holland Park', state: 'QLD' },
  { code: 'corinda-state-high', name: 'Corinda State High School', suburb: 'Corinda', state: 'QLD' },
  { code: 'centenary-state-high', name: 'Centenary State High School', suburb: 'Jindalee', state: 'QLD' },
  { code: 'kedron-state-high', name: 'Kedron State High School', suburb: 'Kedron', state: 'QLD' },
  { code: 'kelvin-grove-state-college', name: 'Kelvin Grove State College', suburb: 'Kelvin Grove', state: 'QLD' },
  { code: 'ferny-grove-state-high', name: 'Ferny Grove State High School', suburb: 'Ferny Grove', state: 'QLD' },
  { code: 'mitchelton-state-high', name: 'Mitchelton State High School', suburb: 'Mitchelton', state: 'QLD' },
  { code: 'palm-beach-currumbin-state-high', name: 'Palm Beach Currumbin State High School', suburb: 'Palm Beach', state: 'QLD' },
  { code: 'benowa-state-high', name: 'Benowa State High School', suburb: 'Benowa', state: 'QLD' },
  { code: 'miami-state-high', name: 'Miami State High School', suburb: 'Miami', state: 'QLD' },
  { code: 'keebra-park-state-high', name: 'Keebra Park State High School', suburb: 'Southport', state: 'QLD' },
  { code: 'mountain-creek-state-high', name: 'Mountain Creek State High School', suburb: 'Mountain Creek', state: 'QLD' },
  { code: 'maroochydore-state-high', name: 'Maroochydore State High School', suburb: 'Maroochydore', state: 'QLD' },
  { code: 'townsville-state-high', name: 'Townsville State High School', suburb: 'Townsville', state: 'QLD' },
  { code: 'pimlico-state-high', name: 'Pimlico State High School', suburb: 'Pimlico', state: 'QLD' },
  { code: 'cairns-state-high', name: 'Cairns State High School', suburb: 'Cairns', state: 'QLD' },
  { code: 'smithfield-state-high', name: 'Smithfield State High School', suburb: 'Smithfield', state: 'QLD' },
  { code: 'rockhampton-state-high', name: 'Rockhampton State High School', suburb: 'Rockhampton', state: 'QLD' },
  { code: 'mackay-north-state-high', name: 'Mackay North State High School', suburb: 'Mackay', state: 'QLD' },
  { code: 'bundaberg-state-high', name: 'Bundaberg State High School', suburb: 'Bundaberg', state: 'QLD' },
  { code: 'ipswich-state-high', name: 'Ipswich State High School', suburb: 'Ipswich', state: 'QLD' },
  { code: 'toowoomba-state-high', name: 'Toowoomba State High School', suburb: 'Toowoomba', state: 'QLD' },
  { code: 'hervey-bay-state-high', name: 'Hervey Bay State High School', suburb: 'Hervey Bay', state: 'QLD' },

  // =========================================================================
  // WESTERN AUSTRALIA (~25 schools)
  // =========================================================================
  { code: 'shenton-college', name: 'Shenton College', suburb: 'Shenton Park', state: 'WA' },
  { code: 'churchlands-senior-high', name: 'Churchlands Senior High School', suburb: 'Churchlands', state: 'WA' },
  { code: 'mount-lawley-senior-high', name: 'Mount Lawley Senior High School', suburb: 'Mount Lawley', state: 'WA' },
  { code: 'applecross-senior-high', name: 'Applecross Senior High School', suburb: 'Ardross', state: 'WA' },
  { code: 'willetton-senior-high', name: 'Willetton Senior High School', suburb: 'Willetton', state: 'WA' },
  { code: 'como-secondary', name: 'Como Secondary College', suburb: 'Como', state: 'WA' },
  { code: 'canning-vale-college', name: 'Canning Vale College', suburb: 'Canning Vale', state: 'WA' },
  { code: 'melville-senior-high', name: 'Melville Senior High School', suburb: 'Melville', state: 'WA' },
  { code: 'leeming-senior-high', name: 'Leeming Senior High School', suburb: 'Leeming', state: 'WA' },
  { code: 'wanneroo-secondary', name: 'Wanneroo Secondary College', suburb: 'Wanneroo', state: 'WA' },
  { code: 'greenwood-college', name: 'Greenwood College', suburb: 'Greenwood', state: 'WA' },
  { code: 'duncraig-senior-high', name: 'Duncraig Senior High School', suburb: 'Duncraig', state: 'WA' },
  { code: 'ocean-reef-senior-high', name: 'Ocean Reef Senior High School', suburb: 'Ocean Reef', state: 'WA' },
  { code: 'balcatta-senior-high', name: 'Balcatta Senior High School', suburb: 'Balcatta', state: 'WA' },
  { code: 'morley-senior-high', name: 'Morley Senior High School', suburb: 'Noranda', state: 'WA' },
  { code: 'cyril-jackson-senior-campus', name: 'Cyril Jackson Senior Campus', suburb: 'Bassendean', state: 'WA' },
  { code: 'john-curtin-college-of-the-arts', name: 'John Curtin College of the Arts', suburb: 'Fremantle', state: 'WA' },
  { code: 'carine-senior-high', name: 'Carine Senior High School', suburb: 'Carine', state: 'WA' },
  { code: 'mandurah-senior-college', name: 'Mandurah Senior College', suburb: 'Mandurah', state: 'WA' },
  { code: 'bunbury-senior-high', name: 'Bunbury Senior High School', suburb: 'Bunbury', state: 'WA' },
  { code: 'albany-senior-high', name: 'Albany Senior High School', suburb: 'Albany', state: 'WA' },
  { code: 'geraldton-senior-high', name: 'Geraldton Senior High School', suburb: 'Geraldton', state: 'WA' },
  { code: 'kalgoorlie-boulder-community-high', name: 'Kalgoorlie-Boulder Community High School', suburb: 'Kalgoorlie', state: 'WA' },
  { code: 'karratha-senior-high', name: 'Karratha Senior High School', suburb: 'Karratha', state: 'WA' },
  { code: 'broome-senior-high', name: 'Broome Senior High School', suburb: 'Broome', state: 'WA' },

  // =========================================================================
  // SOUTH AUSTRALIA (~20 schools)
  // =========================================================================
  { code: 'glenunga-international-high', name: 'Glenunga International High School', suburb: 'Glenunga', state: 'SA' },
  { code: 'adelaide-botanic-high', name: 'Adelaide Botanic High School', suburb: 'Adelaide', state: 'SA' },
  { code: 'brighton-secondary', name: 'Brighton Secondary School', suburb: 'North Brighton', state: 'SA' },
  { code: 'marryatville-high', name: 'Marryatville High School', suburb: 'Marryatville', state: 'SA' },
  { code: 'norwood-morialta-high', name: 'Norwood Morialta High School', suburb: 'Norwood', state: 'SA' },
  { code: 'unley-high', name: 'Unley High School', suburb: 'Netherby', state: 'SA' },
  { code: 'charles-campbell-college', name: 'Charles Campbell College', suburb: 'Paradise', state: 'SA' },
  { code: 'blackwood-high', name: 'Blackwood High School', suburb: 'Blackwood', state: 'SA' },
  { code: 'henley-high', name: 'Henley High School', suburb: 'Henley Beach', state: 'SA' },
  { code: 'hamilton-secondary', name: 'Hamilton Secondary College', suburb: 'Mitchell Park', state: 'SA' },
  { code: 'aberfoyle-park-high', name: 'Aberfoyle Park High School', suburb: 'Aberfoyle Park', state: 'SA' },
  { code: 'reynella-east-college', name: 'Reynella East College', suburb: 'Reynella East', state: 'SA' },
  { code: 'seaford-secondary', name: 'Seaford Secondary College', suburb: 'Seaford', state: 'SA' },
  { code: 'golden-grove-high', name: 'Golden Grove High School', suburb: 'Golden Grove', state: 'SA' },
  { code: 'salisbury-east-high', name: 'Salisbury East High School', suburb: 'Salisbury East', state: 'SA' },
  { code: 'mount-gambier-high', name: 'Mount Gambier High School', suburb: 'Mount Gambier', state: 'SA' },
  { code: 'murray-bridge-high', name: 'Murray Bridge High School', suburb: 'Murray Bridge', state: 'SA' },
  { code: 'victor-harbor-high', name: 'Victor Harbor High School', suburb: 'Victor Harbor', state: 'SA' },
  { code: 'port-augusta-secondary', name: 'Port Augusta Secondary School', suburb: 'Port Augusta', state: 'SA' },
  { code: 'whyalla-secondary', name: 'Whyalla Secondary College', suburb: 'Whyalla Norrie', state: 'SA' },

  // =========================================================================
  // TASMANIA (~15 schools)
  // =========================================================================
  { code: 'elizabeth-college', name: 'Elizabeth College', suburb: 'Hobart', state: 'TAS' },
  { code: 'rosny-college', name: 'Rosny College', suburb: 'Rosny Park', state: 'TAS' },
  { code: 'launceston-college', name: 'Launceston College', suburb: 'Launceston', state: 'TAS' },
  { code: 'newstead-college', name: 'Newstead College', suburb: 'Launceston', state: 'TAS' },
  { code: 'don-college', name: 'Don College', suburb: 'Devonport', state: 'TAS' },
  { code: 'hellyer-college', name: 'Hellyer College', suburb: 'Burnie', state: 'TAS' },
  { code: 'devonport-high', name: 'Devonport High School', suburb: 'Devonport', state: 'TAS' },
  { code: 'burnie-high', name: 'Burnie High School', suburb: 'Burnie', state: 'TAS' },
  { code: 'ulverstone-secondary', name: 'Ulverstone Secondary College', suburb: 'Ulverstone', state: 'TAS' },
  { code: 'kingston-high', name: 'Kingston High School', suburb: 'Kingston', state: 'TAS' },
  { code: 'clarence-high', name: 'Clarence High School', suburb: 'Bellerive', state: 'TAS' },
  { code: 'new-norfolk-high', name: 'New Norfolk High School', suburb: 'New Norfolk', state: 'TAS' },
  { code: 'ogilvie-high', name: 'Ogilvie High School', suburb: 'New Town', state: 'TAS' },
  { code: 'taroona-high', name: 'Taroona High School', suburb: 'Taroona', state: 'TAS' },
  { code: 'scotch-oakburn-college', name: 'Scotch Oakburn College', suburb: 'Launceston', state: 'TAS' },

  // =========================================================================
  // AUSTRALIAN CAPITAL TERRITORY (~12 schools)
  // =========================================================================
  { code: 'narrabundah-college', name: 'Narrabundah College', suburb: 'Narrabundah', state: 'ACT' },
  { code: 'dickson-college', name: 'Dickson College', suburb: 'Dickson', state: 'ACT' },
  { code: 'lake-tuggeranong-college', name: 'Lake Tuggeranong College', suburb: 'Tuggeranong', state: 'ACT' },
  { code: 'lake-ginninderra-college', name: 'Lake Ginninderra College', suburb: 'Belconnen', state: 'ACT' },
  { code: 'hawker-college', name: 'Hawker College', suburb: 'Hawker', state: 'ACT' },
  { code: 'erindale-college', name: 'Erindale College', suburb: 'Wanniassa', state: 'ACT' },
  { code: 'canberra-college', name: 'Canberra College', suburb: 'Phillip', state: 'ACT' },
  { code: 'gungahlin-college', name: 'Gungahlin College', suburb: 'Gungahlin', state: 'ACT' },
  { code: 'melrose-high', name: 'Melrose High School', suburb: 'Pearce', state: 'ACT' },
  { code: 'lyneham-high', name: 'Lyneham High School', suburb: 'Lyneham', state: 'ACT' },
  { code: 'belconnen-high', name: 'Belconnen High School', suburb: 'Hawker', state: 'ACT' },
  { code: 'campbell-high', name: 'Campbell High School', suburb: 'Campbell', state: 'ACT' },

  // =========================================================================
  // NORTHERN TERRITORY (~10 schools)
  // =========================================================================
  { code: 'darwin-high', name: 'Darwin High School', suburb: 'Darwin', state: 'NT' },
  { code: 'casuarina-senior-college', name: 'Casuarina Senior College', suburb: 'Casuarina', state: 'NT' },
  { code: 'darwin-middle-school', name: 'Darwin Middle School', suburb: 'Stuart Park', state: 'NT' },
  { code: 'nightcliff-middle-school', name: 'Nightcliff Middle School', suburb: 'Nightcliff', state: 'NT' },
  { code: 'palmerston-college', name: 'Palmerston College', suburb: 'Palmerston', state: 'NT' },
  { code: 'taminmin-college', name: 'Taminmin College', suburb: 'Humpty Doo', state: 'NT' },
  { code: 'alice-springs-high', name: 'Alice Springs High School', suburb: 'Alice Springs', state: 'NT' },
  { code: 'centralian-senior-college', name: 'Centralian Senior College', suburb: 'Alice Springs', state: 'NT' },
  { code: 'katherine-high', name: 'Katherine High School', suburb: 'Katherine', state: 'NT' },
  { code: 'nhulunbuy-high', name: 'Nhulunbuy High School', suburb: 'Nhulunbuy', state: 'NT' },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log('Starting CareerIgnite school seed...\n');

  // ---- Step 1: Clean existing school data ----
  console.log('Deleting existing school data...');
  await prisma.schoolInsight.deleteMany();
  console.log('  - SchoolInsight records deleted');
  await prisma.school.deleteMany();
  console.log('  - School records deleted');
  console.log('Existing school data cleared.\n');

  // ---- Step 2: Create demo schools with nested insights ----
  console.log(`Seeding ${schools.length} demo schools with insights...\n`);

  for (const school of schools) {
    const careerCounts = CAREER_POOLS[school.careerPoolIndex][0];

    const created = await prisma.school.create({
      data: {
        code: school.code,
        name: school.name,
        suburb: school.suburb,
        state: school.state,
        insights: {
          create: {
            period: '2026-03',
            interestCounts: school.interestCounts,
            careerCounts: careerCounts,
            subjectCounts: school.subjectCounts,
            atarAvg: school.atarAvg,
            studentCount: school.studentCount,
          },
        },
      },
      include: {
        insights: true,
      },
    });

    const idx = schools.indexOf(school) + 1;
    console.log(
      `  [${idx}/${schools.length}] ${created.name} (${created.state}) — ` +
      `${created.insights.length} insight(s), ${school.studentCount} students, ` +
      `ATAR avg ${school.atarAvg}`,
    );
  }

  // ---- Step 3: Create additional schools (no insights) ----
  console.log(`\nSeeding ${additionalSchools.length} additional schools (no insights)...\n`);

  const additionalData = additionalSchools.map((s) => ({
    code: s.code,
    name: s.name,
    suburb: s.suburb,
    state: s.state,
  }));

  const result = await prisma.school.createMany({
    data: additionalData,
    skipDuplicates: true,
  });

  console.log(`  Created ${result.count} additional school records.`);

  // ---- Step 4: Summary ----
  const schoolCount = await prisma.school.count();
  const insightCount = await prisma.schoolInsight.count();
  console.log(`\nSeed complete!`);
  console.log(`  Total schools:  ${schoolCount}`);
  console.log(`  Total insights: ${insightCount}`);
}

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------

main()
  .then(() => {
    console.log('\nSchool seed finished successfully.');
  })
  .catch((e) => {
    console.error('School seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
