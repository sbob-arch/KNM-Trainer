import { TestConfig } from './types';

export const STUDY_MATERIALS = [
  {
    id: '_eRgrWUG1ks',
    title: 'Level 1: Work & Values',
    description: 'Master the basics of Dutch working culture, income, and core values.',
    thumbnail: 'https://img.youtube.com/vi/_eRgrWUG1ks/mqdefault.jpg',
    topicContext: 'Dutch labor market, applying for jobs, employment contracts (vast/tijdelijk), income tax, uitkering, Dutch core values, freedom of religion, equality, participation statement.'
  },
  {
    id: 'p4gMdOqgeQQ',
    title: 'Level 2: Health & School',
    description: 'Learn how the healthcare and education systems work.',
    thumbnail: 'https://img.youtube.com/vi/p4gMdOqgeQQ/mqdefault.jpg',
    topicContext: 'Dutch healthcare system, mandatory health insurance (basisverzekering), GP (huisarts), eigen risico, apotheek, consultatiebureau, Dutch education system, leerplicht, primary school, VMBO/HAVO/VWO, MBO/HBO/WO.'
  },
  {
    id: 'F8e334kqY-g',
    title: 'Level 3: Practice Scenario A',
    description: 'Test your skills with real exam-style practice questions.',
    thumbnail: 'https://img.youtube.com/vi/F8e334kqY-g/mqdefault.jpg',
    topicContext: 'A mix of recent KNM exam questions covering work, health, education, and social norms. Focus on situational judgment.'
  },
  {
    id: 'jQywBU031Hg',
    title: 'Level 4: Practice Scenario B',
    description: 'Intermediate practice questions to test your knowledge.',
    thumbnail: 'https://img.youtube.com/vi/jQywBU031Hg/mqdefault.jpg',
    topicContext: 'Diverse KNM topics including history, geography, politics, and daily life situations in the Netherlands.'
  },
  {
    id: 'ewFOqj7Rf6I',
    title: 'Level 5: Advanced Scenarios',
    description: 'Complex situations and difficult questions.',
    thumbnail: 'https://img.youtube.com/vi/ewFOqj7Rf6I/mqdefault.jpg',
    topicContext: 'Complex KNM scenarios, norms and values, difficult work situations, and housing rules.'
  }
];

export const TESTS: TestConfig[] = [
  {
    id: 'work',
    title: 'Work & Income',
    description: '15 Questions: Finding a job, contracts, taxes.',
    topicContext: 'Work, employment contracts, income tax, finding a job, workplace culture, UWV, unions, working hours, calling in sick.'
  },
  {
    id: 'health',
    title: 'Healthcare',
    description: '15 Questions: GP, insurance, emergency services.',
    topicContext: 'Healthcare system, health insurance (zorgverzekering), GP (huisarts), hospitals, emergency care (spoedeisende hulp), pharmacy (apotheek), eigen risico.'
  },
  {
    id: 'education',
    title: 'Education',
    description: '15 Questions: School system, leerplicht, degrees.',
    topicContext: 'Dutch education system, primary school, secondary school (VMBO, HAVO, VWO), leerplicht, vocational training (MBO), higher education (HBO, WO).'
  },
  {
    id: 'history',
    title: 'History & Geo',
    description: '15 Questions: Events, geography, provinces.',
    topicContext: 'Dutch history, Eighty Years War, William of Orange, World War II, geography, provinces, Randstad, water management, Delta Works.'
  },
  {
    id: 'politics',
    title: 'Politics',
    description: '15 Questions: Democracy, King, Constitution.',
    topicContext: 'Dutch politics, democracy, constitution (Grondwet), King, Parliament (Tweede Kamer, Eerste Kamer), elections, municipalities (gemeente), freedom of speech.'
  },
  {
    id: 'social',
    title: 'Social Norms',
    description: '15 Questions: Customs, equality, neighbors.',
    topicContext: 'Social norms, omgangsvormen, equality, freedom of religion, discrimination, rights and obligations, interacting with neighbors.'
  },
  {
    id: 'housing',
    title: 'Housing',
    description: '15 Questions: Renting, buying, utilities.',
    topicContext: 'Housing, renting, buying, social housing, utilities (gas, water, electricity), waste separation, neighborhood rules, VvE.'
  },
  {
    id: 'mixed',
    title: 'Exam Sim',
    description: '30 Questions: Full exam simulation.',
    topicContext: 'A generic mix of all KNM topics: Work, Health, Education, History, Politics, Social Norms, Housing.'
  }
];