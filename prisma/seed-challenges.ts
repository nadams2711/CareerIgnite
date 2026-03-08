import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const challenges: Record<string, { pros: string[]; cons: string[] }> = {
  accountant: {
    pros: [
      "Super stable career — every business needs someone who gets numbers",
      "Good pay that keeps growing the longer you stick with it",
      "Heaps of industries to work in, from sports to entertainment to tech",
      "You become the person everyone trusts with money decisions",
      "Clear career path from grad to partner if you want it",
    ],
    cons: [
      "Tax season is brutal — expect long hours and no social life for weeks",
      "The study grind is real (CA/CPA exams are no joke)",
      "Some of the day-to-day work is repetitive spreadsheet stuff",
      "People assume you're boring when you tell them what you do",
    ],
  },
  carpenter: {
    pros: [
      "You actually build real things with your hands — houses, furniture, structures",
      "No two days are the same, and you're not stuck in an office",
      "You can start earning good money without a uni degree",
      "Massive demand means solid job security across Australia",
      "Eventually you can run your own business and be your own boss",
    ],
    cons: [
      "Physically demanding — your body will feel it after years on the job",
      "Working outside in Aussie heat (or rain) is tough",
      "Early morning starts are non-negotiable",
      "Risk of injuries from tools and heavy materials",
    ],
  },
  "chef-commercial-cook": {
    pros: [
      "You turn food into art and get to be creative every single day",
      "You can work literally anywhere in the world — kitchens are universal",
      "Tasting amazing food is part of the job description",
      "The kitchen crew becomes like a second family",
      "You can eventually open your own restaurant or food business",
    ],
    cons: [
      "The hours are rough — nights, weekends, and holidays while your mates are out",
      "Kitchens are hot, fast-paced, and high-pressure (it's not like MasterChef)",
      "The pay is average until you work your way up or go out on your own",
      "Standing on your feet for 10+ hours wrecks your body over time",
    ],
  },
  "civil-engineer": {
    pros: [
      "You design bridges, roads, and buildings that last for generations",
      "Strong salaries right from your graduate year",
      "You can see the real-world impact of your work every time you drive past it",
      "Lots of variety — structural, environmental, transport, water engineering",
    ],
    cons: [
      "The uni degree is long and math-heavy (4 years minimum)",
      "Projects move slowly — you won't see results overnight",
      "Paperwork, regulations, and compliance take up more time than you'd expect",
      "Site visits can mean early starts and working in rough conditions",
    ],
  },
  "cybersecurity-analyst": {
    pros: [
      "You're basically a digital detective protecting people from hackers",
      "One of the fastest-growing fields — companies are desperate for talent",
      "Seriously good pay, even at entry level",
      "Remote work is super common in this field",
      "Every day is different because threats are always evolving",
    ],
    cons: [
      "When a breach happens, you're on call 24/7 until it's fixed — high stress",
      "You need to constantly upskill because threats change weekly",
      "Some of the monitoring work can be tedious and repetitive",
      "The pressure of knowing one mistake could cost a company millions",
    ],
  },
  "data-analyst": {
    pros: [
      "You find the stories hidden in numbers — it's like being a detective",
      "Every industry needs data people, so you can work in anything you're passionate about",
      "Great pay and growing demand across Australia",
      "Mix of creative thinking and logical problem-solving",
      "Flexible work setups — lots of remote and hybrid options",
    ],
    cons: [
      "Cleaning messy data is tedious and takes up more time than the fun analysis",
      "Non-tech people don't always understand or value what you do",
      "Staring at spreadsheets and dashboards all day can get draining",
      "You need to keep learning new tools and languages constantly",
    ],
  },
  electrician: {
    pros: [
      "One of the highest-paid trades in Australia with overtime on top",
      "You can earn while you learn through an apprenticeship — no uni debt",
      "Huge demand, especially with solar and EV charging taking off",
      "Every job is a different puzzle to solve",
      "Easy to start your own business once you're licensed",
    ],
    cons: [
      "Working with electricity is genuinely dangerous if you're not careful",
      "Crawling through roof spaces and under floors isn't glamorous",
      "Being on-call for emergencies means unpredictable hours",
      "The apprenticeship pay is pretty low for the first couple of years",
    ],
  },
  "film-media-producer": {
    pros: [
      "You bring stories to life — film, TV, online content, the lot",
      "No two projects are ever the same, so you'll never be bored",
      "You work with creative, passionate people all the time",
      "The Aussie film industry is growing and getting international attention",
    ],
    cons: [
      "Breaking in is tough — it's competitive and who-you-know matters a lot",
      "Income can be unpredictable, especially starting out with freelance gigs",
      "Crazy long hours on set, especially close to deadlines",
      "You might spend years on a project that never sees the light of day",
    ],
  },
  "graphic-designer": {
    pros: [
      "You get paid to be creative and make things look incredible",
      "Freelancing is totally viable — work for yourself on your own schedule",
      "Every business needs design, so there are heaps of opportunities",
      "You build a portfolio of work you can actually show off",
      "Great mix of art and technology",
    ],
    cons: [
      "Clients sometimes have zero taste and want you to 'make the logo bigger'",
      "Freelance income can be feast or famine until you build a client base",
      "AI design tools are changing the industry fast — you need to adapt",
      "Revisions on revisions on revisions can crush your creative spirit",
    ],
  },
  "marketing-manager": {
    pros: [
      "Perfect blend of creativity and strategy — you get to do both",
      "You can work in literally any industry that sells something (so, all of them)",
      "Great career progression with solid salaries at senior levels",
      "You're always on top of trends and culture — it's part of the job",
      "Lots of variety — campaigns, social media, events, data, branding",
    ],
    cons: [
      "Proving ROI on campaigns can be stressful when budgets are tight",
      "Social media never sleeps, and sometimes neither will you",
      "You need thick skin — not every campaign will land and people will let you know",
      "The pressure to go viral or hit targets can be intense",
    ],
  },
  paramedic: {
    pros: [
      "You literally save lives — doesn't get more meaningful than that",
      "Every shift is completely different and full of adrenaline",
      "Strong team bonds with your crew — paramedics are tight-knit",
      "Respected career with solid job security and good benefits",
      "You develop skills most people could never even imagine needing",
    ],
    cons: [
      "You'll see things that are really hard to unsee — trauma exposure is real",
      "Shift work messes with your sleep, social life, and health",
      "The emotional weight of losing patients stays with you",
      "Physically demanding — lifting, running, working in all conditions",
    ],
  },
  physiotherapist: {
    pros: [
      "You help people recover and get back to doing what they love",
      "Can work in sports, hospitals, aged care, private practice — heaps of choice",
      "Good work-life balance compared to a lot of health careers",
      "Hands-on job where you actually see your patients improve",
      "Option to run your own clinic and set your own hours",
    ],
    cons: [
      "The uni degree is long (4 years) and content-heavy",
      "Physically tiring — you're on your feet and using your hands all day",
      "Some patients don't do their exercises and then blame you for slow progress",
      "Private practice can be stressful with admin, billing, and business stuff",
    ],
  },
  plumber: {
    pros: [
      "One of the most in-demand trades — you'll always have work",
      "Earn while you learn with an apprenticeship, no uni debt needed",
      "Emergency call-out rates are seriously good money",
      "You solve real problems for people (no hot water = crisis mode for most)",
      "Freedom to run your own business pretty early in your career",
    ],
    cons: [
      "Let's be honest — you're dealing with pipes and sewage sometimes",
      "Physically tough work, especially in tight or underground spaces",
      "Emergency call-outs can mean working at 2am on a freezing night",
      "The apprenticeship years are low pay for hard work",
    ],
  },
  "primary-secondary-teacher": {
    pros: [
      "You genuinely shape young people's futures — massive impact",
      "School holidays are a legit perk (let's not pretend they're not)",
      "Every day is different — kids keep you on your toes",
      "Strong job security, especially in regional and shortage areas",
      "The 'aha moment' when a student finally gets it is unmatched",
    ],
    cons: [
      "The workload outside class hours is wild — planning, marking, reports",
      "Behaviour management can be exhausting and emotionally draining",
      "Pay doesn't always reflect the effort and responsibility involved",
      "Burnout rates are high — it's a career that takes a lot out of you",
    ],
  },
  "registered-nurse": {
    pros: [
      "You make a real difference in people's lives every single shift",
      "Jobs everywhere — hospitals, clinics, schools, remote communities, overseas",
      "Strong job security and demand that's only growing",
      "Heaps of specialisation options — emergency, mental health, midwifery, paediatrics",
      "Shift work means you can have weekdays off when everyone else is working",
    ],
    cons: [
      "12-hour shifts on your feet are physically and mentally exhausting",
      "Dealing with death and suffering takes a real emotional toll",
      "Night shifts and weekend work mess with your personal life",
      "Sometimes you're understaffed and overworked, which adds to the stress",
    ],
  },
  "software-developer": {
    pros: [
      "You can work from literally anywhere — home, cafe, beach",
      "Insane demand means great pay and job security",
      "You get to build things people actually use",
      "Creative problem-solving every day",
      "Tech companies have awesome perks",
    ],
    cons: [
      "Sitting at a screen all day gets tiring",
      "Technology changes fast — you never stop learning",
      "Debugging can be frustrating and time-consuming",
      "Imposter syndrome is real in tech",
    ],
  },
  "sports-scientist": {
    pros: [
      "You work with athletes and help them perform at their absolute best",
      "Perfect career if you're obsessed with sport and science",
      "Growing field with more teams and organisations hiring dedicated staff",
      "Mix of lab work, fieldwork, and hands-on testing keeps things interesting",
    ],
    cons: [
      "Jobs in elite sport are limited and super competitive to land",
      "Pay can be average unless you're working with top-tier teams",
      "Long hours during competition seasons, including weekends and travel",
      "You might need postgrad study to stand out in the job market",
    ],
  },
  veterinarian: {
    pros: [
      "You work with animals every day — the dream for animal lovers",
      "Highly respected profession with strong community trust",
      "Variety of work — pets, farm animals, wildlife, even zoo animals",
      "You can specialise in surgery, dentistry, or exotic animals",
      "Regional and rural vets are in massive demand right now",
    ],
    cons: [
      "The degree is one of the hardest to get into and takes 5-6 years",
      "Euthanasia is part of the job and it never really gets easier",
      "The pay-to-study-length ratio isn't great compared to human medicine",
      "Emotional burnout is a serious issue — vet mental health stats are sobering",
    ],
  },
};

async function main() {
  console.log("Seeding career challenges (pros & cons)...\n");

  for (const [slug, data] of Object.entries(challenges)) {
    try {
      await prisma.career.update({
        where: { slug },
        data: { challenges: data },
      });
      console.log(`Updated challenges for ${slug}`);
    } catch (error) {
      console.error(`Failed to update ${slug}:`, error);
    }
  }

  console.log("\nDone! All career challenges have been seeded.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
