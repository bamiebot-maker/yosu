export interface LeaderArticle {
  id: string;
  slug: string;
  headline: string;
  subheadline: string;
  category: string;
  author: string;
  officeTitle: string;
  sessionEra: string;
  readTime: string;
  publishedDate: string;
  imageUrl: string;
  excerpt: string;
  leadParagraph: string;
  bodyParagraphs: string[];
  keyAdviceQuote: string;
  adviceForCurrentStudents: string[];
  initialLikes: number;
  initialShares: number;
}

export const LEADER_NEWS_ARTICLES: LeaderArticle[] = [
  {
    id: 'story-sobur-2026',
    slug: 'omoluabi-mandate-sobur',
    headline: 'The Sovereign Union Mandate: Why Omoluabi Integrity Must Guide Every Yoruba Scholar in the North',
    subheadline: 'An Executive Reflection on Pioneer Resilience, Welfare Interventions, and Standing Firm in Dutse',
    category: 'Presidential Address',
    author: 'Cmrd. Ibrahim Sobur Bamidele',
    officeTitle: '12th Executive President',
    sessionEra: '2026/2027 Progress Era',
    readTime: '4 min read',
    publishedDate: 'September 2026',
    imageUrl: '/images/leadership/president-sobur.jpg',
    excerpt: 'Studying in Northern Nigeria presents unique realities. Our administration made a sacred pledge that no Yoruba student at FUD should ever feel stranded or isolated.',
    leadParagraph: `When our administration assumed executive office, we made a sacred pledge that no Yoruba student at Federal University Dutse should ever feel isolated or stranded thousands of kilometers from home. True leadership is not about ceremonial titles—it is the unwavering dedication to student welfare, academic excellence, and Omoluabi dignity.`,
    bodyParagraphs: [
      `Studying in Northern Nigeria presents unique social, climatic, and academic realities. Our forefathers who established this union envisioned an unbreakable support sanctuary where seniors mentor freshers, where financial and academic hardships are confronted together, and where our indigenous language and culture are celebrated with profound respect for our host community.`,
      `During our tenure, we faced critical challenges: the rising cost of interstate transit, student academic probationary risks, and the urgent need for a tamper-proof digital identification system. By deploying the Digital Membership Card and expanding our Faculty Tutorial Reserves, we proved that student governance can be transparent, accountable, and technologically progressive.`,
      `To every undergraduate walking the lecture halls of FUD today: remember that your degree alone is incomplete without the Omoluabi virtue. Character, respect, intellectual rigor, and solidarity are the four cornerstones that will set you apart anywhere in the world.`
    ],
    keyAdviceQuote: 'Never compromise your values for temporary convenience. Your character and academic excellence define the true spirit of Omoluabi.',
    adviceForCurrentStudents: [
      'Prioritize your academic studies above all distractions—your primary assignment in Dutse is intellectual mastery.',
      'Engage in peer mentorship and tutorial study circles within your departmental associations.',
      'Show absolute respect and cultural courtesy to our university hosts and Jigawa State community.',
      'Maintain financial discipline and support stranded brothers and sisters whenever in your power.'
    ],
    initialLikes: 0,
    initialShares: 0
  },
  {
    id: 'story-lagbaja-2013',
    slug: 'genesis-yoruba-solidarity-2013',
    headline: 'The Genesis of Yoruba Solidarity at FUD: How Pioneer Undergraduates United in 2013',
    subheadline: 'Historic Account from Pioneer President Adebayo Lagbaja on Founding YOSU',
    category: 'Founding Memoir',
    author: 'Cmrd. Adebayo Lagbaja',
    officeTitle: 'Pioneer Executive President',
    sessionEra: '2013/2015 Foundation Era',
    readTime: '5 min read',
    publishedDate: 'Archival Interview',
    imageUrl: '/images/yosu-logo.png',
    excerpt: 'In 2013, a handful of undergraduates met under the neem trees near pioneer faculty blocks with zero budget, driven by a determination that our welfare was our collective responsibility.',
    leadParagraph: `In 2013, when Federal University Dutse opened its doors, there were just a handful of students from the South-Western states. We quickly discovered that without an organized student body, many freshmen struggled with settling into off-campus accommodation, acclimatizing to the harmattan season, and navigating campus administrative processes.`,
    bodyParagraphs: [
      `A few of us met under the neem trees near the pioneer faculty blocks. We had no budget, no secretariat, and no legal charter—only a shared determination that our collective welfare was our responsibility. We moved from hostel to hostel, registering every Yoruba student regardless of whether they were from Ekiti, Kwara, Oyo, Osun, Ondo, Ogun, Lagos, or Kogi.`,
      `That mobilization birthed what is today the sovereign Yoruba Students' Union. We organized the first freshers orientation, donated personal textbooks to create a lending pool, and staged the first cultural night that earned the admiration of the university management.`,
      `Seeing YOSU FUD thrive today with institutional governance and digital portals fills my heart with immense pride. To the current generation: protect the unity we labored to plant.`
    ],
    keyAdviceQuote: 'Unity is not a slogan; it is the deliberate choice to lift up your fellow brother when the road is steep.',
    adviceForCurrentStudents: [
      'Protect the union from divisive politics and fractional caucuses—unity is your greatest shield.',
      'Seek wisdom from your lecturers and community elders across Jigawa State.',
      'Never allow academic setbacks to diminish your self-worth; seek peer tutorial assistance early.'
    ],
    initialLikes: 0,
    initialShares: 0
  },
  {
    id: 'story-tamedo-2015',
    slug: 'bicameral-constitutional-sovereignty',
    headline: 'Building Constitutional Sovereignty: The Evolution of Equal State Representation in YOSU',
    subheadline: 'Former President Babatunde Tamedo on Codifying the Bicameral Legislative Charter',
    category: 'Constitutional Gazette',
    author: 'Cmrd. Babatunde Tamedo',
    officeTitle: 'Second Administration President',
    sessionEra: '2015/2017 Institutional Era',
    readTime: '4 min read',
    publishedDate: 'Archival Gazette',
    imageUrl: '/images/yosu-logo.png',
    excerpt: 'How we convened consultative sessions with all 8 Yoruba constituent states to establish a bicameral legislative charter guaranteeing equal representation.',
    leadParagraph: `The true strength of a student union lies not in the charisma of its president, but in the strength of its constitutional framework. In our administration, we set out to ensure that no single state caucus could monopolize power.`,
    bodyParagraphs: [
      `We convened extensive consultative sessions with delegates from Kwara, Kogi, Oyo, Osun, Ekiti, Ondo, Ogun, and Lagos. We drafted the first bicameral legislative charter that granted equal state delegation rights in the YOSU House of Representatives.`,
      `That structural milestone ensured that whether a student hails from Okun Land in Kogi or the shores of Lagos, their voice matters equally in the budgeting and legislative oversight of union dues and executive projects.`,
      `My message to aspiring student leaders is simple: lead by the constitution, consult widely, and never view leadership as an avenue for personal enrichment.`
    ],
    keyAdviceQuote: 'Institutions outlive individuals. Build systems that are fair, transparent, and legally sound.',
    adviceForCurrentStudents: [
      'Read and understand your Unification Constitution—it is your charter of rights and duties.',
      'Participate actively in your state delegation plenary meetings and student town halls.',
      'Practice democratic tolerance and constructive debate without hostility.'
    ],
    initialLikes: 0,
    initialShares: 0
  }
];

export function getLeaderArticleBySlug(slug: string): LeaderArticle | undefined {
  return LEADER_NEWS_ARTICLES.find(
    (art) => art.slug === slug || art.id === slug
  );
}
