import { api } from '../api';

export interface CreateLeadDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    interestedDegree?: string;
    interestedCountry?: string;
    source?: string;
}

export const LeadsService = {
    create: async (data: CreateLeadDto) => {
        const response = await api.post('/leads', data);
        return response.data;
    },

    findAll: async () => {
        const response = await api.get('/leads');
        return response.data;
    }
};
