// chatEngine — deterministic, keyword-grounded answers for "Ask Punch".
//
// This is NOT a language model: it's a small rule list matched against
// asietContent.js, the same facts shown in the detail panels. That's a
// deliberate choice for a reception kiosk — every answer is traceable to a
// verified fact, so Punch never invents a phone number or a deadline.
// Swapping this for a real LLM later (e.g. Claude) is a one-function change
// (see getResponse below) but needs an API key + network plan — see README.

import {
  institution, accreditations, leadership, contact, programs,
  facilities, innovationCenters, clubs, admissions, getCarouselSlides,
  facultyDirectory,
} from './asietContent.js';

function hasAny(query, words) {
  return words.some((w) => query.includes(w));
}

// Full department names/codes are specific enough to match safely with a
// plain substring check — deliberately excludes ambiguous 2-letter codes
// like "CE"/"ME" that collide with ordinary English ("me", "the").
const DEPT_ALIASES = {
  CE: ['civil'],
  CSE: ['computer science', 'cse'],
  AIDS: ['artificial intelligence', 'data science', 'ai&ds', 'ai & ds', 'aids'],
  ECE: ['electronics & communication', 'electronics and communication', 'ece'],
  EEE: ['electrical & electronics', 'electrical and electronics', 'eee'],
  EBE: ['biomedical', 'ebe'],
  ME: ['mechanical'],
  'R&A': ['robotics', 'automation'],
  MBA: ['business school', 'mba'],
  MCA: ['computer applications', 'mca'],
  BSH: ['basic science', 'humanities'],
};

function findDepartment(query) {
  return facultyDirectory.find((dept) => (DEPT_ALIASES[dept.key] || []).some((alias) => query.includes(alias)));
}

const rules = [
  {
    id: 'hod',
    // \bhod\b avoids matching "hod" inside ordinary words like "method".
    test: (q) => (/\bhod\b/.test(q) || hasAny(q, ['head of department', 'head of the department', 'who teaches', 'faculty', 'professor'])) && !!findDepartment(q),
    respond: (q) => {
      const dept = findDepartment(q);
      return `${dept.hod} is the Head of the ${dept.name} department, which has ${dept.members.length} faculty members. Find the full list under Academics & Programs on the home screen.`;
    },
  },
  {
    id: 'greeting',
    test: (q) => hasAny(q, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']),
    respond: () => "Hi, I'm Punch! Ask me about admissions, programs, campus facilities, events, or how to find your way around ASIET.",
  },
  {
    id: 'thanks',
    test: (q) => hasAny(q, ['thank', 'thanks', 'thank you']),
    respond: () => "You're welcome! Let me know if there's anything else you'd like to know about ASIET.",
  },
  {
    id: 'location',
    test: (q) => hasAny(q, ['where is asiet', 'address', 'location', 'directions', 'how to reach', 'how do i get']),
    respond: () => `ASIET is at ${institution.address}. It's ${institution.landmarks.join(' and ')}.`,
  },
  {
    id: 'library',
    test: (q) => hasAny(q, ['library', 'books', 'reading room']),
    respond: () => 'The Central Library at ASIET offers reference and digital sections with e-journals and e-resources. For current hours and membership, please check with the library counter.',
  },
  {
    id: 'hostel',
    test: (q) => hasAny(q, ['hostel', 'accommodation', 'stay on campus', 'dormitory']),
    respond: () => 'ASIET has separate Boys\' and Girls\' Hostels on campus. Visit the Admissions Office for hostel fees and allotment details.',
  },
  {
    id: 'departments',
    test: (q) => hasAny(q, ['department', 'branch', 'branches', 'b.tech', 'btech', 'courses', 'programs', 'programmes', 'engineering courses']),
    respond: () => `ASIET offers B.Tech in: ${programs.ug.map((p) => p.name).join(', ')}. At the postgraduate level there's M.Tech in ${programs.pg.map((p) => p.name).join(', ')}, plus ${programs.business.map((p) => p.name).join(' and ')}.`,
  },
  {
    id: 'phd',
    test: (q) => hasAny(q, ['phd', 'doctoral', 'doctorate', 'research program']),
    respond: () => `ASIET offers PhD programs in: ${programs.phd.join(', ')}.`,
  },
  {
    id: 'admissions',
    test: (q) => hasAny(q, ['admission', 'apply', 'how do i join', 'enroll', 'enrolment', 'enrollment', 'counselling', 'counseling']),
    respond: () => `${admissions.notes[0]} Apply at ${admissions.portal}, or call UG Admissions at ${contact.lines.find((l) => l.label === 'UG Admissions')?.value}.`,
  },
  {
    id: 'fees',
    test: (q) => hasAny(q, ['fee', 'fees', 'tuition', 'cost', 'scholarship']),
    respond: () => 'Fee structure and scholarship details vary by program and category — the Admissions Office can give you the current figures. Call ' + contact.lines.find((l) => l.label === 'UG Admissions')?.value + ' for UG, or visit the admissions portal.',
  },
  {
    id: 'placements',
    test: (q) => hasAny(q, ['placement', 'placements', 'job', 'recruit', 'package', 'salary']),
    respond: () => "I don't have verified placement statistics on hand right now — please check with the Training & Placement Cell or the latest figures on www.adishankara.ac.in.",
  },
  {
    id: 'principal',
    test: (q) => hasAny(q, ['principal', 'who runs', 'management', 'trustee', 'ceo', 'director']),
    respond: () => leadership.map((l) => `${l.name} — ${l.role}`).join('. ') + '.',
  },
  {
    id: 'contact',
    test: (q) => hasAny(q, ['contact', 'phone number', 'phone', 'call', 'email']),
    respond: () => `You can reach ASIET at ${contact.phones[0]} or email ${contact.email}.`,
  },
  {
    id: 'accreditation',
    test: (q) => hasAny(q, ['naac', 'nba', 'accredit', 'ranking', 'rank', 'aicte', 'ktu']),
    respond: () => accreditations.map((a) => a.label + (a.detail ? ` (${a.detail})` : '')).join('. ') + '.',
  },
  {
    id: 'innovation',
    test: (q) => hasAny(q, ['startup', 'incubat', 'innovation', 'fab lab', 'fablab', 'iedc', 'tbi']),
    respond: () => `ASIET's innovation ecosystem includes ${innovationCenters.map((c) => c.label).join(', ')}.`,
  },
  {
    id: 'clubs',
    test: (q) => hasAny(q, ['club', 'clubs', 'extracurricular', 'student activities']),
    respond: () => `ASIET has ${clubs.length}+ student clubs and chapters, including ${clubs.slice(0, 6).join(', ')} and more.`,
  },
  {
    id: 'events',
    test: (q) => hasAny(q, ['event', 'events', 'fest', 'happening', 'news', 'whats new', "what's new"]),
    respond: () => {
      const upcoming = getCarouselSlides(new Date()).filter((e) => e.kind === 'event');
      if (upcoming.length === 0) return 'There are no events on the calendar right now — check back soon.';
      return 'Coming up: ' + upcoming.map((e) => `${e.title} (${e.dateLabel})`).join(', ') + '.';
    },
  },
  {
    id: 'facilities',
    test: (q) => hasAny(q, ['facility', 'facilities', 'canteen', 'food', 'gym', 'atm', 'bank', 'wellness', 'clinic']),
    respond: () => `On campus you'll find ${facilities.map((f) => f.label).join(', ')}.`,
  },
  {
    id: 'who-are-you',
    test: (q) => hasAny(q, ['who are you', 'what are you', 'your name']),
    respond: () => "I'm Punch, ASIET's AI receptionist — here to help you find your way around campus, answer questions about admissions, academics and events.",
  },
];

const FALLBACK = `I don't have an exact answer for that yet. Please ask at the reception desk, call ${contact.phones[0]}, or visit ${institution.website} for more.`;

export function getResponse(rawQuery) {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return FALLBACK;
  const match = rules.find((r) => r.test(query));
  return match ? match.respond(query) : FALLBACK;
}

export const SUGGESTED_QUESTIONS = [
  { label: 'Where is the library?', icon: 'book-open' },
  { label: 'Who is the HOD of CSE?', icon: 'users' },
  { label: "What's the next college event?", icon: 'calendar' },
  { label: 'How do I apply for admission?', icon: 'clipboard-list' },
];
