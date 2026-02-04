// Mock data for frontend-only demo mode
// This provides realistic data without requiring a database

export const MOCK_USERS = {
  admin: {
    id: 'admin-demo-id-001',
    email: 'admin@invict.academy',
    password: '$2b$10$demo-hashed-password', // "demo123" hashed
    firstName: 'Demo',
    lastName: 'Administrator',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  student: {
    id: 'student-demo-id-001',
    email: 'student@invict.academy',
    password: '$2b$10$demo-hashed-password', // "demo123" hashed
    firstName: 'Demo',
    lastName: 'Student',
    role: 'STUDENT',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
};

export const MOCK_STUDENT_PROFILES = [
  {
    id: 'student-profile-001',
    userId: 'student-demo-id-001',
    status: 'IN_PROGRESS',
    readinessScore: 75,
    nationality: 'Tunisia',
    dateOfBirth: new Date('2000-05-15'),
    passportNumber: 'TN123456',
    phone: '+216 98 765 432',
    address: '123 Demo Street, Tunis',
    emergencyContact: '+216 98 000 000',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const MOCK_APPLICATIONS = [
  {
    id: 'app-001',
    studentId: 'student-profile-001',
    university: 'Technical University of Munich',
    program: 'Computer Science (M.Sc.)',
    country: 'Germany',
    status: 'IN_REVIEW',
    applicationDeadline: new Date('2024-07-15'),
    semesterStart: new Date('2024-10-01'),
    tuitionFee: 0,
    notes: 'Strong profile, good chances',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'app-002',
    studentId: 'student-profile-001',
    university: 'ETH Zurich',
    program: 'Data Science (M.Sc.)',
    country: 'Switzerland',
    status: 'SUBMITTED',
    applicationDeadline: new Date('2024-06-30'),
    semesterStart: new Date('2024-09-15'),
    tuitionFee: 1500,
    notes: 'Waiting for response',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: 'app-003',
    studentId: 'student-profile-001',
    university: 'TU Delft',
    program: 'Artificial Intelligence (M.Sc.)',
    country: 'Netherlands',
    status: 'DRAFT',
    applicationDeadline: new Date('2024-08-01'),
    semesterStart: new Date('2024-10-15'),
    tuitionFee: 2000,
    notes: 'Preparing documents',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const MOCK_DOCUMENTS = [
  {
    id: 'doc-001',
    studentId: 'student-profile-001',
    type: 'BACHELOR_DEGREE',
    name: 'Bachelor Degree Certificate',
    status: 'APPROVED',
    url: null,
    uploadedAt: new Date('2024-01-16'),
    reviewedAt: new Date('2024-01-17'),
    reviewNotes: 'Verified and approved',
  },
  {
    id: 'doc-002',
    studentId: 'student-profile-001',
    type: 'TRANSCRIPT',
    name: 'Academic Transcript',
    status: 'APPROVED',
    url: null,
    uploadedAt: new Date('2024-01-16'),
    reviewedAt: new Date('2024-01-17'),
    reviewNotes: 'Grades verified',
  },
  {
    id: 'doc-003',
    studentId: 'student-profile-001',
    type: 'PASSPORT',
    name: 'Passport Copy',
    status: 'APPROVED',
    url: null,
    uploadedAt: new Date('2024-01-16'),
    reviewedAt: new Date('2024-01-17'),
    reviewNotes: 'Valid until 2030',
  },
  {
    id: 'doc-004',
    studentId: 'student-profile-001',
    type: 'LANGUAGE_CERTIFICATE',
    name: 'IELTS Certificate',
    status: 'PENDING',
    url: null,
    uploadedAt: new Date('2024-02-01'),
    reviewedAt: null,
    reviewNotes: null,
  },
];

export const MOCK_LEADS = [
  {
    id: 'lead-001',
    firstName: 'Ahmed',
    lastName: 'Ben Ali',
    email: 'ahmed.benali@example.com',
    phone: '+216 98 111 222',
    country: 'Tunisia',
    interestedProgram: 'Engineering',
    status: 'NEW',
    source: 'WEBSITE',
    notes: 'Interested in German universities',
    createdAt: new Date('2024-02-03'),
    assignedTo: null,
  },
  {
    id: 'lead-002',
    firstName: 'Fatima',
    lastName: 'Mansouri',
    email: 'fatima.m@example.com',
    phone: '+216 98 333 444',
    country: 'Tunisia',
    interestedProgram: 'Medicine',
    status: 'CONTACTED',
    source: 'SOCIAL_MEDIA',
    notes: 'Follow up scheduled',
    createdAt: new Date('2024-02-02'),
    assignedTo: 'admin-demo-id-001',
  },
  {
    id: 'lead-003',
    firstName: 'Omar',
    lastName: 'Trabelsi',
    email: 'omar.t@example.com',
    phone: '+216 98 555 666',
    country: 'Tunisia',
    interestedProgram: 'Business Administration',
    status: 'QUALIFIED',
    source: 'REFERRAL',
    notes: 'High potential candidate',
    createdAt: new Date('2024-01-28'),
    assignedTo: 'admin-demo-id-001',
  },
  {
    id: 'lead-004',
    firstName: 'Sarah',
    lastName: 'Khediri',
    email: 'sarah.k@example.com',
    phone: '+216 98 777 888',
    country: 'Tunisia',
    interestedProgram: 'Data Science',
    status: 'CONVERTED',
    source: 'WEBSITE',
    notes: 'Converted to student',
    createdAt: new Date('2024-01-15'),
    assignedTo: 'admin-demo-id-001',
  },
];

export const MOCK_PAYMENTS = [
  {
    id: 'payment-001',
    studentId: 'student-profile-001',
    amount: 500,
    currency: 'EUR',
    status: 'SUCCESS',
    type: 'SERVICE_FEE',
    paymentMethod: 'CARD',
    transactionId: 'txn_demo_001',
    createdAt: new Date('2024-01-20'),
    paidAt: new Date('2024-01-20'),
  },
  {
    id: 'payment-002',
    studentId: 'student-profile-001',
    amount: 150,
    currency: 'EUR',
    status: 'SUCCESS',
    type: 'DOCUMENT_FEE',
    paymentMethod: 'CARD',
    transactionId: 'txn_demo_002',
    createdAt: new Date('2024-02-01'),
    paidAt: new Date('2024-02-01'),
  },
];

export const MOCK_SESSIONS = new Map();

export const MOCK_STATS = {
  admin: {
    totalLeads: MOCK_LEADS.length,
    activeStudents: MOCK_STUDENT_PROFILES.length,
    totalApplications: MOCK_APPLICATIONS.length,
    totalRevenue: MOCK_PAYMENTS.reduce((sum, p) => p.status === 'SUCCESS' ? sum + p.amount : sum, 0),
  },
  student: {
    applicationsCount: MOCK_APPLICATIONS.length,
    approvedDocuments: MOCK_DOCUMENTS.filter(d => d.status === 'APPROVED').length,
    totalDocuments: MOCK_DOCUMENTS.length,
  },
};

export const MOCK_CHAT_RESPONSES = [
  "Hello! I'm here to help you with your university application journey. What would you like to know?",
  "That's a great question! For German universities, you typically need a bachelor's degree with a good GPA, proof of language proficiency (German or English depending on the program), and your academic transcripts.",
  "The application process usually takes 2-4 weeks. We'll help you prepare all required documents and submit them before the deadline.",
  "Visa processing for Germany typically takes 6-8 weeks. We recommend applying as soon as you receive your admission letter.",
  "The cost varies by country. Germany has very low tuition fees (often free or under €500/semester), while countries like UK or Netherlands range from €8,000-€20,000 per year.",
  "Yes, many universities offer scholarships! DAAD (for Germany), Erasmus+, and university-specific scholarships are available. We can help you identify and apply for these.",
  "Language requirements vary by program. For English-taught programs, you'll need IELTS (6.5+) or TOEFL (90+). For German-taught programs, TestDaF or DSH certification is required.",
  "I'm here to assist you! Feel free to ask about admissions, requirements, deadlines, or any other questions about studying abroad.",
];

// Helper to get a random chat response
export const getRandomChatResponse = () => {
  return MOCK_CHAT_RESPONSES[Math.floor(Math.random() * MOCK_CHAT_RESPONSES.length)];
};
