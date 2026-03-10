import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// State-specific subject mappings (same as seed.ts)
const STATE_SUBJECTS: Record<string, Record<string, string>> = {
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
    music: 'Music 1',
    design: 'Design and Technology',
    foodTech: 'Food Technology',
    hospitality: 'Hospitality',
    retail: 'Retail Services',
    construction: 'Construction',
    automotive: 'Automotive',
    engineering: 'Engineering Studies',
    drama: 'Drama',
    textiles: 'Textiles and Design'
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
    music: 'Music Performance',
    design: 'Product Design and Technology',
    foodTech: 'Food Studies',
    hospitality: 'VET Hospitality',
    retail: 'VET Business',
    construction: 'VET Building and Construction',
    automotive: 'VET Automotive',
    engineering: 'Systems Engineering',
    drama: 'Drama',
    textiles: 'VET Fashion Design'
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
    music: 'Music',
    design: 'Design',
    foodTech: 'Food and Nutrition',
    hospitality: 'Hospitality Practices',
    retail: 'Business Studies',
    construction: 'Building and Construction Skills',
    automotive: 'Automotive Technology',
    engineering: 'Engineering',
    drama: 'Drama',
    textiles: 'Fashion'
  },
};

// Institution lookups
const UNI_INSTITUTIONS: Record<string, string[]> = {
  NSW: ['University of Sydney', 'UNSW Sydney', 'University of Technology Sydney', 'Macquarie University', 'Western Sydney University'],
  VIC: ['University of Melbourne', 'Monash University', 'RMIT University', 'Deakin University', 'Swinburne University of Technology'],
  QLD: ['University of Queensland', 'Queensland University of Technology', 'Griffith University', 'James Cook University'],
};

const TAFE_INSTITUTIONS: Record<string, string[]> = {
  NSW: ['TAFE NSW Sydney', 'TAFE NSW Western Sydney', 'TAFE NSW Northern Sydney'],
  VIC: ['Melbourne Polytechnic', 'Holmesglen Institute', 'Box Hill Institute', 'William Angliss Institute'],
  QLD: ['TAFE Queensland Brisbane', 'TAFE Queensland Gold Coast', 'TAFE Queensland Sunshine Coast'],
};

interface ExpandedCareer {
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
  challenges: { pros: string[]; cons: string[] };
  pathways: {
    state: string;
    pathwayType: string;
    subjects: string[];
    rankTarget: number | null;
    institutions: string[];
    duration: string;
    entryRequirements: string | null;
  }[];
}

const expandedCareers: ExpandedCareer[] = [
  // ========================================
  // CREATIVE (4 careers)
  // ========================================
  {
    title: 'Musician / Music Producer',
    slug: 'musician-music-producer',
    description: 'Create, perform, and produce music across genres from pop to classical. Work in studios, perform live, or produce tracks for artists, films, and games. Blend creativity with technical audio engineering skills.',
    image: '/images/careers/musician.png',
    dayInLife: 'Your day might start in a recording studio mixing vocals for an upcoming artist, tweaking EQ levels and layering harmonies until the track sounds perfect. After lunch, you rehearse with your band for an upcoming gig, running through setlists and perfecting your performance. In the evening, you compose a new beat on your laptop, experimenting with synths and samples until inspiration strikes.',
    progression: [
      { level: 'Session Musician / Junior Producer', years: '0-3 years', salary: '$45K-$60K', description: 'Play backup for artists, work on small production projects, build your portfolio and industry connections', color: '#22c55e' },
      { level: 'Professional Musician / Producer', years: '3-7 years', salary: '$60K-$90K', description: 'Release your own music or produce for established artists, perform regularly, develop a signature sound', color: '#3b82f6' },
      { level: 'Established Artist / Senior Producer', years: '7-12 years', salary: '$90K-$150K', description: 'Tour nationally or internationally, produce albums, earn royalties, mentor emerging talent', color: '#8b5cf6' },
      { level: 'Industry Leader / Multi-Platinum Producer', years: '12+ years', salary: '$150K-$500K+', description: 'Win awards, run your own label or studio, collaborate with top artists worldwide, shape music trends', color: '#eab308' },
    ],
    impact: 'Your music brings joy, comfort, and inspiration to millions of listeners around the world. You shape culture, give voice to emotions people struggle to express, and create soundtracks to people\'s lives. Through production work, you help other artists realize their creative visions and contribute to Australia\'s vibrant music scene.',
    salaryLow: 45000,
    salaryHigh: 500000,
    growthRate: 8.5,
    skills: ['Music Theory', 'Audio Engineering', 'Instrument Proficiency', 'Digital Audio Workstations (DAWs)', 'Performance Skills', 'Collaboration'],
    category: 'CREATIVE',
    challenges: {
      pros: [
        'Express yourself creatively and share your art with the world',
        'Work on diverse projects across multiple genres and styles',
        'Flexible schedule and potential to work from anywhere',
        'Build a passionate fanbase and connect with audiences emotionally'
      ],
      cons: [
        'Income can be unpredictable, especially early in your career',
        'Highly competitive industry with many talented artists',
        'Late nights and irregular hours for gigs and studio sessions',
        'Constant need to market yourself and stay relevant in trends'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.music, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.mediaArts],
        rankTarget: 70,
        institutions: ['Sydney Conservatorium of Music', 'Australian Institute of Music', 'University of Sydney'],
        duration: '3-4 years',
        entryRequirements: 'Audition required, portfolio of compositions or performances'
      },
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.music, STATE_SUBJECTS.NSW.english],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'JMC Academy'],
        duration: '1-2 years',
        entryRequirements: 'Portfolio or audition, demonstrated musical ability'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.music, STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.mediaArts],
        rankTarget: 68,
        institutions: ['Melbourne Conservatorium of Music', 'Monash University', 'RMIT University'],
        duration: '3-4 years',
        entryRequirements: 'Audition and interview, portfolio of work'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.music, STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.mediaArts],
        rankTarget: 65,
        institutions: ['Queensland Conservatorium Griffith University', 'Queensland University of Technology'],
        duration: '3-4 years',
        entryRequirements: 'Audition required, music theory test'
      },
    ]
  },
  {
    title: 'Animator / 3D Artist',
    slug: 'animator-3d-artist',
    description: 'Bring characters and worlds to life through animation and 3D modeling. Work on films, TV shows, video games, and advertising, creating everything from realistic visual effects to stylized cartoon characters.',
    image: '/images/careers/animator.png',
    dayInLife: 'You start by reviewing feedback on yesterday\'s animation reel, adjusting a character\'s walk cycle to make it feel more natural and expressive. Mid-morning, you sculpt a new creature design in ZBrush, adding intricate details to scales and textures. After lunch, you attend a team meeting to discuss the art direction for an upcoming game level, then spend the afternoon rigging a character model so animators can pose it easily.',
    progression: [
      { level: 'Junior Animator / 3D Artist', years: '0-2 years', salary: '$50K-$65K', description: 'Work on simple animations, assist senior artists, learn industry-standard software and pipelines', color: '#22c55e' },
      { level: 'Animator / 3D Artist', years: '2-5 years', salary: '$65K-$85K', description: 'Own character animations or full 3D assets, specialize in areas like rigging or lighting', color: '#3b82f6' },
      { level: 'Senior Animator / Lead 3D Artist', years: '5-10 years', salary: '$85K-$120K', description: 'Lead animation sequences, mentor juniors, collaborate closely with directors and designers', color: '#8b5cf6' },
      { level: 'Animation Director / Art Director', years: '10+ years', salary: '$120K-$200K+', description: 'Oversee entire animation departments, define visual style for projects, work on AAA games or major films', color: '#eab308' },
    ],
    impact: 'Your work captivates audiences and brings stories to life in ways that would be impossible with live action alone. You create memorable characters that resonate with viewers for years, contribute to Australia\'s growing games and film industries, and push the boundaries of what\'s visually possible in digital media.',
    salaryLow: 50000,
    salaryHigh: 200000,
    growthRate: 12.3,
    skills: ['3D Modeling Software (Maya, Blender)', 'Character Animation', 'Texturing & Shading', 'Rigging', 'Storytelling', 'Attention to Detail'],
    category: 'CREATIVE',
    challenges: {
      pros: [
        'See your creative work come to life on screen in films and games',
        'Constantly learn new techniques and software in a rapidly evolving field',
        'Collaborate with talented artists, directors, and storytellers',
        'Growing industry in Australia with international opportunities'
      ],
      cons: [
        'Tight deadlines and crunch periods before project releases',
        'Repetitive tasks like rendering can be time-consuming',
        'Need to continuously update skills as software evolves',
        'Competitive job market, especially for entry-level positions'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.visualArts, STATE_SUBJECTS.NSW.digitalTech, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.mathsAdvanced],
        rankTarget: 75,
        institutions: ['University of Technology Sydney', 'UNSW Sydney', 'University of Sydney'],
        duration: '3 years',
        entryRequirements: 'Portfolio of artwork demonstrating artistic ability and creativity'
      },
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.visualArts, STATE_SUBJECTS.NSW.digitalTech],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Billy Blue College of Design'],
        duration: '2 years',
        entryRequirements: 'Portfolio of creative work'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.visualArts, STATE_SUBJECTS.VIC.digitalTech, STATE_SUBJECTS.VIC.english],
        rankTarget: 73,
        institutions: ['RMIT University', 'Swinburne University of Technology', 'Monash University'],
        duration: '3 years',
        entryRequirements: 'Portfolio and interview demonstrating artistic skills'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.visualArts, STATE_SUBJECTS.QLD.digitalTech, STATE_SUBJECTS.QLD.english],
        rankTarget: 70,
        institutions: ['Griffith University', 'Queensland University of Technology'],
        duration: '3 years',
        entryRequirements: 'Portfolio submission required'
      },
    ]
  },
  {
    title: 'Fashion Designer',
    slug: 'fashion-designer',
    description: 'Design clothing, accessories, and footwear that define trends and personal style. Sketch concepts, select fabrics, and oversee production from runway to retail. Work for fashion houses, launch your own label, or design for film and theatre.',
    image: '/images/careers/fashion-designer.png',
    dayInLife: 'Your morning begins sketching designs for next season\'s collection, drawing inspiration from art, architecture, and street style. You spend time selecting fabrics at a textile showroom, feeling textures and comparing color swatches. In the afternoon, you supervise a fitting with a model, pinning adjustments to a prototype dress and discussing pattern modifications with your seamstress.',
    progression: [
      { level: 'Assistant Designer / Pattern Maker', years: '0-3 years', salary: '$45K-$60K', description: 'Assist senior designers, create patterns, source materials, learn the production process', color: '#22c55e' },
      { level: 'Fashion Designer', years: '3-7 years', salary: '$60K-$90K', description: 'Design your own collections, manage production timelines, build relationships with manufacturers', color: '#3b82f6' },
      { level: 'Senior Designer / Creative Director', years: '7-12 years', salary: '$90K-$140K', description: 'Lead design teams, define brand aesthetic, present at fashion weeks, manage design budgets', color: '#8b5cf6' },
      { level: 'Head Designer / Fashion House Owner', years: '12+ years', salary: '$140K-$350K+', description: 'Run your own label or lead major fashion brands, influence global trends, mentor new designers', color: '#eab308' },
    ],
    impact: 'You shape how people express themselves through clothing and contribute to Australia\'s fashion identity on the world stage. Your designs boost confidence, celebrate diversity, and can even drive conversations about sustainability and ethical production. You create wearable art that becomes part of people\'s daily lives and special moments.',
    salaryLow: 45000,
    salaryHigh: 350000,
    growthRate: 6.8,
    skills: ['Sketching & Illustration', 'Pattern Making', 'Textile Knowledge', 'Sewing & Construction', 'Trend Forecasting', 'Business Acumen'],
    category: 'CREATIVE',
    challenges: {
      pros: [
        'Express your creative vision and see people wear your designs',
        'Attend glamorous fashion shows and industry events',
        'Constantly evolving industry with new trends and opportunities',
        'Potential to build a globally recognized brand'
      ],
      cons: [
        'Extremely competitive field with long hours before fashion shows',
        'Need to balance creativity with commercial viability and budgets',
        'Seasonal pressure to constantly produce fresh, innovative designs',
        'Managing production costs and finding ethical manufacturers can be challenging'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.visualArts, STATE_SUBJECTS.NSW.textiles, STATE_SUBJECTS.NSW.design, STATE_SUBJECTS.NSW.english],
        rankTarget: 72,
        institutions: ['University of Technology Sydney', 'UNSW Sydney', 'Western Sydney University'],
        duration: '3-4 years',
        entryRequirements: 'Portfolio showcasing design skills and creative thinking'
      },
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.textiles, STATE_SUBJECTS.NSW.design, STATE_SUBJECTS.NSW.visualArts],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Whitehouse Institute of Design'],
        duration: '2 years',
        entryRequirements: 'Portfolio of creative work and design concepts'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.visualArts, STATE_SUBJECTS.VIC.textiles, STATE_SUBJECTS.VIC.english],
        rankTarget: 70,
        institutions: ['RMIT University', 'Swinburne University of Technology'],
        duration: '3-4 years',
        entryRequirements: 'Portfolio and interview'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.visualArts, STATE_SUBJECTS.QLD.textiles, STATE_SUBJECTS.QLD.design],
        rankTarget: 68,
        institutions: ['Queensland University of Technology', 'Griffith University'],
        duration: '3 years',
        entryRequirements: 'Portfolio demonstrating design potential'
      },
    ]
  },
  {
    title: 'Interior Designer',
    slug: 'interior-designer',
    description: 'Transform spaces by combining aesthetics with functionality, designing beautiful and practical interiors for homes, offices, hotels, and public spaces. Select colors, materials, furniture, and lighting to create environments that enhance people\'s lives.',
    image: '/images/careers/interior-designer.png',
    dayInLife: 'You begin your day meeting with a client in their new apartment, measuring rooms and discussing their vision for a modern, minimalist aesthetic. Back at the studio, you create mood boards and 3D renderings of the space, selecting furniture pieces and color palettes. In the afternoon, you visit a showroom to source unique lighting fixtures and coordinate with contractors about installing custom cabinetry.',
    progression: [
      { level: 'Junior Interior Designer', years: '0-2 years', salary: '$48K-$62K', description: 'Assist on projects, create drawings and presentations, source materials, learn design software', color: '#22c55e' },
      { level: 'Interior Designer', years: '2-6 years', salary: '$62K-$85K', description: 'Manage your own residential or commercial projects, develop client relationships, oversee installations', color: '#3b82f6' },
      { level: 'Senior Designer / Design Manager', years: '6-10 years', salary: '$85K-$120K', description: 'Lead major projects, manage design teams, handle high-end clients and large-scale commercial work', color: '#8b5cf6' },
      { level: 'Principal Designer / Studio Owner', years: '10+ years', salary: '$120K-$250K+', description: 'Run your own design firm, work on prestigious projects, develop signature design style, mentor designers', color: '#eab308' },
    ],
    impact: 'You create spaces where people live their best lives, work productively, and feel truly at home. Your designs can improve mental health, boost creativity, and make spaces accessible for people with disabilities. You contribute to sustainable design practices and help shape the built environment of Australian cities and homes.',
    salaryLow: 48000,
    salaryHigh: 250000,
    growthRate: 9.2,
    skills: ['Space Planning', '3D Rendering Software (SketchUp, AutoCAD)', 'Color Theory', 'Client Communication', 'Project Management', 'Sustainability Knowledge'],
    category: 'CREATIVE',
    challenges: {
      pros: [
        'Transform spaces and see immediate, tangible results of your creativity',
        'Work on diverse projects from cozy homes to luxury hotels',
        'Build long-term relationships with satisfied clients',
        'Combine artistic vision with practical problem-solving'
      ],
      cons: [
        'Clients may have unrealistic expectations or difficult feedback',
        'Need to work within strict budgets and timelines',
        'Requires strong business skills for client management and contracts',
        'Coordinating with contractors and managing installations can be stressful'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.visualArts, STATE_SUBJECTS.NSW.design, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.english],
        rankTarget: 75,
        institutions: ['University of Technology Sydney', 'University of Sydney', 'UNSW Sydney'],
        duration: '3-4 years',
        entryRequirements: 'Portfolio demonstrating design skills and spatial awareness'
      },
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.design, STATE_SUBJECTS.NSW.visualArts],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Billy Blue College of Design'],
        duration: '2 years',
        entryRequirements: 'Portfolio and interview'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.visualArts, STATE_SUBJECTS.VIC.design, STATE_SUBJECTS.VIC.english],
        rankTarget: 73,
        institutions: ['RMIT University', 'Swinburne University of Technology', 'Monash University'],
        duration: '3-4 years',
        entryRequirements: 'Portfolio and interview demonstrating design thinking'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.visualArts, STATE_SUBJECTS.QLD.design, STATE_SUBJECTS.QLD.english],
        rankTarget: 70,
        institutions: ['Queensland University of Technology', 'Griffith University'],
        duration: '3 years',
        entryRequirements: 'Portfolio showing creative and technical ability'
      },
    ]
  },

  // ========================================
  // SPORTS (4 careers)
  // ========================================
  {
    title: 'Professional Athlete',
    slug: 'professional-athlete',
    description: 'Compete at the highest levels in sports like AFL, rugby, soccer, cricket, basketball, or Olympic events. Train intensively, represent teams or your country, and inspire fans through your athletic excellence and dedication.',
    image: '/images/careers/professional-athlete.png',
    dayInLife: 'Your day starts early with a gym session focused on strength and conditioning, followed by a nutritious breakfast planned by your team dietitian. Mid-morning brings skills training on the field with your teammates and coaches, analyzing video footage of opponents. After lunch and recovery time, you attend media commitments, then finish with a light training session and physiotherapy to keep your body in peak condition.',
    progression: [
      { level: 'Development Squad / Reserve Grade', years: '0-2 years', salary: '$30K-$60K', description: 'Train with professional teams, play in reserves or development leagues, prove yourself worthy of senior selection', color: '#22c55e' },
      { level: 'Professional Athlete', years: '2-6 years', salary: '$60K-$200K', description: 'Compete regularly at professional level, build your reputation, earn sponsorships and endorsements', color: '#3b82f6' },
      { level: 'Elite Athlete / Team Leader', years: '6-10 years', salary: '$200K-$800K', description: 'Become a key player, represent your country, captain teams, secure major sponsorship deals', color: '#8b5cf6' },
      { level: 'Veteran / Sports Icon', years: '10-15 years', salary: '$800K-$5M+', description: 'Achieve legendary status, win championships, transition to coaching or media, inspire the next generation', color: '#eab308' },
    ],
    impact: 'You inspire millions of Australians, especially young people who dream of following in your footsteps. Your performances unite communities and bring joy to fans. Through your platform, you can advocate for important causes, promote healthy lifestyles, and represent Australia on the world stage with pride.',
    salaryLow: 30000,
    salaryHigh: 5000000,
    growthRate: 7.5,
    skills: ['Athletic Excellence', 'Mental Resilience', 'Teamwork', 'Strategy & Tactics', 'Physical Conditioning', 'Media Management'],
    category: 'SPORTS',
    challenges: {
      pros: [
        'Do what you love for a living and get paid to play your sport',
        'Experience the thrill of competition and the glory of victory',
        'Travel the world and build lifelong friendships with teammates',
        'Inspire young athletes and become a role model in your community'
      ],
      cons: [
        'Career-ending injuries are a constant risk',
        'Intense pressure and public scrutiny from fans and media',
        'Career span is typically short (10-15 years at most)',
        'Sacrifices in personal life due to rigorous training schedules'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'SPORTS',
        subjects: [STATE_SUBJECTS.NSW.healthPE, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.business],
        rankTarget: null,
        institutions: ['NSW Institute of Sport', 'Australian Institute of Sport', 'Elite Sports Academies'],
        duration: '3-6 years development',
        entryRequirements: 'Elite athletic ability, selection by scouts, trial performance'
      },
      {
        state: 'VIC',
        pathwayType: 'SPORTS',
        subjects: [STATE_SUBJECTS.VIC.healthPE, STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.business],
        rankTarget: null,
        institutions: ['Victorian Institute of Sport', 'Australian Institute of Sport', 'AFL/Cricket/Basketball Academies'],
        duration: '3-6 years development',
        entryRequirements: 'Exceptional sporting talent, academy selection, proven track record'
      },
      {
        state: 'QLD',
        pathwayType: 'SPORTS',
        subjects: [STATE_SUBJECTS.QLD.healthPE, STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.business],
        rankTarget: null,
        institutions: ['Queensland Academy of Sport', 'Australian Institute of Sport', 'NRL/Cricket/Olympic Academies'],
        duration: '3-6 years development',
        entryRequirements: 'Elite performance in junior competitions, scouting identification'
      },
    ]
  },
  {
    title: 'Personal Trainer / Fitness Coach',
    slug: 'personal-trainer',
    description: 'Help people achieve their fitness and health goals through personalized training programs, nutritional guidance, and motivation. Work in gyms, run your own business, or specialize in areas like strength training, weight loss, or sports performance.',
    image: '/images/careers/personal-trainer.png',
    dayInLife: 'You kick off the day with a 6am session helping a client master deadlift form, celebrating as they hit a new personal record. Between sessions, you design a customized workout plan for a new client recovering from injury. Your afternoon is packed with back-to-back training sessions, from HIIT classes to one-on-one strength training, and you finish by posting workout tips on social media to engage your growing online following.',
    progression: [
      { level: 'Gym Instructor / Trainee PT', years: '0-2 years', salary: '$45K-$55K', description: 'Work gym floor, build client base, gain certifications, learn business basics of fitness industry', color: '#22c55e' },
      { level: 'Personal Trainer', years: '2-5 years', salary: '$55K-$80K', description: 'Maintain steady client roster, develop specializations, potentially work independently or at premium gyms', color: '#3b82f6' },
      { level: 'Senior Trainer / Specialist Coach', years: '5-10 years', salary: '$80K-$120K', description: 'Build reputation in niche area, train high-profile clients, potentially run group programs or bootcamps', color: '#8b5cf6' },
      { level: 'Gym Owner / Fitness Entrepreneur', years: '10+ years', salary: '$120K-$250K+', description: 'Own your gym or fitness studio, create online programs, mentor other trainers, build a fitness brand', color: '#eab308' },
    ],
    impact: 'You transform lives by helping people overcome health challenges, build confidence, and achieve goals they once thought impossible. Your guidance prevents chronic diseases, improves mental health, and creates ripple effects as your clients inspire their families. You contribute to a healthier Australia, one person at a time.',
    salaryLow: 45000,
    salaryHigh: 250000,
    growthRate: 11.8,
    skills: ['Exercise Physiology', 'Motivational Coaching', 'Program Design', 'Nutrition Basics', 'First Aid & Safety', 'Business Management'],
    category: 'SPORTS',
    challenges: {
      pros: [
        'Make a real difference in people\'s health and wellbeing',
        'Flexible hours and ability to work independently',
        'Stay fit and healthy while earning money',
        'Build meaningful relationships with clients who trust you'
      ],
      cons: [
        'Early mornings and late evenings to accommodate client schedules',
        'Income can be inconsistent, especially when starting out',
        'Physically demanding work that can lead to burnout',
        'Need to constantly market yourself and retain clients'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.healthPE, STATE_SUBJECTS.NSW.biology, STATE_SUBJECTS.NSW.business],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Australian Institute of Fitness', 'Fitness Industry Training'],
        duration: '6 months - 1 year',
        entryRequirements: 'Certificate III in Fitness, First Aid certification'
      },
      {
        state: 'VIC',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.VIC.healthPE, STATE_SUBJECTS.VIC.biology, STATE_SUBJECTS.VIC.business],
        rankTarget: null,
        institutions: ['Victoria University', 'Australian Institute of Fitness', 'Holmesglen Institute'],
        duration: '6 months - 1 year',
        entryRequirements: 'Certificate III and IV in Fitness'
      },
      {
        state: 'QLD',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.QLD.healthPE, STATE_SUBJECTS.QLD.biology, STATE_SUBJECTS.QLD.business],
        rankTarget: null,
        institutions: ['TAFE Queensland Brisbane', 'Australian Institute of Fitness', 'Fitcollege'],
        duration: '6 months - 1 year',
        entryRequirements: 'Certificate III in Fitness minimum, CPR certification'
      },
    ]
  },
  {
    title: 'Sports Coach',
    slug: 'sports-coach',
    description: 'Develop athletes\' skills and guide teams to success in sports like AFL, netball, soccer, swimming, or tennis. Analyze performance, create training programs, and foster teamwork while nurturing talent from grassroots to elite levels.',
    image: '/images/careers/sports-coach.png',
    dayInLife: 'Your morning starts reviewing game footage from the weekend, identifying areas where your team can improve defensively. You run an afternoon training session, setting up drills that develop both skills and teamwork, offering individual feedback to players. In the evening, you plan next week\'s training schedule, communicate with parents, and attend a coaching clinic to learn the latest sports science techniques.',
    progression: [
      { level: 'Assistant Coach / Junior Development', years: '0-3 years', salary: '$35K-$55K', description: 'Help head coaches, run junior teams, gain coaching accreditations, learn sport tactics and psychology', color: '#22c55e' },
      { level: 'Head Coach / Development Coach', years: '3-7 years', salary: '$55K-$85K', description: 'Lead teams at club or school level, develop training programs, manage game-day strategies', color: '#3b82f6' },
      { level: 'Senior Coach / High Performance Coach', years: '7-12 years', salary: '$85K-$150K', description: 'Coach elite teams, work with state squads or professional clubs, mentor junior coaches', color: '#8b5cf6' },
      { level: 'Elite Coach / National Team Coach', years: '12+ years', salary: '$150K-$500K+', description: 'Lead professional teams or national squads, compete for championships, shape the future of the sport', color: '#eab308' },
    ],
    impact: 'You shape young athletes\' character, teaching them discipline, resilience, and teamwork that extends far beyond the playing field. Your guidance helps players reach their potential, creates pathways to professional careers, and builds stronger communities through sport. You inspire the next generation and leave a lasting legacy through the athletes you develop.',
    salaryLow: 35000,
    salaryHigh: 500000,
    growthRate: 8.9,
    skills: ['Sport-Specific Expertise', 'Leadership & Communication', 'Performance Analysis', 'Motivational Skills', 'Sports Psychology', 'Tactical Planning'],
    category: 'SPORTS',
    challenges: {
      pros: [
        'Share your passion for sport and watch athletes improve under your guidance',
        'Build strong connections with players and their families',
        'Experience the excitement of competition and team success',
        'Flexible pathway from community coaching to elite professional levels'
      ],
      cons: [
        'Weekends and evenings consumed by training and games',
        'Dealing with difficult parents or managing team politics',
        'Results-driven pressure can be stressful, especially at elite levels',
        'Lower pay at grassroots levels unless working full-time at elite clubs'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.healthPE, STATE_SUBJECTS.NSW.biology, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.business],
        rankTarget: 70,
        institutions: ['University of Sydney', 'University of Technology Sydney', 'Western Sydney University'],
        duration: '3 years',
        entryRequirements: 'Sport-specific coaching accreditations recommended'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.healthPE, STATE_SUBJECTS.VIC.biology, STATE_SUBJECTS.VIC.english],
        rankTarget: 68,
        institutions: ['Deakin University', 'Victoria University', 'La Trobe University'],
        duration: '3 years',
        entryRequirements: 'Coaching qualifications and playing experience valued'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.healthPE, STATE_SUBJECTS.QLD.biology, STATE_SUBJECTS.QLD.english],
        rankTarget: 67,
        institutions: ['University of Queensland', 'Queensland University of Technology', 'Griffith University'],
        duration: '3 years',
        entryRequirements: 'Sport coaching certifications beneficial'
      },
    ]
  },
  {
    title: 'Sports Journalist / Broadcaster',
    slug: 'sports-journalist',
    description: 'Cover sporting events, interview athletes, and bring sports stories to life through writing, broadcasting, or digital media. Work for newspapers, TV networks, podcasts, or online platforms, combining your passion for sports with journalism skills.',
    image: '/images/careers/sports-journalist.png',
    dayInLife: 'You spend your morning researching stats and preparing questions for an exclusive interview with a star AFL player. At the game, you\'re pitchside capturing the atmosphere, taking notes on key moments, and tweeting live updates. After the final siren, you rush to interview the winning coach, then return to write a compelling match report that captures the drama and emotion for tomorrow\'s publication.',
    progression: [
      { level: 'Junior Sports Reporter / Contributor', years: '0-2 years', salary: '$45K-$60K', description: 'Cover local sports, write match reports, assist senior journalists, build contacts in the industry', color: '#22c55e' },
      { level: 'Sports Journalist / Reporter', years: '2-6 years', salary: '$60K-$85K', description: 'Cover major sporting codes, conduct interviews, develop specialty areas, produce multimedia content', color: '#3b82f6' },
      { level: 'Senior Journalist / On-Air Presenter', years: '6-12 years', salary: '$85K-$140K', description: 'Break major stories, host radio/TV shows, become a recognized voice in sports media', color: '#8b5cf6' },
      { level: 'Chief Sports Writer / Broadcaster', years: '12+ years', salary: '$140K-$300K+', description: 'Lead sports coverage, anchor major broadcasts, write columns, become an industry authority', color: '#eab308' },
    ],
    impact: 'You bring sports stories to millions of fans, helping them connect with their favorite teams and athletes. Your reporting holds sporting organizations accountable, uncovers important stories, and celebrates the achievements of Australian athletes on the world stage. You shape public discourse about sports and inspire young people through compelling storytelling.',
    salaryLow: 45000,
    salaryHigh: 300000,
    growthRate: 5.2,
    skills: ['Writing & Storytelling', 'Broadcasting & Presentation', 'Sports Knowledge', 'Interview Techniques', 'Social Media', 'Deadline Management'],
    category: 'SPORTS',
    challenges: {
      pros: [
        'Attend major sporting events and access areas fans can\'t reach',
        'Interview sporting heroes and break exclusive stories',
        'Combine passion for sports with creative storytelling',
        'Build a public profile and become a trusted voice in sports'
      ],
      cons: [
        'Unpredictable hours including nights, weekends, and holidays',
        'Tight deadlines create constant pressure',
        'Competitive industry with many aspiring sports journalists',
        'Dealing with criticism from passionate fans on social media'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.healthPE, STATE_SUBJECTS.NSW.mediaArts, STATE_SUBJECTS.NSW.business],
        rankTarget: 75,
        institutions: ['University of Technology Sydney', 'University of Sydney', 'Macquarie University'],
        duration: '3 years',
        entryRequirements: 'Strong writing portfolio, demonstrated interest in sports journalism'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.healthPE, STATE_SUBJECTS.VIC.mediaArts],
        rankTarget: 73,
        institutions: ['RMIT University', 'Monash University', 'Deakin University'],
        duration: '3 years',
        entryRequirements: 'Writing samples and demonstrated passion for sports'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.healthPE, STATE_SUBJECTS.QLD.mediaArts],
        rankTarget: 72,
        institutions: ['University of Queensland', 'Queensland University of Technology'],
        duration: '3 years',
        entryRequirements: 'Portfolio of writing or broadcasting work'
      },
    ]
  },

  // ========================================
  // SERVICES (3 careers)
  // ========================================
  {
    title: 'Event Manager',
    slug: 'event-manager',
    description: 'Plan and execute memorable events from corporate conferences to music festivals, weddings to product launches. Coordinate venues, suppliers, entertainment, and logistics to create seamless experiences that exceed expectations.',
    image: '/images/careers/event-manager.png',
    dayInLife: 'Your morning involves a site visit for an upcoming corporate gala, checking lighting setup and catering arrangements with vendors. You return to the office to finalize the runsheet for a weekend wedding, coordinating with florists, DJs, and the venue manager. In the evening, you\'re on-site at a product launch, troubleshooting last-minute issues and ensuring everything runs smoothly while guests network and enjoy the experience.',
    progression: [
      { level: 'Event Coordinator / Assistant', years: '0-2 years', salary: '$45K-$58K', description: 'Support senior planners, manage event logistics, coordinate suppliers, learn event management systems', color: '#22c55e' },
      { level: 'Event Manager', years: '2-6 years', salary: '$58K-$85K', description: 'Plan and execute your own events, manage budgets, build supplier relationships, handle client expectations', color: '#3b82f6' },
      { level: 'Senior Event Manager / Producer', years: '6-10 years', salary: '$85K-$120K', description: 'Oversee large-scale events, manage teams, handle VIP clients, work on high-profile festivals or conferences', color: '#8b5cf6' },
      { level: 'Event Director / Agency Owner', years: '10+ years', salary: '$120K-$220K+', description: 'Run your own event company, secure major contracts, build industry reputation, mentor event professionals', color: '#eab308' },
    ],
    impact: 'You create moments that people remember for a lifetime, from dream weddings to career-defining conferences. Your work brings communities together, supports businesses in launching products, and contributes to Australia\'s vibrant events industry. You turn visions into reality and make special occasions truly unforgettable.',
    salaryLow: 45000,
    salaryHigh: 220000,
    growthRate: 10.4,
    skills: ['Project Management', 'Budget Management', 'Vendor Negotiation', 'Problem-Solving Under Pressure', 'Communication', 'Attention to Detail'],
    category: 'SERVICES',
    challenges: {
      pros: [
        'Every event is unique and creatively fulfilling',
        'Meet diverse people and work in exciting venues',
        'See immediate results and grateful clients',
        'Strong industry growth with opportunities in corporate and social events'
      ],
      cons: [
        'Long, irregular hours especially on event days and weekends',
        'High-stress environment when things go wrong',
        'Demanding clients with changing requirements',
        'Seasonal fluctuations in workload and income'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.business, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.hospitality],
        rankTarget: 70,
        institutions: ['University of Technology Sydney', 'Blue Mountains International Hotel Management School', 'Macquarie University'],
        duration: '3 years',
        entryRequirements: 'Strong organizational and communication skills'
      },
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.business, STATE_SUBJECTS.NSW.hospitality],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'William Angliss Institute'],
        duration: '1-2 years',
        entryRequirements: 'Demonstrated interest in event coordination'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.business, STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.hospitality],
        rankTarget: 68,
        institutions: ['RMIT University', 'Victoria University', 'Deakin University'],
        duration: '3 years',
        entryRequirements: 'Portfolio or experience in event volunteering valued'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.business, STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.hospitality],
        rankTarget: 67,
        institutions: ['Griffith University', 'University of Queensland'],
        duration: '3 years',
        entryRequirements: 'Demonstrated organizational ability'
      },
    ]
  },
  {
    title: 'Hairdresser / Barber',
    slug: 'hairdresser-barber',
    description: 'Create stunning hairstyles and boost clients\' confidence through cutting, coloring, styling, and grooming services. Work in salons, barbershops, or build your own mobile business, combining technical skill with customer service and creativity.',
    image: '/images/careers/hairdresser-barber.png',
    dayInLife: 'Your day begins consulting with a client about a dramatic color transformation, mixing custom shades to achieve the perfect blonde balayage. Between cuts and blow-dries, you chat with regulars who trust you with their look. In the afternoon, you create an intricate updo for a wedding client, securing each pin carefully, then finish the day perfecting fade techniques on your final client while discussing their weekend plans.',
    progression: [
      { level: 'Apprentice Hairdresser / Barber', years: '0-3 years', salary: '$30K-$45K', description: 'Learn foundational skills, assist senior stylists, practice techniques, complete Certificate III qualification', color: '#22c55e' },
      { level: 'Qualified Hairdresser / Barber', years: '3-7 years', salary: '$45K-$65K', description: 'Build your own client base, develop specializations in color or cutting, work independently', color: '#3b82f6' },
      { level: 'Senior Stylist / Master Barber', years: '7-12 years', salary: '$65K-$95K', description: 'Command higher prices, work in upscale salons, train apprentices, develop signature styles', color: '#8b5cf6' },
      { level: 'Salon Owner / Industry Educator', years: '12+ years', salary: '$95K-$180K+', description: 'Own your salon or franchise, compete in competitions, educate at beauty schools, create product lines', color: '#eab308' },
    ],
    impact: 'You help people feel confident and beautiful, making a tangible difference in how they present themselves to the world. Your skills create connections with clients who trust you with their appearance for years. You contribute to Australia\'s beauty industry and provide a welcoming space where people can relax and be themselves.',
    salaryLow: 30000,
    salaryHigh: 180000,
    growthRate: 7.3,
    skills: ['Cutting & Styling Techniques', 'Color Theory & Application', 'Customer Service', 'Trend Awareness', 'Product Knowledge', 'Business Management'],
    category: 'SERVICES',
    challenges: {
      pros: [
        'Creative expression through transforming people\'s appearance',
        'Build long-term relationships with loyal clients',
        'Flexible work options including salon employment or self-employment',
        'Constantly evolving trends keep the work interesting'
      ],
      cons: [
        'Physically demanding - standing all day can strain feet and back',
        'Exposure to chemicals may cause allergies or skin issues',
        'Irregular income when starting out or working on commission',
        'Weekend and evening work required when clients are available'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.visualArts, STATE_SUBJECTS.NSW.retail],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Private Hair & Beauty Academies', 'Salon-based Apprenticeships'],
        duration: '3 years',
        entryRequirements: 'Apprenticeship contract with a salon, Certificate III in Hairdressing'
      },
      {
        state: 'VIC',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.visualArts],
        rankTarget: null,
        institutions: ['William Angliss Institute', 'Melbourne Polytechnic', 'Salon Apprenticeships'],
        duration: '3 years',
        entryRequirements: 'Apprenticeship position, commitment to Certificate III training'
      },
      {
        state: 'QLD',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.visualArts],
        rankTarget: null,
        institutions: ['TAFE Queensland Brisbane', 'Private Training Colleges', 'Industry Apprenticeships'],
        duration: '3 years',
        entryRequirements: 'Salon apprenticeship, Certificate III in Hairdressing'
      },
    ]
  },
  {
    title: 'Tourism & Travel Agent',
    slug: 'tourism-travel-agent',
    description: 'Help people discover the world by planning unforgettable trips, booking flights, accommodations, and experiences. Specialize in adventure travel, luxury holidays, or corporate travel, turning travel dreams into reality through expert knowledge and service.',
    image: '/images/careers/tourism-travel-agent.png',
    dayInLife: 'Your morning starts researching boutique hotels in Bali for a honeymooning couple, comparing prices and amenities to find the perfect romantic getaway. You book complex international itineraries for a family traveling through Europe, coordinating trains, tours, and accommodations. In the afternoon, you attend a travel expo to learn about new destinations, then help a nervous first-time flyer understand their journey and put their mind at ease.',
    progression: [
      { level: 'Travel Consultant / Junior Agent', years: '0-2 years', salary: '$42K-$55K', description: 'Process bookings, learn reservation systems, build destination knowledge, develop customer service skills', color: '#22c55e' },
      { level: 'Travel Agent / Consultant', years: '2-6 years', salary: '$55K-$75K', description: 'Manage own client portfolio, specialize in destination or travel type, handle complex itineraries', color: '#3b82f6' },
      { level: 'Senior Travel Advisor / Specialist', years: '6-10 years', salary: '$75K-$100K', description: 'Become expert in niche markets (luxury, adventure, cruise), earn higher commissions, build loyal clientele', color: '#8b5cf6' },
      { level: 'Agency Owner / Travel Director', years: '10+ years', salary: '$100K-$180K+', description: 'Own travel agency, create group tours, develop supplier partnerships, mentor travel professionals', color: '#eab308' },
    ],
    impact: 'You create memories that last lifetimes, helping families reunite across continents and making bucket-list dreams come true. Your expertise saves travelers stress and money while supporting Australia\'s tourism industry. You introduce people to new cultures and experiences that broaden their perspectives and create stories they\'ll share forever.',
    salaryLow: 42000,
    salaryHigh: 180000,
    growthRate: 6.1,
    skills: ['Destination Knowledge', 'Booking Systems', 'Customer Service', 'Attention to Detail', 'Sales & Negotiation', 'Problem-Solving'],
    category: 'SERVICES',
    challenges: {
      pros: [
        'Learn about amazing destinations around the world',
        'Enjoy travel perks and familiarization trips to destinations',
        'Make people happy by planning dream vacations',
        'Flexible work options including working from home'
      ],
      cons: [
        'Online booking sites have reduced traditional agent roles',
        'Commission-based income can be unpredictable',
        'Dealing with travel disruptions and unhappy customers',
        'Need to constantly update knowledge as destinations and rules change'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.business, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.hospitality],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Travel Industry Training', 'Blue Mountains International Hotel Management School'],
        duration: '1-2 years',
        entryRequirements: 'Certificate III in Travel, strong geography and customer service skills'
      },
      {
        state: 'VIC',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.VIC.business, STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.hospitality],
        rankTarget: null,
        institutions: ['William Angliss Institute', 'Melbourne Polytechnic', 'Box Hill Institute'],
        duration: '1-2 years',
        entryRequirements: 'Certificate III in Travel and Tourism'
      },
      {
        state: 'QLD',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.QLD.business, STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.hospitality],
        rankTarget: null,
        institutions: ['TAFE Queensland Brisbane', 'TAFE Queensland Gold Coast'],
        duration: '1-2 years',
        entryRequirements: 'Certificate III in Travel and Tourism Operations'
      },
    ]
  },

  // ========================================
  // EDUCATION (2 careers)
  // ========================================
  {
    title: 'Early Childhood Educator',
    slug: 'early-childhood-educator',
    description: 'Nurture young children\'s development from birth to age 5 through play-based learning, social development, and early education. Work in childcare centers, preschools, or kindergartens, laying the foundation for lifelong learning.',
    image: '/images/careers/early-childhood-educator.png',
    dayInLife: 'Your morning begins welcoming excited toddlers and calming a few tearful goodbyes, helping each child settle into the day. You lead circle time with songs and stories, then facilitate play-based learning activities like building blocks and painting. After lunch and naptime, you guide outdoor play, document developmental milestones, and chat with parents at pickup about their child\'s achievements.',
    progression: [
      { level: 'Childcare Educator / Assistant', years: '0-2 years', salary: '$45K-$55K', description: 'Support room leaders, care for children, complete Certificate III, learn early childhood frameworks', color: '#22c55e' },
      { level: 'Qualified Educator / Room Leader', years: '2-6 years', salary: '$55K-$70K', description: 'Lead age groups, design learning programs, mentor assistants, complete Diploma or Bachelor degree', color: '#3b82f6' },
      { level: 'Educational Leader / Preschool Teacher', years: '6-10 years', salary: '$70K-$90K', description: 'Oversee educational programs, ensure regulatory compliance, support staff development', color: '#8b5cf6' },
      { level: 'Centre Director / Education Coordinator', years: '10+ years', salary: '$90K-$130K', description: 'Manage entire childcare centers, handle budgets and staffing, shape early learning policies', color: '#eab308' },
    ],
    impact: 'You shape the future by giving children the best possible start in life, building their confidence, social skills, and love of learning. Your work supports working families, contributes to children\'s emotional wellbeing, and identifies developmental needs early. You create safe, nurturing environments where Australia\'s youngest learners can thrive.',
    salaryLow: 45000,
    salaryHigh: 130000,
    growthRate: 9.7,
    skills: ['Child Development Knowledge', 'Patience & Empathy', 'Communication with Children & Parents', 'Activity Planning', 'Behavior Management', 'First Aid & Safety'],
    category: 'EDUCATION',
    challenges: {
      pros: [
        'Incredibly rewarding to watch children learn and grow',
        'Build special bonds with children and their families',
        'Strong job demand with growing government investment',
        'Every day is different and filled with laughter and play'
      ],
      cons: [
        'Emotionally and physically demanding work with young children',
        'Relatively lower pay compared to other education sectors',
        'High staff-to-child ratios can be stressful',
        'Paperwork and compliance requirements can be time-consuming'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.healthPE, STATE_SUBJECTS.NSW.visualArts],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Australian Institute of Higher Education', 'Community colleges'],
        duration: '1-2 years (Diploma), 3-4 years (Bachelor)',
        entryRequirements: 'Working With Children Check, Certificate III minimum'
      },
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.healthPE, STATE_SUBJECTS.NSW.visualArts],
        rankTarget: 65,
        institutions: ['Macquarie University', 'Western Sydney University', 'Australian Catholic University'],
        duration: '3-4 years',
        entryRequirements: 'Working With Children Check, commitment to child development'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.healthPE],
        rankTarget: 63,
        institutions: ['Monash University', 'Deakin University', 'Australian Catholic University'],
        duration: '3-4 years',
        entryRequirements: 'Working With Children Check'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.healthPE],
        rankTarget: 62,
        institutions: ['Queensland University of Technology', 'Griffith University', 'Australian Catholic University'],
        duration: '4 years',
        entryRequirements: 'Blue Card (Working With Children), passion for early learning'
      },
    ]
  },
  {
    title: 'School Counsellor',
    slug: 'school-counsellor',
    description: 'Support students\' mental health, wellbeing, and personal development in primary and secondary schools. Provide counseling, crisis intervention, and guidance on academic, social, and emotional challenges to help students thrive.',
    image: '/images/careers/school-counsellor.png',
    dayInLife: 'Your morning involves one-on-one sessions with students dealing with anxiety, friendship issues, and family challenges, creating safe spaces for them to express their feelings. You consult with teachers about a student showing signs of distress, developing intervention strategies together. In the afternoon, you run a group session on stress management for Year 12 students and meet with parents to discuss support plans for their child.',
    progression: [
      { level: 'Graduate Counsellor / Intern', years: '0-2 years', salary: '$65K-$75K', description: 'Complete supervised practice, build counseling skills, learn school systems and student needs', color: '#22c55e' },
      { level: 'School Counsellor', years: '2-6 years', salary: '$75K-$95K', description: 'Manage caseload independently, develop programs, work with diverse student needs and crises', color: '#3b82f6' },
      { level: 'Senior School Counsellor', years: '6-12 years', salary: '$95K-$115K', description: 'Lead wellbeing initiatives, supervise junior counsellors, liaise with external mental health services', color: '#8b5cf6' },
      { level: 'Head of Student Wellbeing / Consultant', years: '12+ years', salary: '$115K-$150K', description: 'Shape school-wide wellbeing policies, work across multiple schools, train teachers, consult on best practices', color: '#eab308' },
    ],
    impact: 'You change lives by helping young people navigate their most challenging years, preventing crises and building resilience that lasts a lifetime. Your intervention can be the difference between a student dropping out or graduating, struggling or thriving. You contribute to reducing youth mental health issues and creating supportive school cultures across Australia.',
    salaryLow: 65000,
    salaryHigh: 150000,
    growthRate: 11.5,
    skills: ['Counseling Techniques', 'Active Listening', 'Crisis Intervention', 'Adolescent Psychology', 'Confidentiality & Ethics', 'Collaboration with Teachers & Parents'],
    category: 'EDUCATION',
    challenges: {
      pros: [
        'Make profound impact on young people during formative years',
        'School holidays and steady government employment',
        'Growing recognition of importance of student mental health',
        'Diverse work helping students with varied challenges'
      ],
      cons: [
        'Emotionally heavy work dealing with trauma and crisis situations',
        'High demand with limited counsellors per school',
        'Confidentiality can be isolating when you can\'t discuss cases',
        'Requires extensive postgraduate study in psychology or counseling'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.healthPE, STATE_SUBJECTS.NSW.biology, STATE_SUBJECTS.NSW.mathsAdvanced],
        rankTarget: 80,
        institutions: ['University of Sydney', 'UNSW Sydney', 'University of Technology Sydney', 'Western Sydney University'],
        duration: '4-6 years (Bachelor + Masters)',
        entryRequirements: 'Undergraduate psychology degree, Masters in Educational Psychology or Counseling required'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.healthPE, STATE_SUBJECTS.VIC.biology, STATE_SUBJECTS.VIC.mathsAdvanced],
        rankTarget: 78,
        institutions: ['University of Melbourne', 'Monash University', 'Deakin University'],
        duration: '4-6 years (Bachelor + Masters)',
        entryRequirements: 'Psychology honors or Masters in Educational or Counseling Psychology'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.healthPE, STATE_SUBJECTS.QLD.biology, STATE_SUBJECTS.QLD.mathsAdvanced],
        rankTarget: 77,
        institutions: ['University of Queensland', 'Queensland University of Technology', 'Griffith University'],
        duration: '4-6 years (Bachelor + Masters)',
        entryRequirements: 'Accredited postgraduate qualification in school counseling or educational psychology'
      },
    ]
  },

  // ========================================
  // BUSINESS (3 careers)
  // ========================================
  {
    title: 'Entrepreneur / Startup Founder',
    slug: 'entrepreneur-startup-founder',
    description: 'Build and grow your own business from the ground up, solving problems with innovative products or services. Take calculated risks, secure funding, and lead teams to turn your vision into a successful, scalable company.',
    image: '/images/careers/entrepreneur-startup-founder.png',
    dayInLife: 'Your day starts with a pitch meeting with potential investors, confidently presenting your business model and growth projections. You return to your coworking space to collaborate with your small team on product development, making critical decisions about features and timelines. In the evening, you analyze customer feedback data, adjust your marketing strategy, and respond to emails from mentors and advisors.',
    progression: [
      { level: 'Solopreneur / Early Founder', years: '0-2 years', salary: '$0-$50K', description: 'Validate your idea, build MVP (minimum viable product), seek initial customers and funding, wear all hats', color: '#22c55e' },
      { level: 'Startup Founder / Small Business Owner', years: '2-5 years', salary: '$50K-$100K', description: 'Scale operations, hire first employees, establish product-market fit, manage cash flow', color: '#3b82f6' },
      { level: 'Growth-Stage Founder / CEO', years: '5-10 years', salary: '$100K-$250K', description: 'Secure major funding rounds, expand team and market reach, develop leadership skills, build company culture', color: '#8b5cf6' },
      { level: 'Serial Entrepreneur / Venture Partner', years: '10+ years', salary: '$250K-$5M+', description: 'Exit successfully or scale to major enterprise, invest in other startups, mentor founders, shape industries', color: '#eab308' },
    ],
    impact: 'You create jobs, drive innovation, and solve real problems that improve people\'s lives. Your success inspires others to pursue their own entrepreneurial dreams and contributes to Australia\'s dynamic startup ecosystem. Whether you build a local business or a global company, you shape the future and leave a lasting legacy.',
    salaryLow: 0,
    salaryHigh: 5000000,
    growthRate: 13.2,
    skills: ['Business Strategy', 'Leadership', 'Financial Management', 'Sales & Marketing', 'Resilience', 'Problem-Solving'],
    category: 'BUSINESS',
    challenges: {
      pros: [
        'Complete autonomy to build something you\'re passionate about',
        'Unlimited earning potential if your business succeeds',
        'Create your own culture and work on your own terms',
        'Opportunity to make meaningful impact and solve important problems'
      ],
      cons: [
        'High risk of failure, especially in early years',
        'Unpredictable income and financial stress',
        'Extremely long hours and work-life balance challenges',
        'Constant pressure and responsibility for employees and investors'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.business, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.digitalTech],
        rankTarget: 75,
        institutions: ['UNSW Sydney', 'University of Sydney', 'University of Technology Sydney', 'Macquarie University'],
        duration: '3-4 years (Business or relevant field)',
        entryRequirements: 'No formal requirements, but business education helps; passion and drive essential'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.business, STATE_SUBJECTS.VIC.mathsAdvanced, STATE_SUBJECTS.VIC.english],
        rankTarget: 73,
        institutions: ['University of Melbourne', 'Monash University', 'RMIT University', 'Swinburne University'],
        duration: '3-4 years',
        entryRequirements: 'Formal education optional; many successful entrepreneurs are self-taught'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.business, STATE_SUBJECTS.QLD.mathsAdvanced, STATE_SUBJECTS.QLD.english],
        rankTarget: 72,
        institutions: ['University of Queensland', 'Queensland University of Technology', 'Griffith University'],
        duration: '3-4 years',
        entryRequirements: 'Entrepreneurial mindset more important than specific credentials'
      },
    ]
  },
  {
    title: 'Real Estate Agent',
    slug: 'real-estate-agent',
    description: 'Help people buy, sell, and rent properties by marketing homes, conducting inspections, negotiating deals, and guiding clients through one of the biggest financial decisions of their lives. Build a portfolio of listings and earn commission on successful sales.',
    image: '/images/careers/realestate-agent.png',
    dayInLife: 'Your morning starts with a property appraisal, walking through a client\'s home and advising on market value and presentation. You rush to set up an open house, ensuring the property looks perfect and greeting prospective buyers with enthusiasm. The afternoon involves negotiating between a buyer and seller to close a deal, followed by social media marketing for new listings and networking at a local business event.',
    progression: [
      { level: 'Sales Assistant / Trainee Agent', years: '0-2 years', salary: '$40K-$55K', description: 'Support senior agents, learn property law, complete licensing, attend opens, build local knowledge', color: '#22c55e' },
      { level: 'Real Estate Agent', years: '2-5 years', salary: '$55K-$90K', description: 'Manage own listings, conduct sales, build client database, develop negotiation skills', color: '#3b82f6' },
      { level: 'Senior Agent / Sales Specialist', years: '5-10 years', salary: '$90K-$180K', description: 'Handle premium properties, lead sales team, establish reputation in local market, earn higher commissions', color: '#8b5cf6' },
      { level: 'Principal / Agency Owner', years: '10+ years', salary: '$180K-$500K+', description: 'Own real estate agency, manage multiple agents, build brand, earn commissions across team sales', color: '#eab308' },
    ],
    impact: 'You help families find their dream homes and assist investors in building wealth through property. Your guidance through complex transactions reduces stress during major life transitions. You contribute to Australia\'s property market, connect communities with homes, and help people achieve financial goals through real estate.',
    salaryLow: 40000,
    salaryHigh: 500000,
    growthRate: 8.1,
    skills: ['Sales & Negotiation', 'Market Knowledge', 'Communication', 'Property Law Understanding', 'Marketing & Social Media', 'Networking'],
    category: 'BUSINESS',
    challenges: {
      pros: [
        'High earning potential through commission-based structure',
        'Flexible schedule and independence in managing your business',
        'Help people achieve dreams of homeownership',
        'Dynamic work with every property and client being unique'
      ],
      cons: [
        'Income is unpredictable and commission-dependent',
        'Weekend and evening work required for opens and inspections',
        'High-pressure sales environment with targets to meet',
        'Market downturns directly impact earnings'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.business, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.mathsAdvanced],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Real Estate Training Institute', 'Private RTO providers'],
        duration: '6 months - 1 year',
        entryRequirements: 'Certificate of Registration (complete CPD course), Class 2 license required'
      },
      {
        state: 'VIC',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.VIC.business, STATE_SUBJECTS.VIC.english],
        rankTarget: null,
        institutions: ['REIV Training', 'Box Hill Institute', 'Holmesglen Institute'],
        duration: '6 months - 1 year',
        entryRequirements: 'Agent\'s Representative Course, Victorian registration required'
      },
      {
        state: 'QLD',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.QLD.business, STATE_SUBJECTS.QLD.english],
        rankTarget: null,
        institutions: ['TAFE Queensland Brisbane', 'REIQ Training', 'Private training providers'],
        duration: '6 months - 1 year',
        entryRequirements: 'Certificate of Registration, complete CPD requirements'
      },
    ]
  },
  {
    title: 'Financial Planner',
    slug: 'financial-planner',
    description: 'Guide individuals and families toward financial security by creating personalized strategies for saving, investing, retirement, and wealth management. Analyze clients\' financial situations and provide expert advice to help them achieve their money goals.',
    image: '/images/careers/financial-planner.png',
    dayInLife: 'Your morning begins reviewing a couple\'s finances to create a retirement plan that ensures they can travel the world comfortably. You meet with a young professional to discuss investment options, explaining the benefits of diversification and compound interest. In the afternoon, you analyze market trends, update client portfolios, and prepare a comprehensive financial plan presentation complete with projections and recommendations.',
    progression: [
      { level: 'Financial Planning Assistant / Paraplanner', years: '0-2 years', salary: '$50K-$65K', description: 'Support senior planners, research investments, prepare reports, study for professional certifications', color: '#22c55e' },
      { level: 'Financial Planner / Advisor', years: '2-6 years', salary: '$65K-$100K', description: 'Manage own client base, create financial plans, provide investment advice, build professional reputation', color: '#3b82f6' },
      { level: 'Senior Financial Planner / Wealth Manager', years: '6-12 years', salary: '$100K-$180K', description: 'Handle high-net-worth clients, specialize in complex strategies, mentor junior planners', color: '#8b5cf6' },
      { level: 'Principal Advisor / Practice Owner', years: '12+ years', salary: '$180K-$400K+', description: 'Own financial planning practice, manage team of advisors, build extensive client portfolio', color: '#eab308' },
    ],
    impact: 'You empower people to achieve financial freedom, retire comfortably, and build generational wealth. Your advice helps families afford education, buy homes, and weather financial storms with confidence. You reduce financial stress and anxiety, contributing to better mental health and quality of life for your clients across Australia.',
    salaryLow: 50000,
    salaryHigh: 400000,
    growthRate: 10.8,
    skills: ['Financial Analysis', 'Investment Knowledge', 'Tax & Superannuation Law', 'Client Relationship Management', 'Ethical Judgment', 'Communication'],
    category: 'BUSINESS',
    challenges: {
      pros: [
        'Genuinely help people achieve financial security and life goals',
        'Intellectually stimulating work requiring continuous learning',
        'Strong earning potential, especially with experience',
        'Build long-term relationships with grateful clients'
      ],
      cons: [
        'Extensive study and ongoing professional development required',
        'Strict regulatory requirements and compliance obligations',
        'Market volatility can stress clients (and you)',
        'Building initial client base takes time and networking'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.business, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.english],
        rankTarget: 80,
        institutions: ['Macquarie University', 'University of Sydney', 'UNSW Sydney', 'University of Technology Sydney'],
        duration: '3-4 years',
        entryRequirements: 'Approved degree + Professional Year, RG146 compliance, pass FASEA exam'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.business, STATE_SUBJECTS.VIC.mathsAdvanced, STATE_SUBJECTS.VIC.english],
        rankTarget: 78,
        institutions: ['Monash University', 'Deakin University', 'RMIT University'],
        duration: '3-4 years',
        entryRequirements: 'FASEA-approved qualification, professional year, ongoing CPD'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.business, STATE_SUBJECTS.QLD.mathsAdvanced, STATE_SUBJECTS.QLD.english],
        rankTarget: 77,
        institutions: ['University of Queensland', 'Queensland University of Technology', 'Griffith University'],
        duration: '3-4 years',
        entryRequirements: 'Approved tertiary qualification, complete professional year'
      },
    ]
  },

  // ========================================
  // TECHNOLOGY (2 careers)
  // ========================================
  {
    title: 'Game Developer',
    slug: 'game-developer',
    description: 'Create immersive video games for consoles, PC, mobile, and VR by programming gameplay systems, designing levels, and bringing interactive worlds to life. Combine coding skills with creativity to build entertainment experiences played by millions.',
    image: '/images/careers/game-developer.png',
    dayInLife: 'Your morning involves coding a new combat system in Unity, testing animations and hit detection to ensure fights feel satisfying and responsive. During a team standup, you discuss progress on the latest build with artists and designers. In the afternoon, you debug a tricky physics issue in a racing game, optimize performance for mobile devices, and playtest a new level to ensure it\'s challenging but fair.',
    progression: [
      { level: 'Junior Game Developer', years: '0-2 years', salary: '$55K-$70K', description: 'Fix bugs, implement basic features, learn game engines (Unity/Unreal), work under senior developers', color: '#22c55e' },
      { level: 'Game Developer / Programmer', years: '2-5 years', salary: '$70K-$100K', description: 'Own gameplay systems, specialize in areas like AI or graphics, collaborate across disciplines', color: '#3b82f6' },
      { level: 'Senior Game Developer / Lead Programmer', years: '5-10 years', salary: '$100K-$140K', description: 'Architect game systems, mentor juniors, make technical decisions, optimize performance', color: '#8b5cf6' },
      { level: 'Technical Director / Studio Founder', years: '10+ years', salary: '$140K-$250K+', description: 'Lead engineering teams on AAA games, start indie studios, shape industry technology standards', color: '#eab308' },
    ],
    impact: 'You create entertainment that brings joy and connection to millions of players worldwide. Your work pushes technological boundaries, tells compelling stories, and creates communities around shared gaming experiences. You contribute to Australia\'s growing games industry and inspire the next generation of developers through your creative vision.',
    salaryLow: 55000,
    salaryHigh: 250000,
    growthRate: 14.7,
    skills: ['Programming (C++, C#)', 'Game Engines (Unity, Unreal)', 'Mathematics & Physics', 'Problem-Solving', 'Teamwork', 'Passion for Games'],
    category: 'TECHNOLOGY',
    challenges: {
      pros: [
        'Work on creative projects you\'re passionate about',
        'See millions of people enjoy games you helped create',
        'Constantly evolving field with new technology and platforms',
        'Collaborative environment with talented artists and designers'
      ],
      cons: [
        'Crunch periods before release deadlines can mean 60+ hour weeks',
        'Job security can be uncertain at smaller studios',
        'Projects can be cancelled, losing months or years of work',
        'Competitive industry requiring continuous skill development'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.digitalTech, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.physics, STATE_SUBJECTS.NSW.english],
        rankTarget: 80,
        institutions: ['University of Technology Sydney', 'UNSW Sydney', 'University of Sydney'],
        duration: '3-4 years',
        entryRequirements: 'Portfolio of game projects (mods, jam games, personal projects) highly valued'
      },
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.digitalTech, STATE_SUBJECTS.NSW.mathsAdvanced],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'AIE (Academy of Interactive Entertainment)'],
        duration: '2 years',
        entryRequirements: 'Portfolio demonstrating programming or game design skills'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.digitalTech, STATE_SUBJECTS.VIC.mathsAdvanced, STATE_SUBJECTS.VIC.physics],
        rankTarget: 78,
        institutions: ['RMIT University', 'Swinburne University of Technology', 'Deakin University'],
        duration: '3-4 years',
        entryRequirements: 'Strong programming foundation, portfolio of game projects'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.digitalTech, STATE_SUBJECTS.QLD.mathsAdvanced, STATE_SUBJECTS.QLD.physics],
        rankTarget: 77,
        institutions: ['Queensland University of Technology', 'Griffith University'],
        duration: '3-4 years',
        entryRequirements: 'Programming skills and passion for game development'
      },
    ]
  },
  {
    title: 'UX/UI Designer',
    slug: 'ux-ui-designer',
    description: 'Design intuitive, beautiful digital experiences for websites and apps by researching user behavior, creating wireframes, and crafting visual interfaces. Bridge the gap between user needs and business goals through thoughtful, user-centered design.',
    image: '/images/careers/ux-ui-designer.png',
    dayInLife: 'Your morning begins analyzing user testing data to understand why people are struggling with a checkout flow, identifying friction points. You sketch wireframes for a redesigned navigation system, then create high-fidelity mockups in Figma with refined color palettes and typography. In the afternoon, you present design concepts to stakeholders, incorporating feedback, and collaborate with developers to ensure your vision is implemented correctly.',
    progression: [
      { level: 'Junior UX/UI Designer', years: '0-2 years', salary: '$55K-$70K', description: 'Create mockups and prototypes, assist senior designers, learn design systems and user research methods', color: '#22c55e' },
      { level: 'UX/UI Designer', years: '2-5 years', salary: '$70K-$100K', description: 'Own design projects end-to-end, conduct user research, create design systems, work independently', color: '#3b82f6' },
      { level: 'Senior UX/UI Designer / Design Lead', years: '5-10 years', salary: '$100K-$140K', description: 'Lead major projects, mentor junior designers, define design strategy, collaborate with product teams', color: '#8b5cf6' },
      { level: 'Design Director / Head of Design', years: '10+ years', salary: '$140K-$220K+', description: 'Oversee design teams, shape company-wide design language, work on strategic product decisions', color: '#eab308' },
    ],
    impact: 'You make technology accessible and delightful for everyone, reducing frustration and improving daily digital interactions for millions of users. Your designs can increase business revenue, improve accessibility for people with disabilities, and set new standards for how people interact with technology. You contribute to Australia\'s thriving tech and startup ecosystem.',
    salaryLow: 55000,
    salaryHigh: 220000,
    growthRate: 13.9,
    skills: ['User Research', 'Wireframing & Prototyping', 'Visual Design', 'Design Tools (Figma, Sketch, Adobe XD)', 'Empathy & User Psychology', 'Collaboration'],
    category: 'TECHNOLOGY',
    challenges: {
      pros: [
        'Direct impact on how millions of people experience digital products',
        'Blend creativity with problem-solving and data',
        'High demand across industries from startups to enterprises',
        'Remote work opportunities and flexible arrangements'
      ],
      cons: [
        'Balancing user needs with business constraints and technical limitations',
        'Designs can be rejected or changed based on stakeholder opinions',
        'Keeping up with constantly evolving design trends and tools',
        'Proving ROI of design decisions can be challenging'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.visualArts, STATE_SUBJECTS.NSW.digitalTech, STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.design],
        rankTarget: 75,
        institutions: ['University of Technology Sydney', 'UNSW Sydney', 'University of Sydney'],
        duration: '3 years',
        entryRequirements: 'Portfolio demonstrating design thinking and visual skills'
      },
      {
        state: 'NSW',
        pathwayType: 'TAFE',
        subjects: [STATE_SUBJECTS.NSW.visualArts, STATE_SUBJECTS.NSW.digitalTech, STATE_SUBJECTS.NSW.design],
        rankTarget: null,
        institutions: ['Billy Blue College of Design', 'Shillington Design School', 'General Assembly'],
        duration: '6 months - 2 years',
        entryRequirements: 'Portfolio of design work or bootcamp completion'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.visualArts, STATE_SUBJECTS.VIC.digitalTech, STATE_SUBJECTS.VIC.english],
        rankTarget: 73,
        institutions: ['RMIT University', 'Swinburne University of Technology', 'Monash University'],
        duration: '3 years',
        entryRequirements: 'Portfolio showcasing design process and thinking'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.visualArts, STATE_SUBJECTS.QLD.digitalTech, STATE_SUBJECTS.QLD.english],
        rankTarget: 72,
        institutions: ['Queensland University of Technology', 'Griffith University'],
        duration: '3 years',
        entryRequirements: 'Portfolio demonstrating UX thinking and visual design'
      },
    ]
  },

  // ========================================
  // HEALTH (2 careers)
  // ========================================
  {
    title: 'Dentist',
    slug: 'dentist',
    description: 'Promote oral health and treat dental issues ranging from routine cleanings to complex procedures like root canals and cosmetic dentistry. Run your own practice or work in clinics, hospitals, or community health, helping patients maintain healthy smiles.',
    image: '/images/careers/dentist.png',
    dayInLife: 'Your morning starts with routine check-ups and cleanings, examining patients\' teeth and advising on proper brushing techniques. Mid-morning, you perform a filling on a patient with a cavity, carefully numbing the area and restoring the tooth. After lunch, you complete a cosmetic consultation for teeth whitening, then handle an emergency appointment for a patient with severe tooth pain, diagnosing the issue and providing immediate relief.',
    progression: [
      { level: 'Graduate Dentist / Associate', years: '0-3 years', salary: '$75K-$100K', description: 'Work under supervision, build clinical skills, complete further training, establish patient rapport', color: '#22c55e' },
      { level: 'General Dentist', years: '3-8 years', salary: '$100K-$160K', description: 'Practice independently, manage diverse cases, potentially buy into practice, develop specializations', color: '#3b82f6' },
      { level: 'Senior Dentist / Specialist', years: '8-15 years', salary: '$160K-$250K', description: 'Specialize in orthodontics, periodontics, or surgery, mentor junior dentists, handle complex cases', color: '#8b5cf6' },
      { level: 'Practice Owner / Clinical Director', years: '15+ years', salary: '$250K-$500K+', description: 'Own dental practice, employ other dentists, shape community dental health, teach at universities', color: '#eab308' },
    ],
    impact: 'You improve people\'s confidence and quality of life by maintaining their oral health and creating beautiful smiles. Your preventative care reduces serious health issues linked to dental problems, and you provide pain relief for those in distress. You contribute to public health education and make dental care accessible across Australian communities.',
    salaryLow: 75000,
    salaryHigh: 500000,
    growthRate: 9.3,
    skills: ['Clinical Dentistry', 'Hand-Eye Coordination', 'Patient Communication', 'Attention to Detail', 'Problem Diagnosis', 'Business Management'],
    category: 'HEALTH',
    challenges: {
      pros: [
        'High earning potential and job security',
        'Make immediate, visible difference in patients\' health and confidence',
        'Flexible work options including owning your own practice',
        'Respected profession with strong community standing'
      ],
      cons: [
        'Expensive and lengthy education (6+ years)',
        'Repetitive strain injuries from precise, detailed work',
        'Anxious patients can make procedures challenging',
        'High startup costs for owning a practice'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.chemistry, STATE_SUBJECTS.NSW.biology, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.physics, STATE_SUBJECTS.NSW.english],
        rankTarget: 95,
        institutions: ['University of Sydney', 'University of Technology Sydney', 'Western Sydney University'],
        duration: '5-6 years',
        entryRequirements: 'Extremely high ATAR, interview, UCAT score, strong science background'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.chemistry, STATE_SUBJECTS.VIC.biology, STATE_SUBJECTS.VIC.mathsAdvanced, STATE_SUBJECTS.VIC.physics],
        rankTarget: 94,
        institutions: ['University of Melbourne', 'La Trobe University', 'Deakin University'],
        duration: '5-6 years',
        entryRequirements: 'High ATAR, UCAT, interview demonstrating aptitude and empathy'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.chemistry, STATE_SUBJECTS.QLD.biology, STATE_SUBJECTS.QLD.mathsAdvanced, STATE_SUBJECTS.QLD.physics],
        rankTarget: 93,
        institutions: ['University of Queensland', 'Griffith University', 'James Cook University'],
        duration: '5-6 years',
        entryRequirements: 'High academic achievement, UCAT, commitment to healthcare'
      },
    ]
  },
  {
    title: 'Psychologist',
    slug: 'psychologist',
    description: 'Help people overcome mental health challenges, develop coping strategies, and improve their wellbeing through evidence-based therapies and assessments. Specialize in areas like clinical, educational, or organizational psychology to support diverse populations.',
    image: '/images/careers/psychologist.png',
    dayInLife: 'Your morning involves therapy sessions with clients dealing with anxiety and depression, using cognitive behavioral techniques to help them challenge negative thought patterns. You conduct a psychological assessment for a child with learning difficulties, writing a detailed report with recommendations. In the afternoon, you facilitate a group therapy session for teens, creating a safe space for them to share experiences and build coping skills.',
    progression: [
      { level: 'Provisional Psychologist', years: '0-2 years', salary: '$60K-$75K', description: 'Complete supervised practice, work toward full registration, develop therapeutic skills under mentorship', color: '#22c55e' },
      { level: 'Registered Psychologist', years: '2-6 years', salary: '$75K-$100K', description: 'Practice independently, build caseload, choose specialization area, provide therapy and assessments', color: '#3b82f6' },
      { level: 'Senior Psychologist / Clinical Psychologist', years: '6-12 years', salary: '$100K-$140K', description: 'Handle complex cases, supervise provisional psychologists, specialize further, work in clinical settings', color: '#8b5cf6' },
      { level: 'Principal Psychologist / Practice Owner', years: '12+ years', salary: '$140K-$220K+', description: 'Own private practice, lead psychology teams, contribute to research, train next generation of psychologists', color: '#eab308' },
    ],
    impact: 'You transform lives by helping people overcome trauma, manage mental illness, and build resilience for lifelong wellbeing. Your work reduces suicide rates, improves relationships, and helps children thrive despite challenges. You contribute to reducing the stigma around mental health and make therapy accessible across Australia.',
    salaryLow: 60000,
    salaryHigh: 220000,
    growthRate: 12.6,
    skills: ['Active Listening', 'Empathy & Compassion', 'Evidence-Based Therapy Techniques', 'Assessment & Diagnosis', 'Cultural Sensitivity', 'Ethical Practice'],
    category: 'HEALTH',
    challenges: {
      pros: [
        'Profoundly meaningful work helping people heal and grow',
        'Diverse career paths from private practice to research',
        'Growing demand and recognition of mental health importance',
        'Intellectually stimulating with continuous learning'
      ],
      cons: [
        'Emotionally draining hearing traumatic stories daily',
        'Lengthy education pathway (6-8 years minimum)',
        'Risk of burnout without proper self-care',
        'Medicare rebate limitations can affect private practice income'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.english, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.biology, STATE_SUBJECTS.NSW.healthPE],
        rankTarget: 85,
        institutions: ['University of Sydney', 'UNSW Sydney', 'Macquarie University', 'University of Technology Sydney'],
        duration: '6 years (3 year Bachelor + 2 year Masters + 1 year registrar)',
        entryRequirements: 'APAC-accredited sequence, honors or postgraduate qualification required'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.english, STATE_SUBJECTS.VIC.mathsAdvanced, STATE_SUBJECTS.VIC.biology],
        rankTarget: 83,
        institutions: ['University of Melbourne', 'Monash University', 'Deakin University', 'La Trobe University'],
        duration: '6 years minimum',
        entryRequirements: 'APAC-accredited program, strong academic record, supervised practice'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.english, STATE_SUBJECTS.QLD.mathsAdvanced, STATE_SUBJECTS.QLD.biology],
        rankTarget: 82,
        institutions: ['University of Queensland', 'Queensland University of Technology', 'Griffith University'],
        duration: '6 years',
        entryRequirements: 'Four-year APAC-accredited sequence plus registration program'
      },
    ]
  },

  // ========================================
  // TRADES (2 careers)
  // ========================================
  {
    title: 'Mechanic (Automotive)',
    slug: 'automotive-mechanic',
    description: 'Diagnose, repair, and maintain vehicles from everyday cars to high-performance machines. Use technical knowledge and hands-on skills to keep Australia\'s vehicles running safely and efficiently, working in workshops, dealerships, or running your own garage.',
    image: '/images/careers/mechanic.png',
    dayInLife: 'Your morning begins diagnosing a check engine light on a customer\'s sedan, hooking up diagnostic equipment and tracing the issue to a faulty oxygen sensor. You perform a major service on a 4WD, changing oil, rotating tires, and checking brake pads for wear. In the afternoon, you tackle a more complex job - replacing a timing belt on a European car, carefully following torque specifications and ensuring everything is perfectly aligned.',
    progression: [
      { level: 'Apprentice Mechanic', years: '0-4 years', salary: '$35K-$50K', description: 'Learn fundamentals, assist qualified mechanics, study at TAFE, complete Certificate III', color: '#22c55e' },
      { level: 'Qualified Mechanic', years: '4-8 years', salary: '$50K-$75K', description: 'Work independently on repairs and services, specialize in particular vehicle types or systems', color: '#3b82f6' },
      { level: 'Senior Mechanic / Diagnostic Technician', years: '8-15 years', salary: '$75K-$100K', description: 'Handle complex diagnostics, mentor apprentices, work on high-performance or specialized vehicles', color: '#8b5cf6' },
      { level: 'Workshop Manager / Business Owner', years: '15+ years', salary: '$100K-$180K+', description: 'Own repair shop, manage team of mechanics, build reputation for quality service, expand business', color: '#eab308' },
    ],
    impact: 'You keep Australians safe on the roads by ensuring vehicles are mechanically sound and reliable. Your work prevents breakdowns that could leave families stranded and catches safety issues before they cause accidents. You support independent mobility for communities, especially in regional areas where reliable transport is essential.',
    salaryLow: 35000,
    salaryHigh: 180000,
    growthRate: 6.7,
    skills: ['Diagnostic Problem-Solving', 'Technical Mechanical Knowledge', 'Tool Proficiency', 'Attention to Detail', 'Customer Service', 'Continuous Learning (new vehicle tech)'],
    category: 'TRADES',
    challenges: {
      pros: [
        'Hands-on, practical work with immediate tangible results',
        'Strong job security - vehicles always need maintenance',
        'Pathway from apprenticeship to business ownership',
        'Satisfying problem-solving and variety in daily work'
      ],
      cons: [
        'Physically demanding work in sometimes uncomfortable conditions',
        'Exposure to chemicals, grease, and loud noise',
        'Keeping up with rapidly evolving vehicle technology (EVs, hybrids)',
        'Lower apprenticeship wages during training period'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.NSW.engineering, STATE_SUBJECTS.NSW.automotive, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.physics],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Automotive Trade Schools', 'Dealership Apprenticeships'],
        duration: '4 years',
        entryRequirements: 'Apprenticeship contract, Certificate III in Light Vehicle Mechanical Technology'
      },
      {
        state: 'VIC',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.VIC.engineering, STATE_SUBJECTS.VIC.automotive, STATE_SUBJECTS.VIC.mathsAdvanced],
        rankTarget: null,
        institutions: ['Kangan Institute', 'Holmesglen Institute', 'Automotive Employers'],
        duration: '4 years',
        entryRequirements: 'Apprenticeship agreement, Certificate III qualification'
      },
      {
        state: 'QLD',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.QLD.engineering, STATE_SUBJECTS.QLD.automotive, STATE_SUBJECTS.QLD.mathsAdvanced],
        rankTarget: null,
        institutions: ['TAFE Queensland Brisbane', 'Automotive Training Centres', 'Industry Apprenticeships'],
        duration: '4 years',
        entryRequirements: 'Apprenticeship contract, Certificate III in Light Vehicle Mechanical Technology'
      },
    ]
  },
  {
    title: 'Welder / Boilermaker',
    slug: 'welder-boilermaker',
    description: 'Join and fabricate metal structures using specialized welding techniques for construction, manufacturing, mining, and infrastructure projects. Create everything from building frameworks to pressure vessels, working in workshops or on-site across diverse industries.',
    image: '/images/careers/welder-boilermaker.png',
    dayInLife: 'Your day starts preparing steel beams for a commercial building project, measuring and marking cut lines precisely before firing up the oxy-acetylene torch. You spend the morning performing MIG welds on structural steel, ensuring each bead is smooth and strong, your helmet protecting you from the bright arc. In the afternoon, you work on-site at a mining facility, repairing a damaged conveyor system and testing welds for quality and safety compliance.',
    progression: [
      { level: 'Apprentice Welder / Boilermaker', years: '0-4 years', salary: '$40K-$60K', description: 'Learn welding techniques, practice on different metals, study metallurgy, complete Certificate III', color: '#22c55e' },
      { level: 'Qualified Welder / Boilermaker', years: '4-8 years', salary: '$60K-$90K', description: 'Work independently on projects, pass trade tests, specialize in TIG/MIG/arc welding or fabrication', color: '#3b82f6' },
      { level: 'Senior Welder / Specialist Fabricator', years: '8-15 years', salary: '$90K-$130K', description: 'Handle complex specialized projects, supervise teams, work in high-paying sectors like mining or oil/gas', color: '#8b5cf6' },
      { level: 'Workshop Supervisor / Business Owner', years: '15+ years', salary: '$130K-$200K+', description: 'Manage fabrication workshops, own metalwork business, consult on major infrastructure projects', color: '#eab308' },
    ],
    impact: 'You build the infrastructure that powers Australia - bridges, buildings, pipelines, and industrial facilities that communities depend on. Your precision ensures structures are safe and durable for decades. You contribute to major projects that shape cities and support industries like mining that drive the economy.',
    salaryLow: 40000,
    salaryHigh: 200000,
    growthRate: 8.8,
    skills: ['Welding Techniques (MIG, TIG, Arc, Oxy)', 'Blueprint Reading', 'Metallurgy Knowledge', 'Precision & Quality Control', 'Safety Compliance', 'Physical Stamina'],
    category: 'TRADES',
    challenges: {
      pros: [
        'High earning potential, especially in mining and remote work',
        'Satisfaction of creating permanent structures with your hands',
        'Strong demand across construction, manufacturing, and mining',
        'Opportunities for travel to remote sites with accommodation provided'
      ],
      cons: [
        'Physically demanding and sometimes dangerous work',
        'Exposure to heat, fumes, bright light, and loud noise',
        'FIFO (fly-in-fly-out) work can mean extended time away from home',
        'Need to continuously certify skills and pass weld tests'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.NSW.engineering, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.physics],
        rankTarget: null,
        institutions: ['TAFE NSW Sydney', 'Hunter TAFE', 'Manufacturing Skills Australia'],
        duration: '4 years',
        entryRequirements: 'Apprenticeship contract, Certificate III in Engineering - Fabrication Trade'
      },
      {
        state: 'VIC',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.VIC.engineering, STATE_SUBJECTS.VIC.mathsAdvanced, STATE_SUBJECTS.VIC.physics],
        rankTarget: null,
        institutions: ['Kangan Institute', 'Holmesglen Institute', 'Chisholm Institute'],
        duration: '4 years',
        entryRequirements: 'Apprenticeship, Certificate III in Engineering - Fabrication or Boilermaking'
      },
      {
        state: 'QLD',
        pathwayType: 'APPRENTICESHIP',
        subjects: [STATE_SUBJECTS.QLD.engineering, STATE_SUBJECTS.QLD.mathsAdvanced, STATE_SUBJECTS.QLD.physics],
        rankTarget: null,
        institutions: ['TAFE Queensland Brisbane', 'Gold Coast TAFE', 'Trade Training Centres'],
        duration: '4 years',
        entryRequirements: 'Apprenticeship contract, Certificate III in Engineering - Fabrication Trade'
      },
    ]
  },

  // ========================================
  // SCIENCE (2 careers)
  // ========================================
  {
    title: 'Environmental Scientist',
    slug: 'environmental-scientist',
    description: 'Study and protect the natural environment by researching ecosystems, assessing environmental impacts, and developing solutions to issues like pollution and climate change. Work for government, consulting firms, or conservation organizations to create a sustainable future.',
    image: '/images/careers/environmental-scientist.png',
    dayInLife: 'Your morning involves collecting water samples from a river to test for pollutants, carefully recording data about temperature, pH, and aquatic life observed. Back at the lab, you analyze soil samples from a proposed development site, writing a report on potential environmental impacts. In the afternoon, you present findings to a council meeting, recommending strategies to protect local wetlands while allowing sustainable development.',
    progression: [
      { level: 'Environmental Officer / Junior Scientist', years: '0-3 years', salary: '$55K-$70K', description: 'Conduct fieldwork and sampling, assist on projects, learn regulatory frameworks, complete data analysis', color: '#22c55e' },
      { level: 'Environmental Scientist / Consultant', years: '3-7 years', salary: '$70K-$95K', description: 'Lead environmental assessments, manage projects, liaise with stakeholders, prepare compliance reports', color: '#3b82f6' },
      { level: 'Senior Environmental Scientist', years: '7-12 years', salary: '$95K-$125K', description: 'Oversee major projects, specialize in areas like contamination or ecology, mentor junior scientists', color: '#8b5cf6' },
      { level: 'Principal Scientist / Environmental Manager', years: '12+ years', salary: '$125K-$180K+', description: 'Lead teams, shape environmental policy, work on large-scale conservation or remediation projects', color: '#eab308' },
    ],
    impact: 'You protect Australia\'s unique ecosystems and wildlife for future generations while balancing human needs and development. Your research informs policies that reduce pollution, conserve water, and combat climate change. You contribute to sustainability goals and help create a healthier planet through evidence-based science.',
    salaryLow: 55000,
    salaryHigh: 180000,
    growthRate: 10.9,
    skills: ['Environmental Analysis', 'Data Collection & Statistics', 'Report Writing', 'Field Research', 'Regulatory Knowledge', 'Problem-Solving'],
    category: 'SCIENCE',
    challenges: {
      pros: [
        'Make meaningful impact on protecting the environment',
        'Diverse work from fieldwork to lab analysis to policy',
        'Growing demand as sustainability becomes priority',
        'Opportunities to work on important conservation projects'
      ],
      cons: [
        'Fieldwork in challenging weather and remote locations',
        'Frustration when recommendations are ignored for economic reasons',
        'Competitive job market for entry-level positions',
        'Grant-dependent research can create job insecurity'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.biology, STATE_SUBJECTS.NSW.chemistry, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.english],
        rankTarget: 78,
        institutions: ['University of Sydney', 'UNSW Sydney', 'Macquarie University', 'University of Technology Sydney'],
        duration: '3-4 years',
        entryRequirements: 'Strong science background, passion for environmental issues'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.biology, STATE_SUBJECTS.VIC.chemistry, STATE_SUBJECTS.VIC.mathsAdvanced, STATE_SUBJECTS.VIC.english],
        rankTarget: 76,
        institutions: ['University of Melbourne', 'Monash University', 'RMIT University', 'Deakin University'],
        duration: '3-4 years',
        entryRequirements: 'Science prerequisites, demonstrated interest in environmental conservation'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.biology, STATE_SUBJECTS.QLD.chemistry, STATE_SUBJECTS.QLD.mathsAdvanced, STATE_SUBJECTS.QLD.english],
        rankTarget: 75,
        institutions: ['University of Queensland', 'Queensland University of Technology', 'Griffith University'],
        duration: '3-4 years',
        entryRequirements: 'Strong science foundation, environmental awareness'
      },
    ]
  },
  {
    title: 'Marine Biologist',
    slug: 'marine-biologist',
    description: 'Study ocean life and marine ecosystems through research, conservation, and education. Investigate everything from coral reefs to deep-sea creatures, working to protect marine environments and understand the mysteries beneath the waves.',
    image: '/images/careers/marine-biologist.png',
    dayInLife: 'Your day begins on a research vessel, diving to survey a coral reef and documenting fish species and coral health using underwater photography. Back on deck, you carefully tag sharks for migration tracking, collecting tissue samples for genetic analysis. In the lab, you examine plankton samples under microscopes and analyze data on ocean temperature changes, writing findings for a research paper on climate impact.',
    progression: [
      { level: 'Research Assistant / Field Technician', years: '0-3 years', salary: '$50K-$65K', description: 'Assist on research projects, collect samples, conduct surveys, learn marine survey techniques and species identification', color: '#22c55e' },
      { level: 'Marine Biologist / Scientist', years: '3-7 years', salary: '$65K-$90K', description: 'Lead research projects, publish papers, specialize in areas like fisheries or conservation, secure grants', color: '#3b82f6' },
      { level: 'Senior Marine Biologist / Project Leader', years: '7-12 years', salary: '$90K-$120K', description: 'Manage major research programs, supervise teams, advise on marine policy, work on conservation initiatives', color: '#8b5cf6' },
      { level: 'Principal Scientist / Research Director', years: '12+ years', salary: '$120K-$170K+', description: 'Lead research institutions, shape marine conservation policy, publish influential research, mentor next generation', color: '#eab308' },
    ],
    impact: 'You protect Australia\'s incredible marine biodiversity, from the Great Barrier Reef to unique deep-sea ecosystems. Your research informs sustainable fishing practices, marine park establishment, and climate change responses. You inspire public appreciation for ocean life and contribute to global understanding of marine ecosystems under threat.',
    salaryLow: 50000,
    salaryHigh: 170000,
    growthRate: 8.4,
    skills: ['Marine Ecology', 'Diving & Field Research', 'Data Analysis & Statistics', 'Species Identification', 'Scientific Writing', 'Conservation Planning'],
    category: 'SCIENCE',
    challenges: {
      pros: [
        'Work in stunning ocean environments and dive regularly',
        'Contribute to protecting endangered species and ecosystems',
        'Exciting discoveries and constantly evolving research',
        'Australia offers world-class marine research opportunities'
      ],
      cons: [
        'Highly competitive field with limited permanent positions',
        'Often contract-based work dependent on research grants',
        'Extensive travel and time away from home for field research',
        'Witnessing environmental damage like coral bleaching can be emotionally difficult'
      ]
    },
    pathways: [
      {
        state: 'NSW',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.NSW.biology, STATE_SUBJECTS.NSW.chemistry, STATE_SUBJECTS.NSW.mathsAdvanced, STATE_SUBJECTS.NSW.physics, STATE_SUBJECTS.NSW.english],
        rankTarget: 80,
        institutions: ['University of Sydney', 'UNSW Sydney', 'Macquarie University', 'University of Technology Sydney'],
        duration: '3 years (Bachelor), often 5-8 years including postgrad',
        entryRequirements: 'Strong biology background, diving certification beneficial, research experience valued'
      },
      {
        state: 'VIC',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.VIC.biology, STATE_SUBJECTS.VIC.chemistry, STATE_SUBJECTS.VIC.mathsAdvanced, STATE_SUBJECTS.VIC.english],
        rankTarget: 78,
        institutions: ['University of Melbourne', 'Monash University', 'Deakin University'],
        duration: '3-4 years Bachelor, postgraduate study recommended',
        entryRequirements: 'Excellent science grades, passion for marine conservation'
      },
      {
        state: 'QLD',
        pathwayType: 'UNIVERSITY',
        subjects: [STATE_SUBJECTS.QLD.biology, STATE_SUBJECTS.QLD.chemistry, STATE_SUBJECTS.QLD.mathsAdvanced, STATE_SUBJECTS.QLD.english],
        rankTarget: 77,
        institutions: ['University of Queensland', 'James Cook University', 'Griffith University'],
        duration: '3 years Bachelor, often requires postgraduate study',
        entryRequirements: 'Strong science background, proximity to Great Barrier Reef offers unique opportunities'
      },
    ]
  },
];

export async function seedExpandedCareers() {
  console.log(`\nSeeding ${expandedCareers.length} expanded careers...\n`);

  for (const career of expandedCareers) {
    const upserted = await prisma.career.upsert({
      where: { slug: career.slug },
      update: {
        title: career.title,
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
        challenges: career.challenges,
      },
      create: {
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
        challenges: career.challenges,
        pathways: {
          create: career.pathways.map((p) => ({
            state: p.state as any,
            pathwayType: p.pathwayType as any,
            subjects: p.subjects,
            rankTarget: p.rankTarget,
            institutions: p.institutions,
            duration: p.duration,
            entryRequirements: p.entryRequirements,
          })),
        },
      },
    });

    console.log(`  [${expandedCareers.indexOf(career) + 1}/${expandedCareers.length}] ${upserted.title}`);
  }

  console.log(`\nExpanded careers seed complete.`);
}
