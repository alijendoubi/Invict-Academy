export interface CreateLeadDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    interestedDegree?: string;
    interestedCountry?: string;
    destinationInterests?: string[];
    budgetRange?: string;
    timeline?: string;
    source?: string;
}

export const LeadsService = {
    create: async (data: CreateLeadDto) => {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to create lead');
        }
        return response.json();
    },

    findAll: async () => {
        const response = await fetch('/api/leads');
        if (!response.ok) {
            throw new Error('Failed to fetch leads');
        }
        return response.json();
    }
};
