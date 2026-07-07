// Real ASIET facts, sourced from https://www.adishankara.ac.in/ (fetched 2026-06-24),
// including the public faculty directory at /department/all-faculty and
// /about/head-of-the-departments. This is the single source of truth for kiosk
// content — update here, not in components. Anything not publicly verifiable on
// the site (e.g. live fee figures, placement %) is deliberately left out rather
// than guessed — see README.

export const institution = {
  name: 'Adi Shankara Institute of Engineering and Technology',
  shortName: 'ASIET',
  founded: 2001,
  address: 'Vidya Bharathi Nagar, Mattoor, Kalady, Ernakulam District, Kerala 683574',
  landmarks: [
    '5 km from Cochin International Airport (Nedumbassery)',
    '6 km from Angamaly railway station',
  ],
  website: 'www.adishankara.ac.in',
  tagline: "Kerala's first ISO 9001:2008 certified self-financing engineering college",
};

export const accreditations = [
  { label: 'AICTE Approved', icon: 'badge-check' },
  { label: 'Affiliated to KTU', detail: 'APJ Abdul Kalam Technological University', icon: 'landmark' },
  { label: "NAAC 'A' Grade", detail: 'First accreditation cycle', icon: 'award' },
  { label: 'NBA Accredited', detail: 'CE · CSE · ECE · EEE · ME — valid till 31 Dec 2028', icon: 'shield-check' },
  { label: 'ISO 9001:2008', detail: 'First self-financing engineering college in Kerala to hold it', icon: 'file-badge' },
  { label: 'KIRF 2025 Ranking', detail: '7th among self-financing colleges · 14th among all engineering colleges in Kerala', icon: 'trophy' },
];

export const leadership = [
  { name: 'Dr. M. S. Murali', role: 'Principal', phone: '+91 9880855302' },
  { name: 'Sri K. Anand', role: 'Managing Trustee' },
  { name: 'Sri P.A. Murali', role: 'CEO & Administrator' },
];

export const contact = {
  phones: ['0484-2463825', '0484-2466066', '0484-2461933'],
  fax: '0484-2463828',
  email: 'info@adishankara.ac.in',
  admissionsPortal: 'admissions.adishankara.ac.in',
  lines: [
    { label: 'Principal (direct)', value: '+91 98808 55302' },
    { label: 'UG Admissions', value: '+91 80866 60036' },
    { label: 'PG Admissions', value: '+91 80866 60076' },
    { label: 'General Inquiry', value: '+91 80866 60026' },
  ],
};

// UG / PG / Doctoral programs
export const programs = {
  ug: [
    { code: 'CE', name: 'Civil Engineering', icon: 'hammer' },
    { code: 'CSE', name: 'Computer Science & Engineering', icon: 'cpu' },
    { code: 'AI&DS', name: 'Artificial Intelligence and Data Science', icon: 'brain-circuit' },
    { code: 'ECE', name: 'Electronics & Communication Engineering', icon: 'radio' },
    { code: 'EEE', name: 'Electrical & Electronics Engineering', icon: 'zap' },
    { code: 'EBE', name: 'Electronics & Biomedical Engineering', icon: 'heart-pulse' },
    { code: 'ME', name: 'Mechanical Engineering', icon: 'cog' },
    { code: 'R&A', name: 'Robotics and Automation', icon: 'bot' },
  ],
  pg: [
    { code: 'M.Tech', name: 'Computer Science & Engineering', icon: 'cpu' },
    { code: 'M.Tech', name: 'Power Electronics & Power Systems', icon: 'zap' },
    { code: 'M.Tech', name: 'VLSI & Embedded Systems', icon: 'microchip' },
  ],
  business: [
    { code: 'MBA', name: 'Master of Business Administration', icon: 'briefcase' },
    { code: 'MCA', name: 'Master of Computer Applications', icon: 'laptop' },
  ],
  phd: [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Biomedical Engineering',
    'Mechanical Engineering',
  ],
};

export const facilities = [
  { label: 'Central Library', detail: 'Reference & digital sections, e-journals and e-resources', icon: 'book-open' },
  { label: 'Boys & Girls Hostels', detail: 'On-campus residential blocks', icon: 'building-2' },
  { label: 'Canteen', detail: 'On-campus dining', icon: 'utensils' },
  { label: 'Bank & ATM', detail: 'On-campus banking', icon: 'landmark' },
  { label: 'Wellness Clinic', detail: 'Medical care + professional counselling', icon: 'stethoscope' },
  { label: 'Fitness & Wellbeing Center', detail: 'Gym and sports facilities', icon: 'dumbbell' },
  { label: 'Transportation', detail: 'Bus services across routes', icon: 'bus' },
  { label: 'Divyangjan Facilities', detail: 'Ramps & lifts for accessibility', icon: 'accessibility' },
  { label: 'IT Infrastructure', detail: 'Campus-wide network & computing labs', icon: 'network' },
  { label: 'Power Backup', detail: 'Uninterrupted campus power', icon: 'battery-charging' },
];

export const innovationCenters = [
  { label: 'IEDC', detail: "Institution's Innovation Council" },
  { label: 'TBI', detail: 'Technology Business Incubator' },
  { label: 'FAB LAB', detail: 'Digital fabrication lab' },
  { label: 'IIPC', detail: 'ASIET Innovation and Incubation Park Center' },
  { label: 'IPR Cell', detail: 'Intellectual property support' },
  { label: 'Center for AI-IoT Innovation' },
  { label: 'NISP', detail: 'National Innovation Support Program' },
];

export const studentSupport = [
  'Anti-Ragging Cell',
  'Student Grievance Redressal Committee',
  'Gender & Equity Cell',
  'SC/ST Committee',
  'Women Empowerment Cell',
  'Internal Complaints Committee',
  'Student Welfare Committee',
  'Scholarship Programs',
];

export const clubs = [
  'IEEE', 'ASME', 'SEEM', 'ISME', 'GDSC', 'SAE INDIA', 'BMESI', 'AI Club',
  'CodeX', 'RAS', 'ISA', 'TRS', 'CSI Club', 'Photography Club',
  'Electoral Literacy Club', 'Drone Club', 'TinkerHub', 'Arts & Theatre Club',
  'Literary Club', 'Quiz Club', 'Mathematics Club', 'Science Club', 'Entrepreneurship Club',
];

export const socialService = [
  'NSS', 'Bhoomithra Sena', 'Unnat Bharat Abhiyan', 'Swachh Bharat', 'Red Ribbon Club',
  'River Rejuvenation', 'Mappathon', 'Tourism Club Kerala', 'Standards Club', 'Bhumi Club', 'ASAAD Sena',
];

export const admissions = {
  portal: 'admissions.adishankara.ac.in',
  notes: [
    'B.Tech 2026 Management & NRI Quota counselling is open — apply via the admissions portal.',
    'KEAM/KTU merit-seat admissions follow the official CEE Kerala allotment process.',
    'Visit the Admissions Office (UG / PG / Business School counters) for fee structure, scholarship and hostel details.',
  ],
};

// Dated items — events are upcoming happenings, news are recent achievements.
// `date` is an ISO string (YYYY-MM-DD); the carousel sorts/filters these live
// against the kiosk's current date rather than a hardcoded "upcoming" flag.
export const events = [
  {
    id: 'aakashien-2026',
    kind: 'event',
    pill: 'COLLEGE EVENT',
    pillIcon: 'party-popper',
    title: 'Aakashien 2026',
    sub: 'National level intercollegiate fest',
    date: '2026-07-04',
    dateLabel: '04 July 2026',
    location: 'ASIET Campus, Kalady',
    decor: '04',
    decorLabel: 'JULY',
  },
  {
    id: 'samavarthana-2k26',
    kind: 'event',
    pill: 'CONVOCATION',
    pillIcon: 'graduation-cap',
    title: 'Samavarthana 2K26',
    sub: 'Annual graduation ceremony',
    date: '2026-06-26',
    dateLabel: '26 June 2026',
    location: 'ASIET Campus, Kalady',
    decor: '2K',
    decorLabel: '26',
  },
  {
    id: 'admissions-open-2026',
    kind: 'event',
    pill: 'ADMISSIONS OPEN',
    pillIcon: 'clipboard-list',
    title: 'B.Tech 2026 Admissions',
    sub: 'Management & NRI Quota counselling open',
    date: '2026-06-24',
    dateLabel: 'Counselling now open',
    location: 'admissions.adishankara.ac.in',
    decor: '26',
    decorLabel: 'BATCH',
  },
  {
    id: 'yoga-day-2026',
    kind: 'event',
    pill: 'OBSERVANCE',
    pillIcon: 'sparkles',
    title: 'International Yoga Day',
    sub: 'Campus wellness observance',
    date: '2026-06-22',
    dateLabel: '22 June 2026',
    location: 'ASIET Campus, Kalady',
    decor: '22',
    decorLabel: 'JUNE',
  },
  {
    id: 'naac-grade',
    kind: 'news',
    pill: 'ACHIEVEMENT',
    pillIcon: 'trophy',
    title: "NAAC 'A' Grade",
    sub: 'Ranked 7th among self-financing colleges in Kerala',
    date: '2025-01-01',
    dateLabel: "KIRF Ranking 2025 · NBA Accredited",
    location: null,
    decor: 'A',
    decorLabel: 'GRADE',
  },
  {
    id: 'meity-grant',
    kind: 'news',
    pill: 'RESEARCH',
    pillIcon: 'flask-conical',
    title: 'Rs 2.98 Crore Research Grant',
    sub: 'Awarded by MeitY, Government of India, with CMET Thrissur',
    date: '2026-05-01',
    dateLabel: '2026',
    location: null,
    decor: '₹3',
    decorLabel: 'CRORE',
  },
  {
    id: 'ibm-mou',
    kind: 'news',
    pill: 'PARTNERSHIP',
    pillIcon: 'handshake',
    title: 'MoU with IBM',
    sub: 'IBM Innovation Centre for Education partnership',
    date: '2026-02-01',
    dateLabel: 'February 2026',
    location: null,
    decor: 'IBM',
    decorLabel: 'PARTNER',
  },
  {
    id: 'volleyball-nit-cup',
    kind: 'news',
    pill: 'SPORTS',
    pillIcon: 'trophy',
    title: "Women's Volleyball — NIT Cup 2026",
    sub: 'ASIET team won the championship',
    date: '2026-03-01',
    dateLabel: 'March 2026',
    location: null,
    decor: '🏆',
    decorLabel: 'WINNERS',
  },
];

export function getCarouselSlides(now = new Date()) {
  const upcoming = events
    .filter((e) => e.kind === 'event' && new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const news = events.filter((e) => e.kind === 'news');
  const recentPast = events
    .filter((e) => e.kind === 'event' && new Date(e.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  // Upcoming events first (most relevant to a visitor today), then recent
  // achievements, then anything just-passed, so the rail never goes empty.
  return [...upcoming, ...news, ...recentPast];
}

// Faculty directory — from adishankara.ac.in/department/all-faculty and
// /about/head-of-the-departments. One canonical bucket per department; the
// site's near-duplicate "CSE (Data Science)" listing (2 names, same HOD) was
// folded into AI&DS rather than kept as a confusing 12th near-empty bucket.
export const facultyDirectory = [
  {
    key: 'CE', name: 'Civil Engineering', hod: 'Abishek Kumar A A',
    members: [
      { name: 'Abishek Kumar A A', designation: 'Assistant Professor & Head of Department' },
      { name: 'Dr. P K Suresh', designation: 'Senior Professor' },
      { name: 'Dr. Dhanasekar K', designation: 'Professor' },
      { name: 'Dr. A N Swaminathan', designation: 'Professor' },
      { name: 'Dr. Parameswaran T G', designation: 'Associate Professor' },
      { name: 'Abin Joy', designation: 'Assistant Professor' },
      { name: 'Reema Pius', designation: 'Assistant Professor' },
      { name: 'Akhila Vijayan', designation: 'Assistant Professor' },
      { name: 'Rosmin Thomas', designation: 'Assistant Professor' },
      { name: 'Veena S Kumar', designation: 'Assistant Professor' },
      { name: 'Dona Joy', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. Ramani Bai V',
    members: [
      { name: 'Dr. Ramani Bai V', designation: 'Professor & Head of Department' },
      { name: 'Dr. Deepa Devassy', designation: 'Associate Professor' },
      { name: 'Dr. Sanjuna K R', designation: 'Associate Professor' },
      { name: 'Dr. Sreedevi R Krishnan', designation: 'Assistant Professor' },
      { name: 'T Sobha', designation: 'Associate Professor (Pursuing PhD)' },
      { name: 'Raghi R Menon', designation: 'Senior Assistant Professor (Pursuing PhD)' },
      { name: 'Neetha K Nataraj', designation: 'Senior Assistant Professor (Pursuing PhD)' },
      { name: 'Rose Mary Varghese', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Divya K S', designation: 'Assistant Professor, Selection Grade (Pursuing PhD)' },
      { name: 'Anila S', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Sumesh C Raman', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Jithi P V', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Sharika T R', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Akshaya Jayaraj', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Chinnu Maria Varghese', designation: 'Assistant Professor' },
      { name: 'Parvathy Nair', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Parvathy Unnikrishnan', designation: 'Assistant Professor' },
      { name: 'Ambily Mohan', designation: 'Assistant Professor' },
      { name: 'Asha Alias', designation: 'Assistant Professor' },
      { name: 'Alsha Thomas', designation: 'Assistant Professor' },
      { name: 'Shany Jophin', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Anjush R K', designation: 'Assistant Professor' },
      { name: 'Jerin Varghese', designation: 'Assistant Professor' },
      { name: 'Hitha Rocky', designation: 'Assistant Professor' },
      { name: 'Krishna Priya R', designation: 'Assistant Professor' },
      { name: 'Naznin M Ali', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'AIDS', name: 'Artificial Intelligence and Data Science', hod: 'Dr. Sarika S',
    members: [
      { name: 'Dr. Sarika S', designation: 'Professor & Head of Department' },
      { name: 'Dr. Binju Saju', designation: 'Associate Professor' },
      { name: 'Dr. Amrutha Muralidharan Nair', designation: 'Associate Professor' },
      { name: 'Dr. Siji Jose Pulluparambil', designation: 'Assistant Professor' },
      { name: 'P V Rajaraman', designation: 'Assistant Professor & Chief Technology Officer' },
      { name: 'Asha Rose Thomas', designation: 'Senior Assistant Professor (Pursuing PhD)' },
      { name: 'Sabitha M G', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Remya Raveendran', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Chaithanya C', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Tintu P B', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Midhun M', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Reshma R', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Reshmi V', designation: 'Assistant Professor' },
      { name: 'Elsa Tinu', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'ECE', name: 'Electronics & Communication Engineering', hod: 'Dr. Ajay Kumar',
    members: [
      { name: 'Dr. Ajay Kumar', designation: 'Professor & Head of Department' },
      { name: 'Dr. Bipin P R', designation: 'Professor' },
      { name: 'Dr. Bobby Mathews C', designation: 'Professor, Dean PhD Programmes' },
      { name: 'Dr. Neema M', designation: 'Associate Professor' },
      { name: 'Dr. Aswathy N', designation: 'Associate Professor' },
      { name: 'Dr. Resmi N. C.', designation: 'Associate Professor' },
      { name: 'Dr. Sajin C S', designation: 'Associate Professor' },
      { name: 'Sreekanth K S', designation: 'Associate Professor' },
      { name: 'Neetha K', designation: 'Senior Assistant Professor (Pursuing PhD)' },
      { name: 'Neethu Suman', designation: 'Senior Assistant Professor' },
      { name: 'Divya V Chandran', designation: 'Senior Assistant Professor (Pursuing PhD)' },
      { name: 'Savitha Raghavan', designation: 'Selection Grade Assistant Professor (Pursuing PhD)' },
      { name: 'Remya Ramesh', designation: 'Selection Grade Assistant Professor (Pursuing PhD)' },
      { name: 'Archana Aniyan', designation: 'Selection Grade Assistant Professor (Pursuing PhD)' },
      { name: 'Anju George', designation: 'Assistant Professor' },
      { name: 'Jaimy James Poovely', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Arya Paul', designation: 'Assistant Professor' },
      { name: 'Prasanth P Menon', designation: 'Assistant Professor' },
      { name: 'Dr. Anagha E G', designation: 'Assistant Professor' },
      { name: 'Dr. Reshma Lakshmanan', designation: 'Assistant Professor' },
      { name: 'Manesh V M', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Santhi K', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'EEE', name: 'Electrical & Electronics Engineering', hod: 'Dr. Deepa Sankar',
    members: [
      { name: 'Dr. Deepa Sankar', designation: 'Professor & Head of Department' },
      { name: 'Dr. P Jeno Paul', designation: 'Professor' },
      { name: 'Dr. S Subiramoniyan', designation: 'Associate Professor' },
      { name: 'Dr. Sreena Sreekumar', designation: 'Associate Professor' },
      { name: 'Anitha P', designation: 'Associate Professor' },
      { name: 'Gomathy S', designation: 'Associate Professor' },
      { name: 'Sijo George', designation: 'Associate Professor (Pursuing PhD)' },
      { name: 'Hima T', designation: 'Senior Assistant Professor (Pursuing PhD)' },
      { name: 'Rajitha A R', designation: 'Senior Assistant Professor (Pursuing PhD)' },
      { name: 'Rajalakshmy S', designation: 'Assistant Professor, Selection Grade' },
      { name: 'Anna Baby', designation: 'Assistant Professor, Selection Grade (Pursuing PhD)' },
      { name: 'Ashna Mohan', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Sreehari S', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Akhila K', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Alan Mathew George', designation: 'Assistant Professor (Pursuing PhD)' },
    ],
  },
  {
    key: 'EBE', name: 'Electronics and Biomedical Engineering', hod: 'Dr. Remya George',
    members: [
      { name: 'Dr. Remya George', designation: 'Associate Professor & Head of Department' },
      { name: 'Dr. Surya D', designation: 'Assistant Professor' },
      { name: 'Dr. Tresa Joseph', designation: 'Assistant Professor' },
      { name: 'Dr. Silpa P A', designation: 'Associate Professor' },
      { name: 'Arya C V', designation: 'Assistant Professor' },
      { name: 'Nimmi Vijayan', designation: 'Assistant Professor' },
      { name: 'Winnie Ann Thomas', designation: 'Assistant Professor' },
      { name: 'Shinu M M', designation: 'Assistant Professor' },
      { name: 'Krishna S Nair', designation: 'Assistant Professor' },
      { name: 'Arya Udayan', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'ME', name: 'Mechanical Engineering', hod: 'Dr. Jithesh K',
    members: [
      { name: 'Dr. Jithesh K', designation: 'Associate Professor & Head of Department' },
      { name: 'Dr. Eldose K K', designation: 'Professor' },
      { name: 'Dr. Vinay Varghese', designation: 'Associate Professor' },
      { name: 'Dr. Sivaprasad P V', designation: 'Associate Professor' },
      { name: 'Dr. Nidhin Raj A', designation: 'Associate Professor' },
      { name: 'Dr. Sandeep O S', designation: 'Assistant Professor' },
      { name: 'Dr. Rahul S Arackal', designation: 'Assistant Professor' },
      { name: 'Leo Francis', designation: 'Assistant Professor' },
      { name: 'Eldhose K Joy', designation: 'Assistant Professor' },
      { name: 'Vishnu S', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Goutham D', designation: 'Assistant Professor' },
      { name: 'Arun P Das', designation: 'Assistant Professor' },
      { name: 'Eldho Mathew', designation: 'Assistant Professor' },
      { name: 'Jithesh S R', designation: 'Assistant Professor' },
      { name: 'Kiran K S', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'R&A', name: 'Robotics and Automation', hod: 'Dr. Sreedeep Krishnan',
    members: [
      { name: 'Dr. Sreedeep Krishnan', designation: 'Associate Professor & Head of Department' },
      { name: 'Dr. Sreepriya S', designation: 'Professor and Dean of Research' },
      { name: 'Dr. Athira M', designation: 'Associate Professor' },
      { name: 'Dr. Julia T J', designation: 'Associate Professor' },
      { name: 'Dr. Jeeshma Mary Paul', designation: 'Assistant Professor' },
      { name: 'Ravi Balakrishnan', designation: 'Adjunct Professor' },
      { name: 'Dileep K', designation: 'Assistant Professor' },
      { name: 'Ranjeesh R Chandran', designation: 'Assistant Professor, Selection Grade (Pursuing PhD)' },
      { name: 'Anju Mary Joseph', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Arun Kumar K', designation: 'Assistant Professor' },
      { name: 'Safeena M K', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Deepa K Davis', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'MBA', name: 'Business School', hod: 'Renjith K R',
    members: [
      { name: 'Renjith K R', designation: 'Senior Assistant Professor & Head of Department' },
      { name: 'Dr. Madhu C S', designation: 'Professor' },
      { name: 'Dr Shiny C M', designation: 'Professor' },
      { name: 'Dr. Chinju C. J.', designation: 'Associate Professor' },
      { name: 'Dr. Jis Jose Koreath', designation: 'Assistant Professor' },
      { name: 'Dr. Anna Anjana Varghese', designation: 'Assistant Professor' },
      { name: 'Dr. Aldrin Joseph', designation: 'Assistant Professor' },
      { name: 'Manju M Mathew', designation: 'Assistant Professor' },
      { name: 'Jisha J', designation: 'Assistant Professor' },
      { name: 'Sooraj Krishnan C', designation: 'Assistant Professor' },
      { name: 'Vishnu Narayanan S', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'MCA', name: 'Computer Applications', hod: 'Dr. Vincy Devi V K',
    members: [
      { name: 'Dr. Vincy Devi V K', designation: 'Associate Professor & Head of Department' },
      { name: 'Dr. Sneha Prakash', designation: 'Assistant Professor' },
      { name: 'Anjali Sankar', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Rintu Augustine', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Sukrith Lal P S', designation: 'Assistant Professor' },
    ],
  },
  {
    key: 'BSH', name: 'Basic Science & Humanities', hod: 'Dr. Jayanthi K R',
    members: [
      { name: 'Dr. Jayanthi K R', designation: 'Associate Professor & Head of Department' },
      { name: 'Dr. Ganga Devi T R', designation: 'Associate Professor' },
      { name: 'Dr. Jini Varghese P', designation: 'Associate Professor' },
      { name: 'Dr. Akhila Das', designation: 'Assistant Professor' },
      { name: 'Suja C K', designation: 'Senior Grade Assistant Professor (Pursuing PhD)' },
      { name: 'Leena C L', designation: 'Selection Grade Assistant Professor' },
      { name: 'Savithry K S', designation: 'Selection Grade Assistant Professor' },
      { name: 'Resmi V R', designation: 'Selection Grade Assistant Professor (Pursuing PhD)' },
      { name: 'Pravitha K Nair', designation: 'Senior Grade Assistant Professor (Pursuing PhD)' },
      { name: 'Dhanya R', designation: 'Assistant Professor' },
      { name: 'Sajitha Saseendran', designation: 'Assistant Professor' },
      { name: 'Nisha K N', designation: 'Assistant Professor' },
      { name: 'Sruthi N L', designation: 'Assistant Professor' },
      { name: 'Misha K N', designation: 'Assistant Professor' },
      { name: 'Krishnapriya', designation: 'Assistant Professor' },
      { name: 'Renjini T N', designation: 'Assistant Professor' },
      { name: 'Sudesh Prabhakaran', designation: 'Assistant Professor' },
      { name: 'Gouripriya Ramachandran', designation: 'Assistant Professor' },
      { name: 'Amal Pavithran', designation: 'Assistant Professor (Pursuing PhD)' },
      { name: 'Remya Ranganath', designation: 'Assistant Professor' },
    ],
  },
];

// Per-department deep profile — vision/mission, labs, research, clubs,
// achievements. Generalized shape so each department can be filled in over
// time; only AIDS (Artificial Intelligence and Data Science) is fully
// populated for now, sourced from
// adishankara.ac.in/department/artificial-intelligence-and-data-science
// (fetched 2026-06-24). A department with no entry here just shows its
// HOD/faculty list (see AcademicsPanel) — nothing is guessed to fill gaps.
export const departmentDetails = {
  AIDS: {
    established: 2020,
    vision: 'To be in the frontier of AI technology through quality of education, collaborative research and produce globally competitive, industry ready engineers with social commitment.',
    mission: [
      'Achieve excellence in educational experience, fostering collaborative research through state-of-the-art infrastructure',
      'Establish industry collaboration to address interdisciplinary challenges across diverse applications',
      'Inspire students to develop into ethical, innovative and entrepreneurial leaders through socially-centered programs',
    ],
    programs: [
      { name: 'B.Tech Computer Science & Engineering (Artificial Intelligence)', intake: 60 },
      { name: 'B.Tech Computer Science & Engineering (Data Science)', intake: 30 },
    ],
    coordinators: [
      { role: 'Academic Coordinator', name: 'Asha Rose Thomas' },
      { role: 'NAAC Coordinator', name: 'Siji Jose Pulluparambil' },
    ],
    labs: [
      { name: 'Turing Lab', focus: 'Machine Learning' },
      { name: 'Hinton Lab', focus: 'Deep Learning' },
      { name: 'Hamilton Lab', focus: 'Data Science' },
      { name: 'SI Lab', focus: 'Web3 & emerging technologies' },
    ],
    research: {
      patents: 5,
      journalPublications: 14,
      conferencePublications: 6,
      books: 6,
      fundedProjects: [
        {
          title: 'Digital networking for preventive/predictive environmental and climatic warning solutions',
          funder: 'MeitY, Government of India', amount: '₹2.99 Crore', year: 2023, duration: '3 years',
        },
        {
          title: 'VedantaYatra: Guided by Shankara app',
          funder: 'Sri Sri Jagadguru Shankaracharya Mahasamsthanam', amount: '₹10 Lakh', year: 2024, duration: '6 months',
        },
      ],
    },
    collaborations: [
      'Adya AI — Centre of Excellence in Generative AI (Jul 2025)',
      'IICT Germany (May 2025)',
      'Math, Talentfarm & T-Hub Hyderabad (May 2024)',
    ],
    clubs: ['AI Club', 'Data Science Club', 'IEEE Student Society', 'CSI', 'IEDC', 'ISTE'],
    addOnPrograms: [
      'Full-Stack MERN Application Development',
      'Google Gemini 2.0 Workshops',
      'Prompt Engineering with LaTeX',
      'Cloud and DevOps Fundamentals',
      'Robotics & Sensor Integration',
      'Cybersecurity Training',
    ],
    studentProjects: [
      { name: 'CEREBROMARK', detail: 'Automated large-scale attendance monitoring using face recognition' },
      { name: 'Campus Companion', detail: 'AI-powered campus information system' },
      { name: 'Shankarini', detail: 'AI-powered chatbot for campus information' },
      { name: 'Sign2Sound', detail: 'Sign language to speech conversion' },
      { name: 'MoodDecode', detail: 'Emotion detection system' },
      { name: 'Neural Orchard', detail: 'AI for predicting fruitful harvests in agriculture' },
    ],
    achievements: [
      "Winners — Ingenium AI Expo 2026, Tink-Her-Hack 4.0, THREADS'26 Hackathon, Tech Thrive 2.0",
      'Placements at TCS, Infosys, Innovature Software Labs, Anton Solutions and more',
      'Multiple GATE 2026 qualifiers',
      'Internships at IIT Ropar, ICFOSS, GP3 Cloud Innovations and more',
    ],
    signatureEvents: [
      "Prayag'25 — annual departmental tech fest",
      "THREADS'26 — national fashion-tech hackathon",
      'Transformative AI FDP (6-day faculty development program)',
    ],
  },
};
