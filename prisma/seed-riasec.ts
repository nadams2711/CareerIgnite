import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RiasecData = {
  slug: string;
  riasecCode: string;
  skillWeights: Record<string, number>;
  workValues: Record<string, number>;
};

const RIASEC_DATA: RiasecData[] = [
  // ── Original 18 careers ──
  {
    slug: 'software-developer',
    riasecCode: 'IC',
    skillWeights: { math: 0.8, writing: 0.3, creative: 0.4, tech: 1.0, people: 0.3, handson: 0.1 },
    workValues: { achievement: 0.8, independence: 0.7, recognition: 0.5, relationships: 0.4, stability: 0.7, worklife: 0.6 },
  },
  {
    slug: 'registered-nurse',
    riasecCode: 'SI',
    skillWeights: { math: 0.4, writing: 0.5, creative: 0.2, tech: 0.3, people: 1.0, handson: 0.7 },
    workValues: { achievement: 0.7, independence: 0.3, recognition: 0.4, relationships: 0.9, stability: 0.9, worklife: 0.4 },
  },
  {
    slug: 'electrician',
    riasecCode: 'RC',
    skillWeights: { math: 0.7, writing: 0.2, creative: 0.2, tech: 0.5, people: 0.3, handson: 1.0 },
    workValues: { achievement: 0.6, independence: 0.8, recognition: 0.4, relationships: 0.4, stability: 0.8, worklife: 0.5 },
  },
  {
    slug: 'graphic-designer',
    riasecCode: 'AI',
    skillWeights: { math: 0.2, writing: 0.5, creative: 1.0, tech: 0.7, people: 0.4, handson: 0.2 },
    workValues: { achievement: 0.7, independence: 0.8, recognition: 0.7, relationships: 0.5, stability: 0.4, worklife: 0.6 },
  },
  {
    slug: 'physiotherapist',
    riasecCode: 'SI',
    skillWeights: { math: 0.4, writing: 0.4, creative: 0.3, tech: 0.2, people: 0.9, handson: 0.8 },
    workValues: { achievement: 0.8, independence: 0.6, recognition: 0.5, relationships: 0.9, stability: 0.8, worklife: 0.6 },
  },
  {
    slug: 'carpenter',
    riasecCode: 'RC',
    skillWeights: { math: 0.6, writing: 0.1, creative: 0.4, tech: 0.2, people: 0.3, handson: 1.0 },
    workValues: { achievement: 0.7, independence: 0.8, recognition: 0.3, relationships: 0.4, stability: 0.7, worklife: 0.5 },
  },
  {
    slug: 'cybersecurity-analyst',
    riasecCode: 'IC',
    skillWeights: { math: 0.7, writing: 0.4, creative: 0.3, tech: 1.0, people: 0.3, handson: 0.1 },
    workValues: { achievement: 0.8, independence: 0.6, recognition: 0.6, relationships: 0.4, stability: 0.9, worklife: 0.5 },
  },
  {
    slug: 'chef-commercial-cook',
    riasecCode: 'RA',
    skillWeights: { math: 0.3, writing: 0.2, creative: 0.8, tech: 0.1, people: 0.5, handson: 1.0 },
    workValues: { achievement: 0.8, independence: 0.6, recognition: 0.7, relationships: 0.6, stability: 0.4, worklife: 0.3 },
  },
  {
    slug: 'civil-engineer',
    riasecCode: 'IR',
    skillWeights: { math: 1.0, writing: 0.5, creative: 0.4, tech: 0.7, people: 0.4, handson: 0.6 },
    workValues: { achievement: 0.8, independence: 0.5, recognition: 0.6, relationships: 0.5, stability: 0.9, worklife: 0.5 },
  },
  {
    slug: 'sports-scientist',
    riasecCode: 'IR',
    skillWeights: { math: 0.7, writing: 0.5, creative: 0.3, tech: 0.5, people: 0.6, handson: 0.7 },
    workValues: { achievement: 0.8, independence: 0.5, recognition: 0.6, relationships: 0.7, stability: 0.6, worklife: 0.5 },
  },
  {
    slug: 'accountant',
    riasecCode: 'CE',
    skillWeights: { math: 1.0, writing: 0.5, creative: 0.1, tech: 0.5, people: 0.5, handson: 0.1 },
    workValues: { achievement: 0.6, independence: 0.5, recognition: 0.5, relationships: 0.5, stability: 0.9, worklife: 0.7 },
  },
  {
    slug: 'primary-secondary-teacher',
    riasecCode: 'SA',
    skillWeights: { math: 0.5, writing: 0.8, creative: 0.6, tech: 0.4, people: 1.0, handson: 0.3 },
    workValues: { achievement: 0.7, independence: 0.4, recognition: 0.5, relationships: 0.9, stability: 0.8, worklife: 0.7 },
  },
  {
    slug: 'plumber',
    riasecCode: 'RC',
    skillWeights: { math: 0.6, writing: 0.1, creative: 0.2, tech: 0.3, people: 0.4, handson: 1.0 },
    workValues: { achievement: 0.6, independence: 0.8, recognition: 0.3, relationships: 0.4, stability: 0.8, worklife: 0.5 },
  },
  {
    slug: 'data-analyst',
    riasecCode: 'IC',
    skillWeights: { math: 0.9, writing: 0.5, creative: 0.3, tech: 0.9, people: 0.4, handson: 0.1 },
    workValues: { achievement: 0.7, independence: 0.6, recognition: 0.5, relationships: 0.4, stability: 0.8, worklife: 0.7 },
  },
  {
    slug: 'paramedic',
    riasecCode: 'SR',
    skillWeights: { math: 0.3, writing: 0.4, creative: 0.1, tech: 0.3, people: 0.9, handson: 0.8 },
    workValues: { achievement: 0.8, independence: 0.4, recognition: 0.5, relationships: 0.8, stability: 0.7, worklife: 0.3 },
  },
  {
    slug: 'film-media-producer',
    riasecCode: 'AE',
    skillWeights: { math: 0.2, writing: 0.8, creative: 1.0, tech: 0.6, people: 0.7, handson: 0.3 },
    workValues: { achievement: 0.8, independence: 0.7, recognition: 0.9, relationships: 0.7, stability: 0.3, worklife: 0.4 },
  },
  {
    slug: 'veterinarian',
    riasecCode: 'IR',
    skillWeights: { math: 0.5, writing: 0.4, creative: 0.2, tech: 0.3, people: 0.6, handson: 0.8 },
    workValues: { achievement: 0.8, independence: 0.6, recognition: 0.5, relationships: 0.7, stability: 0.7, worklife: 0.4 },
  },
  {
    slug: 'marketing-manager',
    riasecCode: 'EA',
    skillWeights: { math: 0.5, writing: 0.8, creative: 0.8, tech: 0.6, people: 0.7, handson: 0.1 },
    workValues: { achievement: 0.8, independence: 0.6, recognition: 0.8, relationships: 0.6, stability: 0.6, worklife: 0.6 },
  },

  // ── Expanded 24 careers ──
  {
    slug: 'musician-music-producer',
    riasecCode: 'AE',
    skillWeights: { math: 0.3, writing: 0.5, creative: 1.0, tech: 0.6, people: 0.5, handson: 0.4 },
    workValues: { achievement: 0.8, independence: 0.9, recognition: 0.9, relationships: 0.5, stability: 0.2, worklife: 0.4 },
  },
  {
    slug: 'animator-3d-artist',
    riasecCode: 'AI',
    skillWeights: { math: 0.4, writing: 0.3, creative: 1.0, tech: 0.8, people: 0.2, handson: 0.2 },
    workValues: { achievement: 0.8, independence: 0.7, recognition: 0.7, relationships: 0.4, stability: 0.5, worklife: 0.5 },
  },
  {
    slug: 'fashion-designer',
    riasecCode: 'AE',
    skillWeights: { math: 0.2, writing: 0.4, creative: 1.0, tech: 0.4, people: 0.5, handson: 0.6 },
    workValues: { achievement: 0.8, independence: 0.8, recognition: 0.9, relationships: 0.5, stability: 0.3, worklife: 0.4 },
  },
  {
    slug: 'interior-designer',
    riasecCode: 'AE',
    skillWeights: { math: 0.4, writing: 0.4, creative: 0.9, tech: 0.5, people: 0.6, handson: 0.5 },
    workValues: { achievement: 0.7, independence: 0.7, recognition: 0.7, relationships: 0.6, stability: 0.5, worklife: 0.6 },
  },
  {
    slug: 'professional-athlete',
    riasecCode: 'RE',
    skillWeights: { math: 0.2, writing: 0.2, creative: 0.3, tech: 0.2, people: 0.5, handson: 1.0 },
    workValues: { achievement: 1.0, independence: 0.4, recognition: 0.9, relationships: 0.6, stability: 0.2, worklife: 0.2 },
  },
  {
    slug: 'personal-trainer',
    riasecCode: 'SE',
    skillWeights: { math: 0.3, writing: 0.3, creative: 0.3, tech: 0.2, people: 0.9, handson: 0.8 },
    workValues: { achievement: 0.7, independence: 0.8, recognition: 0.5, relationships: 0.9, stability: 0.4, worklife: 0.5 },
  },
  {
    slug: 'sports-coach',
    riasecCode: 'SE',
    skillWeights: { math: 0.3, writing: 0.4, creative: 0.4, tech: 0.2, people: 1.0, handson: 0.6 },
    workValues: { achievement: 0.8, independence: 0.5, recognition: 0.7, relationships: 0.9, stability: 0.5, worklife: 0.4 },
  },
  {
    slug: 'sports-journalist',
    riasecCode: 'AE',
    skillWeights: { math: 0.2, writing: 1.0, creative: 0.7, tech: 0.4, people: 0.6, handson: 0.2 },
    workValues: { achievement: 0.7, independence: 0.6, recognition: 0.8, relationships: 0.5, stability: 0.4, worklife: 0.4 },
  },
  {
    slug: 'event-manager',
    riasecCode: 'EC',
    skillWeights: { math: 0.4, writing: 0.5, creative: 0.6, tech: 0.3, people: 0.8, handson: 0.4 },
    workValues: { achievement: 0.8, independence: 0.5, recognition: 0.6, relationships: 0.8, stability: 0.4, worklife: 0.3 },
  },
  {
    slug: 'hairdresser-barber',
    riasecCode: 'RA',
    skillWeights: { math: 0.2, writing: 0.1, creative: 0.8, tech: 0.1, people: 0.8, handson: 0.9 },
    workValues: { achievement: 0.6, independence: 0.7, recognition: 0.5, relationships: 0.8, stability: 0.5, worklife: 0.5 },
  },
  {
    slug: 'tourism-travel-agent',
    riasecCode: 'ES',
    skillWeights: { math: 0.3, writing: 0.5, creative: 0.4, tech: 0.4, people: 0.9, handson: 0.2 },
    workValues: { achievement: 0.5, independence: 0.5, recognition: 0.4, relationships: 0.8, stability: 0.5, worklife: 0.6 },
  },
  {
    slug: 'early-childhood-educator',
    riasecCode: 'SA',
    skillWeights: { math: 0.3, writing: 0.5, creative: 0.7, tech: 0.2, people: 1.0, handson: 0.4 },
    workValues: { achievement: 0.6, independence: 0.3, recognition: 0.4, relationships: 1.0, stability: 0.7, worklife: 0.6 },
  },
  {
    slug: 'school-counsellor',
    riasecCode: 'SI',
    skillWeights: { math: 0.2, writing: 0.6, creative: 0.3, tech: 0.2, people: 1.0, handson: 0.1 },
    workValues: { achievement: 0.7, independence: 0.5, recognition: 0.4, relationships: 1.0, stability: 0.8, worklife: 0.7 },
  },
  {
    slug: 'entrepreneur-startup-founder',
    riasecCode: 'EC',
    skillWeights: { math: 0.6, writing: 0.6, creative: 0.7, tech: 0.5, people: 0.8, handson: 0.2 },
    workValues: { achievement: 1.0, independence: 1.0, recognition: 0.8, relationships: 0.6, stability: 0.2, worklife: 0.3 },
  },
  {
    slug: 'real-estate-agent',
    riasecCode: 'ES',
    skillWeights: { math: 0.5, writing: 0.5, creative: 0.3, tech: 0.3, people: 0.9, handson: 0.3 },
    workValues: { achievement: 0.7, independence: 0.7, recognition: 0.7, relationships: 0.7, stability: 0.5, worklife: 0.4 },
  },
  {
    slug: 'financial-planner',
    riasecCode: 'CE',
    skillWeights: { math: 0.9, writing: 0.5, creative: 0.2, tech: 0.4, people: 0.7, handson: 0.1 },
    workValues: { achievement: 0.7, independence: 0.6, recognition: 0.6, relationships: 0.7, stability: 0.8, worklife: 0.6 },
  },
  {
    slug: 'game-developer',
    riasecCode: 'IA',
    skillWeights: { math: 0.8, writing: 0.3, creative: 0.8, tech: 1.0, people: 0.3, handson: 0.1 },
    workValues: { achievement: 0.8, independence: 0.6, recognition: 0.7, relationships: 0.5, stability: 0.5, worklife: 0.5 },
  },
  {
    slug: 'ux-ui-designer',
    riasecCode: 'AI',
    skillWeights: { math: 0.3, writing: 0.5, creative: 0.9, tech: 0.8, people: 0.6, handson: 0.2 },
    workValues: { achievement: 0.7, independence: 0.6, recognition: 0.6, relationships: 0.6, stability: 0.6, worklife: 0.7 },
  },
  {
    slug: 'dentist',
    riasecCode: 'IR',
    skillWeights: { math: 0.5, writing: 0.3, creative: 0.3, tech: 0.4, people: 0.7, handson: 0.9 },
    workValues: { achievement: 0.8, independence: 0.7, recognition: 0.6, relationships: 0.6, stability: 0.9, worklife: 0.6 },
  },
  {
    slug: 'psychologist',
    riasecCode: 'SI',
    skillWeights: { math: 0.3, writing: 0.7, creative: 0.3, tech: 0.2, people: 1.0, handson: 0.1 },
    workValues: { achievement: 0.8, independence: 0.6, recognition: 0.5, relationships: 1.0, stability: 0.7, worklife: 0.6 },
  },
  {
    slug: 'automotive-mechanic',
    riasecCode: 'RC',
    skillWeights: { math: 0.5, writing: 0.1, creative: 0.2, tech: 0.5, people: 0.3, handson: 1.0 },
    workValues: { achievement: 0.6, independence: 0.7, recognition: 0.3, relationships: 0.4, stability: 0.7, worklife: 0.5 },
  },
  {
    slug: 'welder-boilermaker',
    riasecCode: 'RC',
    skillWeights: { math: 0.5, writing: 0.1, creative: 0.3, tech: 0.3, people: 0.2, handson: 1.0 },
    workValues: { achievement: 0.6, independence: 0.6, recognition: 0.3, relationships: 0.4, stability: 0.7, worklife: 0.4 },
  },
  {
    slug: 'environmental-scientist',
    riasecCode: 'IR',
    skillWeights: { math: 0.7, writing: 0.7, creative: 0.3, tech: 0.5, people: 0.4, handson: 0.6 },
    workValues: { achievement: 0.8, independence: 0.5, recognition: 0.5, relationships: 0.5, stability: 0.6, worklife: 0.6 },
  },
  {
    slug: 'marine-biologist',
    riasecCode: 'IR',
    skillWeights: { math: 0.6, writing: 0.6, creative: 0.3, tech: 0.4, people: 0.4, handson: 0.7 },
    workValues: { achievement: 0.8, independence: 0.6, recognition: 0.5, relationships: 0.5, stability: 0.5, worklife: 0.4 },
  },
];

export async function seedRiasecData() {
  console.log('\n── Seeding RIASEC data ──');

  let updated = 0;
  let skipped = 0;

  for (const data of RIASEC_DATA) {
    const career = await prisma.career.findUnique({ where: { slug: data.slug } });
    if (!career) {
      console.log(`  ⚠ Career not found: ${data.slug} — skipping`);
      skipped++;
      continue;
    }

    await prisma.career.update({
      where: { slug: data.slug },
      data: {
        riasecCode: data.riasecCode,
        skillWeights: data.skillWeights,
        workValues: data.workValues,
      },
    });

    updated++;
  }

  console.log(`  Updated ${updated} careers with RIASEC data (${skipped} skipped)`);
}

// Allow running standalone
if (require.main === module) {
  seedRiasecData()
    .then(() => console.log('RIASEC seed complete.'))
    .catch((e) => {
      console.error('RIASEC seed failed:', e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
