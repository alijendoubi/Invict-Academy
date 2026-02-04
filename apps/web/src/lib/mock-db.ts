// Mock database client that mimics Prisma API
// This allows the app to work without a real database

import {
  MOCK_USERS,
  MOCK_STUDENT_PROFILES,
  MOCK_APPLICATIONS,
  MOCK_DOCUMENTS,
  MOCK_LEADS,
  MOCK_PAYMENTS,
  MOCK_SESSIONS,
} from './mock-data';

// Helper to simulate async operations
const asyncDelay = () => new Promise(resolve => setTimeout(resolve, 10));

// Helper to clone data to prevent mutations
const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

// Mock Prisma Client
export const mockPrisma = {
  user: {
    async findUnique({ where }: any) {
      await asyncDelay();
      const allUsers = Object.values(MOCK_USERS);
      const user = allUsers.find(u => 
        (where.id && u.id === where.id) || 
        (where.email && u.email === where.email)
      );
      return user ? clone(user) : null;
    },
    
    async findMany({ where }: any = {}) {
      await asyncDelay();
      let users = Object.values(MOCK_USERS);
      if (where?.role) {
        users = users.filter(u => u.role === where.role);
      }
      return clone(users);
    },
    
    async create({ data }: any) {
      await asyncDelay();
      const newUser = {
        id: `user-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // In a real scenario, we'd store this, but for demo it's temporary
      return clone(newUser);
    },
    
    async update({ where, data }: any) {
      await asyncDelay();
      const user = await this.findUnique({ where });
      if (!user) throw new Error('User not found');
      return clone({ ...user, ...data, updatedAt: new Date() });
    },
  },

  studentProfile: {
    async findUnique({ where, include }: any) {
      await asyncDelay();
      const profile = MOCK_STUDENT_PROFILES.find(p => 
        (where.id && p.id === where.id) || 
        (where.userId && p.userId === where.userId)
      );
      
      if (!profile) return null;
      
      const result: any = clone(profile);
      
      if (include?.applications) {
        result.applications = clone(MOCK_APPLICATIONS.filter(a => a.studentId === profile.id));
      }
      if (include?.documents) {
        result.documents = clone(MOCK_DOCUMENTS.filter(d => d.studentId === profile.id));
      }
      if (include?.user) {
        result.user = clone(MOCK_USERS.student);
      }
      
      return result;
    },
    
    async findMany({ where, include }: any = {}) {
      await asyncDelay();
      let profiles = clone(MOCK_STUDENT_PROFILES);
      
      if (include?.user) {
        profiles = profiles.map((p: any) => ({
          ...p,
          user: MOCK_USERS.student,
        }));
      }
      
      return profiles;
    },
    
    async count() {
      await asyncDelay();
      return MOCK_STUDENT_PROFILES.length;
    },
    
    async create({ data }: any) {
      await asyncDelay();
      const newProfile = {
        id: `profile-${Date.now()}`,
        ...data,
        status: 'NEW',
        readinessScore: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return clone(newProfile);
    },
  },

  application: {
    async findMany({ where, include }: any = {}) {
      await asyncDelay();
      let applications = clone(MOCK_APPLICATIONS);
      
      if (where?.studentId) {
        applications = applications.filter((a: any) => a.studentId === where.studentId);
      }
      
      if (include?.student) {
        applications = applications.map((a: any) => ({
          ...a,
          student: MOCK_STUDENT_PROFILES.find(p => p.id === a.studentId),
        }));
      }
      
      return applications;
    },
    
    async count() {
      await asyncDelay();
      return MOCK_APPLICATIONS.length;
    },
    
    async create({ data }: any) {
      await asyncDelay();
      const newApp = {
        id: `app-${Date.now()}`,
        ...data,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return clone(newApp);
    },
    
    async update({ where, data }: any) {
      await asyncDelay();
      const app = MOCK_APPLICATIONS.find(a => a.id === where.id);
      if (!app) throw new Error('Application not found');
      return clone({ ...app, ...data, updatedAt: new Date() });
    },
  },

  document: {
    async findMany({ where }: any = {}) {
      await asyncDelay();
      let documents = clone(MOCK_DOCUMENTS);
      
      if (where?.studentId) {
        documents = documents.filter((d: any) => d.studentId === where.studentId);
      }
      
      return documents;
    },
    
    async create({ data }: any) {
      await asyncDelay();
      const newDoc = {
        id: `doc-${Date.now()}`,
        ...data,
        status: 'PENDING',
        uploadedAt: new Date(),
        reviewedAt: null,
        reviewNotes: null,
      };
      return clone(newDoc);
    },
    
    async update({ where, data }: any) {
      await asyncDelay();
      const doc = MOCK_DOCUMENTS.find(d => d.id === where.id);
      if (!doc) throw new Error('Document not found');
      return clone({ ...doc, ...data });
    },
  },

  lead: {
    async findMany({ where, include, orderBy }: any = {}) {
      await asyncDelay();
      let leads = clone(MOCK_LEADS);
      
      if (where?.status) {
        leads = leads.filter((l: any) => l.status === where.status);
      }
      
      if (orderBy?.createdAt === 'desc') {
        leads.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      
      return leads;
    },
    
    async count() {
      await asyncDelay();
      return MOCK_LEADS.length;
    },
    
    async create({ data }: any) {
      await asyncDelay();
      const newLead = {
        id: `lead-${Date.now()}`,
        ...data,
        status: 'NEW',
        createdAt: new Date(),
        assignedTo: null,
      };
      return clone(newLead);
    },
    
    async update({ where, data }: any) {
      await asyncDelay();
      const lead = MOCK_LEADS.find(l => l.id === where.id);
      if (!lead) throw new Error('Lead not found');
      return clone({ ...lead, ...data });
    },
  },

  payment: {
    async findMany({ where }: any = {}) {
      await asyncDelay();
      let payments = clone(MOCK_PAYMENTS);
      
      if (where?.studentId) {
        payments = payments.filter((p: any) => p.studentId === where.studentId);
      }
      if (where?.status) {
        payments = payments.filter((p: any) => p.status === where.status);
      }
      
      return payments;
    },
    
    async aggregate({ _sum, where }: any) {
      await asyncDelay();
      let payments = MOCK_PAYMENTS;
      
      if (where?.status) {
        payments = payments.filter(p => p.status === where.status);
      }
      
      const result: any = {};
      if (_sum?.amount !== undefined) {
        result._sum = {
          amount: payments.reduce((sum, p) => sum + p.amount, 0),
        };
      }
      
      return result;
    },
    
    async create({ data }: any) {
      await asyncDelay();
      const newPayment = {
        id: `payment-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        paidAt: data.status === 'SUCCESS' ? new Date() : null,
      };
      return clone(newPayment);
    },
  },

  session: {
    async create({ data }: any) {
      await asyncDelay();
      const session = {
        id: `session-${Date.now()}`,
        ...data,
        createdAt: new Date(),
      };
      MOCK_SESSIONS.set(session.id, clone(session));
      return clone(session);
    },
    
    async findUnique({ where }: any) {
      await asyncDelay();
      const entries = Array.from(MOCK_SESSIONS.entries());
      for (const [id, session] of entries) {
        if (where.refreshToken && (session as any).refreshToken === where.refreshToken) {
          return clone(session);
        }
      }
      return null;
    },
    
    async delete({ where }: any) {
      await asyncDelay();
      MOCK_SESSIONS.delete(where.id);
      return { id: where.id };
    },
  },
};

// Type definition to match Prisma's structure
export type MockPrismaClient = typeof mockPrisma;
