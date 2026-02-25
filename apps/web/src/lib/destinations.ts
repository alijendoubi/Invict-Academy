// Comprehensive destinations data — auto-generated from deep research on Italian public universities
// Sources: MIUR, university official websites, HousingAnywhere, study.eu (2024/2025 academic year)

export interface Program {
    name: string;
    level: "Bachelor" | "Master" | "PhD";
    language: "English" | "Italian" | "Both";
    duration: string;
}

export interface University {
    slug: string;
    name: string;
    shortName?: string;
    founded: number;
    website: string;
    type: "Public" | "Private";
    worldRanking?: string;
    overview: string;
    strengths: string[];
    programs: Program[];
    admissionRequirements: {
        bachelor: string[];
        master: string[];
    };
    languageRequirements: {
        english: string;
        italian: string;
        notes: string;
    };
    scholarships: string[];
    applicationPortal: string;
}

export interface City {
    slug: string;
    name: string;
    region: string;
    population: string;
    overview: string;
    costOfLiving: {
        monthly: string;
        rent: string;
        food: string;
        transport: string;
        utilities: string;
        breakdown: { label: string; range: string }[];
    };
    accommodation: {
        types: string[];
        tips: string;
        averageRent: string;
        resources: string[];
    };
    studentLife: string;
    partTimeWork: string;
    safety: string;
    universities: University[];
}

export interface Country {
    slug: string;
    name: string;
    flag: string;
    capital: string;
    language: string;
    currency: string;
    overview: string;
    whyStudyHere: string[];
    generalInfo: {
        tuitionRange: string;
        scholarships: string;
        visaType: string;
        postStudyWork: string;
        studentPopulation: string;
    };
    cities: City[];
}

// ─────────────────────────────────────────────────────────────
// ITALY — Full Data
// ─────────────────────────────────────────────────────────────

const italy: Country = {
    slug: "italy",
    name: "Italy",
    flag: "🇮🇹",
    capital: "Rome",
    language: "Italian (English programs widely available)",
    currency: "Euro (€)",
    overview:
        "Italy is home to the world's oldest universities and offers world-class education at some of the lowest tuition fees in Europe. With hundreds of English-taught programs, generous DSU scholarships, and a rich cultural experience, Italy is one of the top destinations for international students in the world.",
    whyStudyHere: [
        "Tuition fees from €156/year at public universities",
        "DSU scholarships: up to €7,500/year + free canteen + free accommodation",
        "Hundreds of English-taught Bachelor's & Master's programs",
        "Schengen Area access — travel all of Europe freely",
        "1-year post-study work visa (Job Seeker Visa)",
        "Part-time work allowed: up to 20h/week during studies",
        "Bologna Process degrees — recognized worldwide",
        "No GMAT/GRE required at most universities",
    ],
    generalInfo: {
        tuitionRange: "€156 – €3,000/year (public universities)",
        scholarships: "DSU regional scholarships up to €7,500/year — income-based, highly accessible",
        visaType: "Type D Student Visa + Permesso di Soggiorno",
        postStudyWork: "1-year Job Search Visa after graduation",
        studentPopulation: "Over 500,000 international students",
    },
    cities: [
        // ─── ROME ────────────────────────────────────────────────────
        {
            slug: "rome",
            name: "Rome",
            region: "Lazio",
            population: "2.8 million",
            overview:
                "Rome is Italy's capital and one of the world's greatest cities — a living museum with world-class universities, a vibrant student life, and an unrivalled blend of ancient history and modern culture. It hosts the largest concentration of international students in Italy.",
            costOfLiving: {
                monthly: "€1,000 – €1,400/month",
                rent: "€400 – €900/month",
                food: "€150 – €250/month",
                transport: "€35/month (student pass)",
                utilities: "€50 – €100/month",
                breakdown: [
                    { label: "Shared Room / Student Residence", range: "€400 – €750" },
                    { label: "Private Studio Apartment", range: "€750 – €1,300" },
                    { label: "Monthly Food & Groceries", range: "€150 – €250" },
                    { label: "Public Transport (monthly)", range: "€35 (student)" },
                    { label: "Utilities & Internet", range: "€50 – €100" },
                    { label: "Leisure & Social", range: "€100 – €200" },
                ],
            },
            accommodation: {
                types: ["University dormitories (€250–€450/month)", "Shared apartments (€400–€750/month)", "Private studios (€750–€1,300/month)", "Student residences"],
                averageRent: "€550/month (shared room)",
                tips: "Apply for university housing early — DSU Lazio provides free accommodations for DSU scholarship holders. Neighborhoods like Pigneto, Ostiense, and Trastevere are popular with students.",
                resources: ["DSU Lazio (scholarships + housing)", "LaStanza.it", "Immobiliare.it", "Facebook Student Housing Rome groups"],
            },
            studentLife:
                "Rome has one of the most vibrant student scenes in the world. With over 200,000 students across its universities, you'll find student clubs, cultural events, sports facilities, and a social life second to none. The Erasmus community is enormous. Museums, galleries, and ancient sites are free or heavily discounted for students.",
            partTimeWork:
                "International students in Italy can work up to 20 hours/week during term and 40 hours/week during holiday periods. Common jobs for students in Rome include hospitality, tourism, tutoring, and restaurant work. Many universities also offer paid research positions.",
            safety:
                "Rome is generally a very safe city for students. Like any major city, be mindful in tourist-heavy areas (pickpocketing). Student neighborhoods are safe and well-connected by public transport. The city has active student support networks.",
            universities: [
                {
                    slug: "sapienza",
                    name: "Sapienza University of Rome",
                    shortName: "Sapienza",
                    founded: 1303,
                    website: "https://www.uniroma1.it",
                    type: "Public",
                    worldRanking: "Top 150 globally (QS 2024)",
                    overview:
                        "Founded in 1303, Sapienza is the largest university in Europe by enrollment (~110,000 students) and one of the oldest in the world. It is a comprehensive research university covering sciences, humanities, engineering, medicine, law, architecture, and economics. Sapienza consistently ranks among the top universities globally and is highly prestigious for international students.",
                    strengths: ["Engineering", "Computer Science", "Medicine", "Architecture", "Law", "Economics", "Physics", "History"],
                    programs: [
                        { name: "Computer Science", level: "Master", language: "English", duration: "2 years" },
                        { name: "Data Science", level: "Master", language: "English", duration: "2 years" },
                        { name: "Mechanical Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Energy Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Business Management", level: "Master", language: "English", duration: "2 years" },
                        { name: "International Relations", level: "Master", language: "English", duration: "2 years" },
                        { name: "Physics", level: "Master", language: "English", duration: "2 years" },
                        { name: "Civil Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Communication, Technology & International Cultures", level: "Master", language: "English", duration: "2 years" },
                        { name: "Statistics & Actuarial Science", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: [
                            "High school diploma (12 years of schooling) equivalent to Italian Maturità",
                            "CIMEA/Declaration of Value (DoV) for foreign diplomas",
                            "Language certificate (Italian B2 for Italian programs)",
                            "Pre-enrollment via Universitaly portal",
                            "Some faculties require entrance exams (TOLC)",
                        ],
                        master: [
                            "Bachelor's degree in a relevant field (min. 3 years)",
                            "Minimum GPA of 75/100 or equivalent (2.8/4.0 GPA)",
                            "English proficiency: IELTS 6.0 minimum (or TOEFL 79+)",
                            "CIMEA recognition of foreign degree",
                            "CV and motivation letter for some programs",
                            "Pre-selection application (open Oct–Apr for September intake)",
                        ],
                    },
                    languageRequirements: {
                        english: "IELTS 6.0 (no band below 5.5) or TOEFL iBT 79+",
                        italian: "B2 level (CILS / CELI) for Italian-taught programs",
                        notes: "MOI (Medium of Instruction) letters are NOT accepted by Sapienza. An internationally recognized test is required.",
                    },
                    scholarships: [
                        "DSU Lazio Scholarship: up to €7,500/year + free canteen + free accommodation (income-based)",
                        "Sapienza Merit Scholarship (Borse di Studio di Ateneo)",
                        "MAECI Italian Government Scholarships for international students",
                        "Erasmus+ (for EU exchange and incoming students)",
                    ],
                    applicationPortal: "https://www.uniroma1.it/en/pagina/international-students",
                },
                {
                    slug: "tor-vergata",
                    name: "University of Rome Tor Vergata",
                    shortName: "Tor Vergata",
                    founded: 1982,
                    website: "https://www.uniroma2.it",
                    type: "Public",
                    worldRanking: "Top 500 globally (QS 2024)",
                    overview:
                        "Tor Vergata is a modern research university renowned for high student satisfaction and excellent employment outcomes. It has strong faculties in engineering, economics, medicine, and sciences. It offers a growing portfolio of English-taught international programs and is known for its innovative teaching approach and close links with industry.",
                    strengths: ["Engineering", "Economics", "Medicine & Surgery", "Science", "Law", "Pharmacy"],
                    programs: [
                        { name: "Biomedical Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Electronic Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Economics & Finance", level: "Master", language: "English", duration: "2 years" },
                        { name: "Business Administration", level: "Master", language: "English", duration: "2 years" },
                        { name: "Computer Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Astrophysics & Cosmology", level: "Master", language: "English", duration: "2 years" },
                        { name: "Global Legal Studies", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: [
                            "High school diploma with 12 years of schooling",
                            "Declaration of Value or CIMEA recognition",
                            "Pre-enrollment via Universitaly portal",
                            "Language certificate (Italian B2 for Italian programs)",
                        ],
                        master: [
                            "Relevant Bachelor's degree (min. 3 years)",
                            "Minimum academic grade of 75% in previous degree",
                            "IELTS 6.0 (no individual band below 5.5) or TOEFL 79+",
                            "CIMEA recognition of foreign degree",
                            "Statement of purpose and CV",
                        ],
                    },
                    languageRequirements: {
                        english: "IELTS 6.0 minimum (no band below 5.5) or TOEFL iBT 79+",
                        italian: "B2 level certificate for Italian programs",
                        notes: "Foundation Course available in English for students who don't meet the 12-year schooling requirement.",
                    },
                    scholarships: [
                        "DSU Lazio Scholarship: up to €7,500/year (income-based)",
                        "MAECI Italian Government Scholarships",
                        "University Merit Scholarships",
                        "Erasmus+ Mobility Grants",
                    ],
                    applicationPortal: "https://www.uniroma2.it/en/international/",
                },
                {
                    slug: "roma-tre",
                    name: "Roma Tre University",
                    shortName: "Roma Tre",
                    founded: 1992,
                    website: "https://www.uniroma3.it",
                    type: "Public",
                    worldRanking: "Top 650 globally (QS 2024)",
                    overview:
                        "Roma Tre is a modern, dynamic university with a strong international outlook and an innovative approach to teaching. It is particularly well-regarded for architecture, engineering, economics, and political sciences, offering a welcoming environment for international students. The university is known for smaller class sizes and personal attention compared to larger Roman universities.",
                    strengths: ["Architecture", "Engineering", "Political Science", "Economics", "Law", "Humanities"],
                    programs: [
                        { name: "Architecture — Conservation and Restoration", level: "Master", language: "English", duration: "2 years" },
                        { name: "Global Legal Studies", level: "Master", language: "English", duration: "2 years" },
                        { name: "Artificial Intelligence & Robotics", level: "Master", language: "English", duration: "2 years" },
                        { name: "Economics: Finance, Markets and Intermediaries", level: "Master", language: "English", duration: "2 years" },
                        { name: "International Studies", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: [
                            "High school diploma (12 years of education) + CIMEA/DoV",
                            "Pre-enrollment via Universitaly",
                            "Some programs require entrance exam",
                        ],
                        master: [
                            "Relevant Bachelor's degree with min. 3 years",
                            "Minimum GPA of 101/110 (Italian scale) or equivalent",
                            "English B2 minimum (IELTS 5.5–6.5 depending on program)",
                            "CV and motivation letter",
                            "Online interview for some programs",
                        ],
                    },
                    languageRequirements: {
                        english: "B2 level — IELTS 5.5 to 6.5 depending on program",
                        italian: "B2 level for Italian-taught programs",
                        notes: "Some master's programs also accept MOI letters. Interview in English may be required.",
                    },
                    scholarships: [
                        "DSU Lazio Scholarship: up to €7,500/year",
                        "University Merit Bursaries",
                        "MAECI Government Scholarships",
                    ],
                    applicationPortal: "https://www.uniroma3.it/en/international-students/",
                },
            ],
        },

        // ─── MILAN ───────────────────────────────────────────────────
        {
            slug: "milan",
            name: "Milan",
            region: "Lombardy",
            population: "1.4 million",
            overview:
                "Milan is Italy's economic capital and the global center of fashion and design. It is also a leading student city, home to some of Italy's most prestigious universities. With a thriving job market and innovation ecosystem, Milan is the ideal destination for students in engineering, design, business, and technology.",
            costOfLiving: {
                monthly: "€1,100 – €1,800/month",
                rent: "€500 – €1,000/month",
                food: "€200 – €300/month",
                transport: "€22/month (student ATM pass)",
                utilities: "€80 – €130/month",
                breakdown: [
                    { label: "Shared Room / Student Residence", range: "€500 – €850" },
                    { label: "Private Studio Apartment", range: "€800 – €1,300" },
                    { label: "Monthly Food & Groceries", range: "€200 – €300" },
                    { label: "Public Transport (monthly)", range: "€22 (student)" },
                    { label: "Utilities & Internet", range: "€80 – €130" },
                    { label: "Leisure & Social", range: "€150 – €250" },
                ],
            },
            accommodation: {
                types: ["University dormitories (€300–€500/month)", "Shared apartments (€500–€850/month)", "Private studios (€800–€1,300/month)"],
                averageRent: "€650/month (shared room)",
                tips: "Milan is the most expensive Italian student city. Apply for university accommodation and DSU Lombardia housing early. Consider areas like Navigli, Bovisa (near Politecnico), or Sesto San Giovanni.",
                resources: ["DSU Lombardia", "Politecnico Housing Office", "Idealista.it", "Uniplaces"],
            },
            studentLife:
                "Milan has a world-class student life with an enormous Erasmus community. Fashion weeks, design fairs, startup events, and international networking opportunities. The city has excellent sports facilities, cultural venues, and nightlife.",
            partTimeWork:
                "Milan has the strongest job market in Italy. Students can work in fashion, retail, hospitality, and tech startups. Many Politecnico and Bocconi students find internships and part-time research roles. English is widely spoken in professional environments.",
            safety:
                "Milan is one of Italy's safest major cities. Student areas like Bovisa and Città Studi are very safe. The metro is efficient and well-monitored.",
            universities: [
                {
                    slug: "politecnico-milano",
                    name: "Politecnico di Milano",
                    shortName: "PoliMi",
                    founded: 1863,
                    website: "https://www.polimi.it",
                    type: "Public",
                    worldRanking: "Top 20 globally for Engineering & Design (QS 2024)",
                    overview:
                        "Politecnico di Milano is Italy's premier technical university and ranks among the world's top 20 universities for Engineering, Architecture, and Design. With 42,000 students and a powerful industry network, PoliMi produces graduates sought by the world's leading companies. It is particularly renowned for combining rigorous engineering education with creative Italian design thinking.",
                    strengths: ["Engineering", "Architecture", "Industrial Design", "Computer Science", "Data Science", "Aerospace", "Civil Engineering"],
                    programs: [
                        { name: "Computer Science & Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Data Science & Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Artificial Intelligence & Machine Learning", level: "Master", language: "English", duration: "2 years" },
                        { name: "Electronic Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Mechanical Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Aerospace Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Civil Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Architecture — Built Environment — Interiors", level: "Master", language: "English", duration: "2 years" },
                        { name: "Product Service System Design", level: "Master", language: "English", duration: "2 years" },
                        { name: "Telecommunications Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Management Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Energy Engineering", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: [
                            "High school diploma with strong STEM subjects",
                            "Must pass OFA (educational debt modules) if admitted",
                            "CIMEA recognition of foreign diploma",
                            "Pre-enrollment via Universitaly",
                        ],
                        master: [
                            "Bachelor's degree in Engineering, Architecture, or Design (relevant field)",
                            "Strong academic record — recommended GPA 80+/100",
                            "IELTS 6.5 minimum (or TOEFL 90+) — most programs are English",
                            "Online application via Polimi's apply.polimi.it portal",
                            "Motivation letter and CV required",
                            "Some programs require entrance exam (MathUp) or interview",
                        ],
                    },
                    languageRequirements: {
                        english: "IELTS 6.5 (no band below 6.0) or TOEFL iBT 90+",
                        italian: "B1/B2 Italian useful but not required for English programs",
                        notes: "All MSc programs at PoliMi are taught in English. Some programs are highly competitive with limited seats.",
                    },
                    scholarships: [
                        "DSU Lombardia: up to €7,500/year + free accommodation (income-based — VERY accessible)",
                        "Politecnico Merit Scholarship (up to full tuition waiver)",
                        "International Excellence Awards",
                        "MAECI Italian Government Scholarship",
                        "Erasmus+ Mobility Grants",
                    ],
                    applicationPortal: "https://apply.polimi.it",
                },
                {
                    slug: "universita-milano",
                    name: "University of Milan",
                    shortName: "UniMi",
                    founded: 1924,
                    website: "https://www.unimi.it",
                    type: "Public",
                    worldRanking: "Top 250 globally (QS 2024)",
                    overview:
                        "The University of Milan is one of Italy's largest comprehensive universities and a leading research institution. It covers sciences, medicine, pharmacy, humanities, economics, law, and social sciences. Particularly strong in life sciences, political science, and interdisciplinary research.",
                    strengths: ["Life Sciences", "Medicine", "Law", "Economics", "Humanities", "Political Science", "Pharmacy"],
                    programs: [
                        { name: "Bioinformatics", level: "Master", language: "English", duration: "2 years" },
                        { name: "Data Science & Economics", level: "Master", language: "English", duration: "2 years" },
                        { name: "European Public Policy", level: "Master", language: "English", duration: "2 years" },
                        { name: "Food Sciences", level: "Master", language: "English", duration: "2 years" },
                        { name: "Molecular Biotechnology", level: "Master", language: "English", duration: "2 years" },
                        { name: "Sciences & Technology of Clinical Nutrition", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: [
                            "High school diploma with 12 years of schooling",
                            "CIMEA/DoV for foreign qualifications",
                            "Pre-enrollment via Universitaly",
                            "Some programs require entrance test (TOLC)",
                        ],
                        master: [
                            "Bachelor's degree in relevant field",
                            "Minimum GPA 75/100 or equivalent",
                            "IELTS 6.0 or TOEFL 80+ for English programs",
                            "Motivation letter + CV",
                        ],
                    },
                    languageRequirements: {
                        english: "IELTS 6.0 or TOEFL iBT 80+",
                        italian: "B2 Italian for Italian programs",
                        notes: "English programs rapidly growing — check specific program requirements on university website.",
                    },
                    scholarships: [
                        "DSU Lombardia: up to €7,500/year",
                        "UniMi Excellence Scholarships",
                        "MAECI Government Scholarships",
                    ],
                    applicationPortal: "https://www.unimi.it/en/study/student-services/international-students",
                },
            ],
        },

        // ─── BOLOGNA ─────────────────────────────────────────────────
        {
            slug: "bologna",
            name: "Bologna",
            region: "Emilia-Romagna",
            population: "400,000",
            overview:
                "Bologna is Italy's ultimate student city — home to the world's oldest university and one of the highest concentrations of students per capita in Europe. With exceptional food, a medieval arcade-lined city center, and a long intellectual tradition, Bologna offers the perfect balance of academic excellence and student life.",
            costOfLiving: {
                monthly: "€800 – €1,200/month",
                rent: "€350 – €700/month",
                food: "€150 – €250/month",
                transport: "€30/month",
                utilities: "€60 – €100/month",
                breakdown: [
                    { label: "Shared Room / Student Residence", range: "€350 – €600" },
                    { label: "Private Studio Apartment", range: "€600 – €1,000" },
                    { label: "Monthly Food & Groceries", range: "€150 – €250" },
                    { label: "Public Transport (monthly)", range: "€30" },
                    { label: "Utilities & Internet", range: "€60 – €100" },
                    { label: "Leisure & Social", range: "€100 – €180" },
                ],
            },
            accommodation: {
                types: ["University residences (€250–€450/month)", "Shared apartments (€350–€600/month)", "Private studios (€600–€1,000/month)"],
                averageRent: "€450/month (shared room)",
                tips: "Bologna is more affordable than Rome or Milan. DSU Emilia-Romagna offers excellent housing support for scholarship holders. Popular student areas: Zona Universitaria (city center), Irnerio, Porto.",
                resources: ["DSU Emilia-Romagna (ER.GO)", "Unibo Student Housing", "Kijiji.it", "Posti Letto student groups"],
            },
            studentLife:
                "Bologna is legendary for student life in Italy. The 'Bologna Student Spirit' is famous worldwide. Over 86,000 students in a city of 400,000. Incredible food scene (birthplace of Bolognese sauce, mortadella), live music, aperitivo culture, and a politically engaged student community.",
            partTimeWork:
                "Bologna has a growing economic hub. Students work in food and hospitality, tourism, retail, and academic research. The university's ER.GO scholarship system means many students have their costs covered without needing to work.",
            safety:
                "Bologna is considered one of Italy's safest cities. It is very student-friendly and the historic center is extremely walkable and well-monitored.",
            universities: [
                {
                    slug: "unibo",
                    name: "University of Bologna",
                    shortName: "Unibo",
                    founded: 1088,
                    website: "https://www.unibo.it",
                    type: "Public",
                    worldRanking: "Top 200 globally (QS 2024)",
                    overview:
                        "Founded in 1088, the University of Bologna is the oldest university in the world and remains one of Europe's most prestigious. Known as the 'Alma Mater Studiorum', it covers all disciplines and is a global leader in research. It was foundational in creating the European university system and the Bologna Process (European higher education framework). Unibo has campuses in 5 Italian cities and a strong international presence.",
                    strengths: ["Law", "Medicine", "Engineering", "Humanities", "Agriculture", "Economics", "Computer Science", "Political Science"],
                    programs: [
                        { name: "Advanced Automotive Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Computer Science", level: "Master", language: "English", duration: "2 years" },
                        { name: "Artificial Intelligence", level: "Master", language: "English", duration: "2 years" },
                        { name: "International Relations & Global Affairs", level: "Master", language: "English", duration: "2 years" },
                        { name: "Data Science", level: "Master", language: "English", duration: "2 years" },
                        { name: "Economics", level: "Master", language: "English", duration: "2 years" },
                        { name: "Environmental Management of Ecosystems", level: "Master", language: "English", duration: "2 years" },
                        { name: "Civil Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Pharmaceutical Biotechnology", level: "Master", language: "English", duration: "2 years" },
                        { name: "Tourism Economics and Management", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: [
                            "High school diploma equivalent to Italian Maturità (12 years)",
                            "CIMEA/DoV document recognition",
                            "Pre-enrollment via Universitaly portal",
                            "Entrance exam required for some faculties (Medicine, Law)",
                        ],
                        master: [
                            "Bachelor's degree in relevant discipline",
                            "Academic record of 75/100 or equivalent",
                            "IELTS 6.0 minimum or TOEFL 79+ for English programs",
                            "Online application via AlmaRM portal",
                            "Motivation letter and CV",
                            "Some competitive programs have GPA cutoff and interviews",
                        ],
                    },
                    languageRequirements: {
                        english: "IELTS 6.0 or TOEFL iBT 79+ for English programs",
                        italian: "B2 Italian for Italian-taught programs",
                        notes: "Unibo accepts MOI letters for some programs. Check program-specific page. Application deadlines: typically February–April for September intake.",
                    },
                    scholarships: [
                        "ER.GO DSU Scholarship: up to €7,500/year + free housing + free canteen (income-based — very accessible)",
                        "Unibo Merit Scholarship (Studio e Merito)",
                        "MAECI Italian Government Scholarship",
                        "Erasmus+ Mobility Grants",
                        "International Excellence Fellowships",
                    ],
                    applicationPortal: "https://studyinitaly.esteri.it (pre-enrollment) + AlmaRM portal",
                },
            ],
        },

        // ─── FLORENCE ────────────────────────────────────────────────
        {
            slug: "florence",
            name: "Florence",
            region: "Tuscany",
            population: "360,000",
            overview:
                "Florence (Firenze) is the cradle of the Renaissance and one of the most beautiful cities in the world. It is a globally recognized art and culture hub, home to Uffizi Gallery, Michelangelo's David, and centuries of artistic heritage. For students, it offers a uniquely inspiring academic environment, particularly in arts, architecture, fashion, and humanities.",
            costOfLiving: {
                monthly: "€900 – €1,300/month",
                rent: "€350 – €750/month",
                food: "€150 – €250/month",
                transport: "€25/month",
                utilities: "€60 – €120/month",
                breakdown: [
                    { label: "Shared Room / Student Residence", range: "€350 – €600" },
                    { label: "Private Studio Apartment", range: "€650 – €1,000" },
                    { label: "Monthly Food & Groceries", range: "€150 – €250" },
                    { label: "Public Transport (monthly)", range: "€25" },
                    { label: "Utilities & Internet", range: "€60 – €120" },
                    { label: "Leisure & Social", range: "€120 – €200" },
                ],
            },
            accommodation: {
                types: ["University residences (€250–€450/month)", "Shared apartments (€350–€600/month)", "Private studios (€650–€1,000/month)"],
                averageRent: "€500/month (shared room)",
                tips: "Apply early — Florence is popular with international students. DSU Toscana offers housing grants. Neighborhoods like Oltrarno, Campo di Marte, and Novoli are student-friendly.",
                resources: ["DSU Toscana", "Unifi Housing", "Erasmus in Florence Facebook groups", "Immobiliare.it"],
            },
            studentLife:
                "Florence has a unique, intimate student atmosphere. World-class museums at student discounts, art workshops, cultural festivals, Aperitivo spritz culture in the evenings. The city is walkable and safe. Strong international student community — particularly American and North African students.",
            partTimeWork:
                "Tourism industry offers strong part-time opportunities: tour guiding, hospitality, retail. Seasonal summer work is also available. The fashion industry has occasional internship and assistant opportunities.",
            safety:
                "Florence is very safe for students. It is a tourist city with heavy police presence in the center. Student neighborhoods are calm and peaceful.",
            universities: [
                {
                    slug: "firenze",
                    name: "University of Florence",
                    shortName: "UniFI",
                    founded: 1321,
                    website: "https://www.unifi.it",
                    type: "Public",
                    worldRanking: "Top 400 globally (QS 2024)",
                    overview:
                        "The University of Florence is one of Italy's largest and most comprehensive universities, with over 50,000 students. It has a long history of academic excellence, spanning arts, sciences, engineering, social sciences, and medicine. The university is particularly known for its interdisciplinary approach and close ties with Tuscany's cultural and business heritage.",
                    strengths: ["Architecture", "Agronomy & Forestry", "Engineering", "Humanities", "Economics", "Political Science", "Arts"],
                    programs: [
                        { name: "European Master in Lexicography", level: "Master", language: "English", duration: "2 years" },
                        { name: "Environmental Engineering", level: "Master", language: "Both", duration: "2 years" },
                        { name: "Economics and Development", level: "Master", language: "English", duration: "2 years" },
                        { name: "Advanced Automotive Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Cybersecurity", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: [
                            "High school diploma with 12 years (CIMEA/DoV required)",
                            "Pre-enrollment via Universitaly",
                            "Entrance exam for some faculties",
                        ],
                        master: [
                            "Bachelor's degree in relevant field",
                            "Minimum 75/100 GPA",
                            "IELTS 6.0 or TOEFL 79+ for English programs",
                            "Motivation letter + CV",
                        ],
                    },
                    languageRequirements: {
                        english: "IELTS 6.0 or TOEFL iBT 79+",
                        italian: "B2 Italian for Italian programs",
                        notes: "Many programs still primarily in Italian — verify English availability per program.",
                    },
                    scholarships: [
                        "DSU Toscana: up to €7,500/year + housing",
                        "MAECI Italian Government Scholarship",
                        "University Grant Programs",
                    ],
                    applicationPortal: "https://www.unifi.it/en/international",
                },
            ],
        },

        // ─── PISA ────────────────────────────────────────────────────
        {
            slug: "pisa",
            name: "Pisa",
            region: "Tuscany",
            population: "91,000",
            overview:
                "Pisa is one of Italy's most famous student cities — far more than just the Leaning Tower. It is home to some of the most prestigious universities in Italy, including the University of Pisa and the elite Scuola Normale Superiore. Despite its small size, Pisa punches far above its weight academically. It is affordable, safe, and incredibly student-friendly.",
            costOfLiving: {
                monthly: "€700 – €1,000/month",
                rent: "€250 – €600/month",
                food: "€120 – €200/month",
                transport: "€20/month",
                utilities: "€50 – €90/month",
                breakdown: [
                    { label: "Shared Room / Student Residence", range: "€250 – €450" },
                    { label: "Private Studio Apartment", range: "€600 – €800" },
                    { label: "Monthly Food & Groceries", range: "€120 – €200" },
                    { label: "Public Transport (monthly)", range: "€20" },
                    { label: "Utilities & Internet", range: "€50 – €90" },
                    { label: "Leisure & Social", range: "€80 – €150" },
                ],
            },
            accommodation: {
                types: ["University residences (€150–€350/month)", "Shared apartments (€250–€450/month)", "Private studios (€500–€800/month)"],
                averageRent: "€350/month (shared room)",
                tips: "Pisa is the most affordable major student city in Italy. The DSU Toscana here is excellent. The whole city is compact and bike-friendly — most students cycle everywhere.",
                resources: ["DSU Toscana (Pisa)", "Unipi Accommodation Office", "StudentVille Pisa", "Facebook Pisa Affitti Studenti"],
            },
            studentLife:
                "Pisa is a genuine student city — approximately 50,000 students in a city of 90,000. This means the whole economy revolves around students. There are countless student bars, clubs, and associations. Lungarno (the riverside walk) is the social heart of student life.",
            partTimeWork:
                "Limited in volume but high in student-friendly terms. Hospitality, tourism (Leaning Tower area), academic research assistantships, and tutoring are common. The cost of living is so low that part-time work needs are minimal, especially with DSU scholarship.",
            safety:
                "Pisa is extremely safe — one of Italy's safest student cities. It's compact, walkable, and has an active student community that makes it feel very welcoming.",
            universities: [
                {
                    slug: "unipi",
                    name: "University of Pisa",
                    shortName: "UniPi",
                    founded: 1343,
                    website: "https://www.unipi.it",
                    type: "Public",
                    worldRanking: "Top 350 globally (QS 2024)",
                    overview:
                        "Founded in 1343, the University of Pisa is one of the oldest and most prestigious universities in Italy. It produced Galileo Galilei as both a student and professor. Today it is particularly renowned for engineering, computer science, mathematics, physics, and natural sciences. It has strong connections with the nearby Scuola Normale Superiore and the Sant'Anna School of Advanced Studies — making Pisa a genuine academic ecosystem.",
                    strengths: ["Engineering", "Computer Science", "Mathematics", "Physics", "Natural Sciences", "Medicine", "Veterinary"],
                    programs: [
                        { name: "Computer Science", level: "Master", language: "English", duration: "2 years" },
                        { name: "Computer Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Artificial Intelligence & Data Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Telecommunications Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Mechanical Engineering", level: "Master", language: "English", duration: "2 years" },
                        { name: "Business Informatics", level: "Master", language: "English", duration: "2 years" },
                        { name: "Marine Biology & Ecology", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: [
                            "High school diploma with 12 years of schooling + CIMEA/DoV",
                            "Pre-enrollment via Universitaly portal (open Jan–March for September intake)",
                            "Entrance exam for Medicine, Pharmacy, Architecture",
                        ],
                        master: [
                            "Bachelor's degree in relevant field",
                            "Academic record of 75–80/100 or equivalent",
                            "IELTS 6.0 or TOEFL 79+ for English-taught programs",
                            "Motivation letter, CV, and references",
                            "Online interview for competitive programs",
                        ],
                    },
                    languageRequirements: {
                        english: "IELTS 6.0 (no band below 5.5) or TOEFL iBT 79+",
                        italian: "B2 Italian for Italian programs",
                        notes: "University of Pisa is expanding English programs rapidly. DSU Toscana here covers accommodation from €150/month for eligible students.",
                    },
                    scholarships: [
                        "DSU Toscana: up to €7,500/year + near-free accommodation (€150-350/month for scholarship holders)",
                        "Unipi Merit Scholarships",
                        "MAECI Italian Government Scholarship",
                        "Erasmus+ Mobility Grants",
                    ],
                    applicationPortal: "https://www.unipi.it/index.php/english",
                },
            ],
        },

        // ─── TURIN ───────────────────────────────────────────────────
        {
            slug: "turin", name: "Turin", region: "Piedmont", population: "870,000",
            overview: "Turin (Torino) — automotive & tech capital with Politecnico di Torino, ranked top 25 globally for Engineering. World-class academics at affordable northern-Italy prices.",
            costOfLiving: {
                monthly: "€850 – €1,200/month", rent: "€300 – €700/month", food: "€150 – €230/month", transport: "€27/month", utilities: "€60 – €120/month",
                breakdown: [{ label: "Shared Room", range: "€300 – €600" }, { label: "Private Studio", range: "€600 – €950" }, { label: "Food & Groceries", range: "€150 – €230" }, { label: "Transport", range: "€27 (student)" }, { label: "Utilities & Internet", range: "€60 – €120" }, { label: "Leisure", range: "€100 – €200" }]
            },
            accommodation: { types: ["PoliTo residences (€220–€450/mo)", "Shared apartments (€300–€600/mo)", "Private studios (€600–€950/mo)"], averageRent: "€420/month", tips: "DSU Piemonte grants excellent housing support. Student areas: San Salvario, Vanchiglia, Lingotto. Apply via PoliTo housing portal early.", resources: ["DSU Piemonte", "PoliTo Housing", "Immobiliare.it"] },
            studentLife: "100,000+ students. Legendary aperitivo culture, Egyptian Museum, Mole Antonelliana, Juventus culture, growing startup scene.",
            partTimeWork: "Strong opportunities in automotive (Stellantis/Fiat HQ), tech, hospitality. Engineering students often secure paid internships.",
            safety: "One of Italy's safest major cities. Student areas calm and well-connected.",
            universities: [{
                slug: "politecnico-torino", name: "Politecnico di Torino", shortName: "PoliTo", founded: 1859, website: "https://www.polito.it", type: "Public",
                worldRanking: "Top 25 globally for Engineering & Technology (QS 2024)",
                overview: "Top 25 globally for Engineering & Technology (QS). 37,000 students, deep ties to automotive and aerospace. All MSc programs in English. €50 application fee.",
                strengths: ["Engineering", "Aerospace", "Automotive", "Energy", "Computer Science", "Architecture", "ICT"],
                programs: [
                    { name: "Computer Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Electronic Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Mechanical Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Aerospace Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Automotive Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Data Science & Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Energy & Nuclear Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "ICT for Smart Societies", level: "Master", language: "English", duration: "2 years" },
                    { name: "Biomedical Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Architecture Construction City", level: "Master", language: "English", duration: "2 years" },
                ],
                admissionRequirements: {
                    bachelor: ["High school diploma (12 years) + TIL online admission test", "CIMEA/DoV for foreign diplomas", "English B2 (IELTS 6.0)", "Pre-enrollment via Universitaly", "€50 application fee"],
                    master: ["Bachelor's in Engineering or relevant field", "GPA 80/100 recommended", "IELTS 6.0 (B2) or TOEFL 79+ or Cambridge B2", "CV, degree + transcripts, syllabi, language cert", "Apply via Apply@polito", "€50 fee"],
                },
                languageRequirements: { english: "IELTS 6.0 (B2) or TOEFL 79+ or Cambridge B2", italian: "B2 for Italian programs", notes: "All MSc in English. MOI letters may be accepted — confirm per program." },
                scholarships: ["DSU Piemonte: up to €7,500/year + housing", "PoliTo Excellence Awards", "MAECI Italian Government Scholarships", "Erasmus+ Grants", "Industry scholarships (Fiat, ENI, Leonardo)"],
                applicationPortal: "https://apply.polito.it",
            }],
        },

        // ─── PADUA ───────────────────────────────────────────────────
        {
            slug: "padua", name: "Padua", region: "Veneto", population: "214,000",
            overview: "Padua (Padova) — Italy's second oldest university (1222), ranked 4th in Italy by QS. Famous for the world's first anatomical theatre and Galileo's lectern. Lively student city 30 min from Venice.",
            costOfLiving: {
                monthly: "€750 – €1,100/month", rent: "€300 – €650/month", food: "€130 – €220/month", transport: "€30/month", utilities: "€55 – €100/month",
                breakdown: [{ label: "Shared Room", range: "€300 – €550" }, { label: "Private Studio", range: "€600 – €950" }, { label: "Food & Groceries", range: "€130 – €220" }, { label: "Transport", range: "€30/month" }, { label: "Utilities & Internet", range: "€55 – €100" }, { label: "Leisure", range: "€100 – €180" }]
            },
            accommodation: { types: ["ESU residences (€200–€450/mo)", "Shared apartments (€300–€550/mo)", "Private studios (€600–€950/mo)"], averageRent: "€400/month", tips: "ESU Padova handles priority housing for scholarship holders. Popular areas: Prato della Valle, Arcella, Santo. Apply via apply.unipd.it.", resources: ["ESU Padova", "Unipd Housing", "Idealista.it"] },
            studentLife: "70,000 students in a small city. Famous Spritz Padovano, Prato della Valle (one of Europe's largest squares), goliardic traditions since 1222.",
            partTimeWork: "Hospitality, research assistance, tech sector. Close to Venice expands options. ESU holders rarely need to work during term.",
            safety: "Very safe and student-friendly. Historic center and student neighborhoods well-monitored.",
            universities: [{
                slug: "unipd", name: "University of Padua", shortName: "UniPD", founded: 1222, website: "https://www.unipd.it", type: "Public",
                worldRanking: "Top 250 globally — 4th in Italy (QS 2024)",
                overview: "Second oldest in Italy (1222), top 250 globally. World's first anatomical theatre (1595). 65,000 students across Engineering, Medicine, Sciences, Law, Economics. €60 application fee.",
                strengths: ["Medicine", "Natural Sciences", "Engineering", "Law", "Economics", "Psychology", "Agriculture"],
                programs: [
                    { name: "Computer Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Data Science", level: "Master", language: "English", duration: "2 years" },
                    { name: "Physics of Data", level: "Master", language: "English", duration: "2 years" },
                    { name: "Industrial Biotechnology", level: "Master", language: "English", duration: "2 years" },
                    { name: "Electric Vehicle Engineering", level: "Master", language: "English", duration: "2 years" },
                    { name: "Cybersecurity", level: "Master", language: "English", duration: "2 years" },
                    { name: "Neuroscience", level: "Master", language: "English", duration: "2 years" },
                    { name: "Human Rights & Multi-level Governance", level: "Master", language: "English", duration: "2 years" },
                    { name: "Business Administration International", level: "Master", language: "English", duration: "2 years" },
                    { name: "Molecular Biology", level: "Master", language: "English", duration: "2 years" },
                ],
                admissionRequirements: {
                    bachelor: ["High school diploma (12 years) + CIMEA/DoV", "Pre-enrollment via Universitaly", "B2 English", "€60 application fee (or CEnT-S test fee)"],
                    master: ["Bachelor's (min. 3 years) in relevant field", "B2 English — IELTS 6.0, TOEFL 72+, Cambridge B2, or study in English", "Apply via apply.unipd.it", "€60 fee", "Some programs require reference letters"],
                },
                languageRequirements: { english: "B2 — IELTS 6.0, TOEFL 72+, Cambridge B2/C1, or previous study in English", italian: "B2 Italian for Italian programs", notes: "MOI letters accepted for some programs. Check apply.unipd.it." },
                scholarships: ["ESU Padova DSU: up to €7,500/year + free housing", "Unipd Excellence Scholarships", "MAECI Italian Government Scholarships", "Erasmus+ Grants", "Veneto Regional Scholarships"],
                applicationPortal: "https://apply.unipd.it",
            }],
        },

        // ─── TRENTO ──────────────────────────────────────────────────
        {
            slug: "trento", name: "Trento", region: "Trentino-Alto Adige", population: "120,000",
            overview: "Italy's hidden academic gem — University of Trento ranks #1-2 for teaching quality nationally. A stunning Alpine city surrounded by the Dolomites with outstanding quality of life and very affordable costs.",
            costOfLiving: {
                monthly: "€750 – €1,050/month", rent: "€300 – €600/month", food: "€130 – €200/month", transport: "€25/month", utilities: "€60 – €100/month",
                breakdown: [{ label: "Shared Room", range: "€300 – €520" }, { label: "Private Studio", range: "€550 – €850" }, { label: "Food & Groceries", range: "€130 – €200" }, { label: "Transport", range: "€25/month" }, { label: "Utilities & Internet", range: "€60 – €100" }, { label: "Leisure", range: "€80 – €150" }]
            },
            accommodation: { types: ["OP.A. residences (€200–€450/mo)", "Shared apartments (€300–€520/mo)", "Private studios (€550–€850/mo)"], averageRent: "€380/month", tips: "OP.A. (Opera Universitaria Trento) provides excellent housing and scholarships. €15 application fee. Compact, walkable Alpine city.", resources: ["Opera Universitaria Trento (OP.A.)", "Unitn Housing Portal"] },
            studentLife: "Intimate Alpine student experience. Skiing in winter, hiking in summer. Strong associations, close-knit international community, authentic Italian culture.",
            partTimeWork: "OP.A. scholarship covers full costs for many. Seasonal tourism/skiing work. Academic research positions available.",
            safety: "One of the safest cities in Italy and Europe. Virtually zero violent crime.",
            universities: [{
                slug: "unitn", name: "University of Trento", shortName: "UniTN", founded: 1962, website: "https://www.unitn.it", type: "Public",
                worldRanking: "Top 3 Italy for teaching quality (CENSIS 2024) — Top 500 globally (QS)",
                overview: "Consistently top 3 in Italy for teaching quality and student satisfaction. Best quality-to-cost ratio in Italy. Strong international programs and research output. €15 application fee.",
                strengths: ["Computer Science", "Law", "Economics", "Sociology", "Engineering", "Physics", "Cognitive Science"],
                programs: [
                    { name: "Computer Science", level: "Master", language: "English", duration: "2 years" },
                    { name: "Data Science", level: "Master", language: "English", duration: "2 years" },
                    { name: "Artificial Intelligence Systems", level: "Master", language: "English", duration: "2 years" },
                    { name: "Cognitive Science", level: "Master", language: "English", duration: "2 years" },
                    { name: "European and International Studies", level: "Master", language: "English", duration: "2 years" },
                    { name: "Economics", level: "Master", language: "English", duration: "2 years" },
                    { name: "Innovation & Organisation", level: "Master", language: "English", duration: "2 years" },
                    { name: "Materials, Mechatronics & Systems Engineering", level: "Master", language: "English", duration: "2 years" },
                ],
                admissionRequirements: {
                    bachelor: ["High school diploma (min. 12 years) + CIMEA/DoV", "B2 English for English programs", "Pre-enrollment via Universitaly", "€15 application fee"],
                    master: ["Bachelor's (min. 3 years) in related field", "IELTS 6.0, TOEFL 79+, Cambridge FCE/CAE, or GMAT 545+", "CV in English, statement of purpose, min. 2 reference letters", "€15 fee — deadlines typically Feb–March for Sep intake"],
                },
                languageRequirements: { english: "IELTS 6.0, TOEFL 79+, Cambridge FCE/CAE/CPE, or GMAT 545+", italian: "B2 Italian for Italian programs", notes: "Previous degree entirely in English accepted. Non-EU apply December–March." },
                scholarships: ["OP.A. DSU: up to €7,500/year + housing (income-based)", "UniTN Merit Scholarships", "MAECI Italian Government Scholarships", "Erasmus+ Grants", "Trentino Provincial Scholarships"],
                applicationPortal: "https://www.unitn.it/en/apply",
            }],
        },

        // ─── VENICE ──────────────────────────────────────────────────
        {
            slug: "venice", name: "Venice", region: "Veneto", population: "265,000",
            overview: "Venice (Venezia) — UNESCO World Heritage site built on water. Ca' Foscari University (1868) renowned for Economics, Business & Languages. No cars, only canals, bridges, and a uniquely inspiring academic environment.",
            costOfLiving: {
                monthly: "€800 – €1,200/month", rent: "€350 – €700/month", food: "€150 – €250/month", transport: "€30/month (student vaporetto)", utilities: "€60 – €110/month",
                breakdown: [{ label: "Shared Room", range: "€350 – €650" }, { label: "Private Studio", range: "€650 – €1,000" }, { label: "Food & Groceries", range: "€150 – €250" }, { label: "Vaporetto Pass", range: "€30/month (student)" }, { label: "Utilities & Internet", range: "€60 – €110" }, { label: "Leisure", range: "€100 – €180" }]
            },
            accommodation: { types: ["Ca' Foscari residences (€250–€500/mo)", "Shared apartments (€350–€650/mo)", "Mestre/mainland (€300–€500/mo, 10-15min by train)"], averageRent: "€450/month", tips: "Many students live in Mestre (cheaper mainland). Apply via apply.unive.it. Docs MUST have signature/seal. ESU Venezia handles scholarships.", resources: ["ESU Venezia", "apply.unive.it", "Immobiliare Mestre"] },
            studentLife: "Studying in Venice is a bucket-list experience. Dorsoduro and Santa Croce are student hubs. Biennale Arte, Film Festival, and Venetian cultural life.",
            partTimeWork: "20M+ annual tourists — strong hospitality, museum, and tour guide opportunities. English widely spoken.",
            safety: "One of Europe's safest cities. No cars means no traffic danger. Crime virtually non-existent.",
            universities: [{
                slug: "ca-foscari", name: "Ca' Foscari University of Venice", shortName: "Ca' Foscari", founded: 1868, website: "https://www.unive.it", type: "Public",
                worldRanking: "Top 500 globally — Top 10 Italy for Economics (QS 2024)",
                overview: "Founded 1868 as Italy's first school of commerce. Internationally recognized for Economics, Business Management, Languages & Humanities. Multiple application rounds. The most unique university location in the world.",
                strengths: ["Economics", "Business Management", "Languages & Cultures", "Humanities", "Environmental Sciences", "Computer Science", "AI"],
                programs: [
                    { name: "Economics and Finance", level: "Master", language: "English", duration: "2 years" },
                    { name: "Management", level: "Master", language: "English", duration: "2 years" },
                    { name: "Global Development & Entrepreneurship", level: "Master", language: "English", duration: "2 years" },
                    { name: "Computer Science", level: "Master", language: "English", duration: "2 years" },
                    { name: "Environmental Humanities", level: "Master", language: "English", duration: "2 years" },
                    { name: "Digital & Public Humanities", level: "Master", language: "English", duration: "2 years" },
                    { name: "Sustainable Development", level: "Master", language: "English", duration: "2 years" },
                    { name: "Artificial Intelligence for Society", level: "Master", language: "English", duration: "2 years" },
                    { name: "Business Administration & Economics", level: "Bachelor", language: "English", duration: "3 years" },
                ],
                admissionRequirements: {
                    bachelor: ["High school diploma (12 years) + preliminary qualification evaluation (mandatory)", "B2 English level", "Apply via apply.unive.it — multiple rounds from Dec 18", "Docs MUST have signature/seal — unsigned REJECTED"],
                    master: ["Bachelor's (min. 3 years) in relevant field", "B2 English — IELTS 6.0, TOEFL 79+, or equivalent", "Motivation letter, CV, passport", "Apply via apply.unive.it", "Docs only in IT/EN/FR/ES — certified translation required otherwise"],
                },
                languageRequirements: { english: "IELTS 6.0, TOEFL 79+, Cambridge B2/C1", italian: "B2 Italian for Italian programs", notes: "Documents without signature/seal/stamp REJECTED. Translations required for non IT/EN/FR/ES docs." },
                scholarships: ["ESU Venezia DSU: up to €7,500/year + housing", "Ca' Foscari International Scholarships (merit-based)", "MAECI Italian Government Scholarships", "Erasmus+ Grants", "Veneto Regional Scholarships"],
                applicationPortal: "https://apply.unive.it",
            }],
        },
    ],
};

// ─────────────────────────────────────────────────────────────
// OTHER DESTINATIONS (Skeleton — expandable)
// ─────────────────────────────────────────────────────────────

const germany: Country = {
    slug: "germany",
    name: "Germany",
    flag: "🇩🇪",
    capital: "Berlin",
    language: "German (English programs widely available)",
    currency: "Euro (€)",
    overview:
        "Germany offers tuition-free education at most public universities, world-renowned engineering & technology programs, and a strong economy for post-study career opportunities. With a large international student community and a high standard of living, Germany is one of Europe's top study destinations.",
    whyStudyHere: [
        "Tuition-free at most public universities (only semester fees ~€150–€350)",
        "World leaders in Engineering, Science, and Technology",
        "18-month Job Seeker Visa after graduation",
        "Vibrant startup ecosystem (especially Berlin)",
        "Strong economy with high graduate employment rates",
        "Student visa allows 20h/week of work",
    ],
    generalInfo: {
        tuitionRange: "€0 (semester fee €150–€350 only) at most public universities",
        scholarships: "DAAD Scholarships, Deutschlandstipendium, university grants",
        visaType: "German Student Visa (§16b AufenthG)",
        postStudyWork: "18-month Job Seeker Visa",
        studentPopulation: "Over 400,000 international students",
    },
    cities: [
        {
            slug: "berlin",
            name: "Berlin",
            region: "Capital City",
            population: "3.6 million",
            overview: "Germany's capital — a global hub for startups, arts, culture, and cutting-edge research. Home to 4 major universities and the world's leading tech ecosystem outside Silicon Valley.",
            costOfLiving: {
                monthly: "€900 – €1,300/month",
                rent: "€500 – €900/month",
                food: "€150 – €250/month",
                transport: "€86/month (BVG semester ticket often included)",
                utilities: "€80 – €120/month",
                breakdown: [
                    { label: "Shared Room", range: "€500 – €800" },
                    { label: "Private Studio", range: "€800 – €1,200" },
                    { label: "Food & Groceries", range: "€150 – €250" },
                    { label: "Public Transport", range: "€86/month (semester ticket)" },
                    { label: "Utilities & Internet", range: "€80 – €120" },
                ],
            },
            accommodation: {
                types: ["Student halls (€300–€500/month)", "Shared WGs (€500–€800/month)", "Private apartments (€800–€1,200/month)"],
                averageRent: "€600/month (shared room)",
                tips: "Berlin housing is competitive — apply early. Check Studierendenwerk Berlin for student housing. Popular areas: Mitte, Prenzlauer Berg, Neukölln.",
                resources: ["Studierendenwerk Berlin", "WG-Gesucht.de", "Immoscout24"],
            },
            studentLife: "Berlin is arguably Europe's most exciting student city — world-famous nightlife, cultural landmarks, startup culture, and one of the most internationally diverse cities in the world.",
            partTimeWork: "Excellent opportunities in tech, hospitality, events, and tourism. English widely spoken in professional environments. 20h/week permitted during semester.",
            safety: "Generally safe with a strong student community. Be aware in some late-night areas.",
            universities: [
                {
                    slug: "fu-berlin",
                    name: "Freie Universität Berlin",
                    shortName: "FU Berlin",
                    founded: 1948,
                    website: "https://www.fu-berlin.de",
                    type: "Public",
                    worldRanking: "Top 150 globally (QS 2024)",
                    overview: "One of Germany's leading research universities, FU Berlin is known for social sciences, humanities, biology, and medicine. A founding member of the German U15 excellence cluster.",
                    strengths: ["Social Sciences", "Humanities", "Life Sciences", "Medicine", "Political Science"],
                    programs: [
                        { name: "Communications, Media and Culture", level: "Master", language: "English", duration: "2 years" },
                        { name: "International Health", level: "Master", language: "English", duration: "2 years" },
                        { name: "North American Studies", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: ["High school diploma equivalent", "German language proficiency (B2/C1) for German programs"],
                        master: ["Bachelor's degree in relevant field", "IELTS 6.5 or TOEFL 90+ for English programs", "C1 German for German programs"],
                    },
                    languageRequirements: {
                        english: "IELTS 6.5 or TOEFL iBT 90+",
                        italian: "N/A",
                        notes: "English programs growing. Most programs still in German — B2/C1 required.",
                    },
                    scholarships: ["DAAD Scholarships", "Deutschlandstipendium", "EU Erasmus+"],
                    applicationPortal: "https://www.fu-berlin.de/en/studium/international/",
                },
            ],
        },
    ],
};

const france: Country = {
    slug: "france",
    name: "France",
    flag: "🇫🇷",
    capital: "Paris",
    language: "French (English programs available at select institutions)",
    currency: "Euro (€)",
    overview:
        "France is home to world-renowned Grandes Écoles and a rich intellectual tradition. With highly affordable tuition at public universities (€170–€3,770/year) and a thriving cultural scene, France attracts over 350,000 international students.",
    whyStudyHere: [
        "Public university tuition €170–€3,770/year",
        "Campus France support for international applications",
        "2-year post-study APS visa",
        "World-class fashion, art, and gastronomy culture",
        "Strong networks in luxury, finance, and international institutions",
    ],
    generalInfo: {
        tuitionRange: "€170 – €3,770/year (public universities)",
        scholarships: "Eiffel Scholarship, Campus France Scholarship, Erasmus+",
        visaType: "Student Visa VLS-TS",
        postStudyWork: "2-year APS (Autorisation Provisoire de Séjour) visa",
        studentPopulation: "Over 350,000 international students",
    },
    cities: [
        {
            slug: "paris",
            name: "Paris",
            region: "Île-de-France",
            population: "2.1 million",
            overview: "The City of Light and the world's most visited cultural capital. Home to some of Europe's most prestigious institutions and an unparalleled intellectual environment.",
            costOfLiving: {
                monthly: "€1,200 – €1,800/month",
                rent: "€600 – €1,200/month",
                food: "€200 – €300/month",
                transport: "€38/month (student Navigo pass)",
                utilities: "€80 – €150/month",
                breakdown: [
                    { label: "Shared Room", range: "€600 – €900" },
                    { label: "Private Studio", range: "€900 – €1,500" },
                    { label: "Food & Groceries", range: "€200 – €300" },
                    { label: "Transport (Navigo)", range: "€38/month (student)" },
                ],
            },
            accommodation: {
                types: ["CROUS student residences (€200–€450/month)", "Shared apartments (€600–€900/month)"],
                averageRent: "€750/month",
                tips: "Apply for CROUS housing immediately upon admission. Very competitive. CAF housing assistance available for all students.",
                resources: ["CROUS de Paris", "CAF (housing allowance)", "PAP.fr"],
            },
            studentLife: "Unrivalled cultural scene — world-class museums, cuisine, fashion, and intellectual debate. France's Grandes Écoles scene is legendary.",
            partTimeWork: "Up to 964 hours/year (about 20h/week). Hospitality, retail, and academic roles. English workplaces increasing rapidly.",
            safety: "Safe for students in most areas. Be cautious on Metro late at night.",
            universities: [
                {
                    slug: "paris-saclay",
                    name: "Université Paris-Saclay",
                    shortName: "Paris-Saclay",
                    founded: 2019,
                    website: "https://www.universite-paris-saclay.fr",
                    type: "Public",
                    worldRanking: "Top 15 globally (QS 2024)",
                    overview: "One of the world's top research universities, Paris-Saclay is a powerhouse for science, engineering, and technology. It encompasses 275 laboratories and multiple Grande Écoles.",
                    strengths: ["Engineering", "Mathematics", "Physics", "Computer Science", "Life Sciences"],
                    programs: [
                        { name: "Artificial Intelligence", level: "Master", language: "English", duration: "2 years" },
                        { name: "Data Science", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: ["French Baccalauréat equivalent", "French B2 for French programs"],
                        master: ["Bachelor's degree", "IELTS 6.5 or French B2"],
                    },
                    languageRequirements: {
                        english: "IELTS 6.5 for English programs",
                        italian: "N/A",
                        notes: "Most programs in French. English MSc programs available in top science fields.",
                    },
                    scholarships: ["Eiffel Excellence Scholarship", "Erasmus+", "IDEX Scholarship"],
                    applicationPortal: "https://www.universite-paris-saclay.fr/en/admissions",
                },
            ],
        },
    ],
};

const spain: Country = {
    slug: "spain",
    name: "Spain",
    flag: "🇪🇸",
    capital: "Madrid",
    language: "Spanish (Growing English programs)",
    currency: "Euro (€)",
    overview:
        "Spain offers affordable education, a warm Mediterranean lifestyle, and world-class institutions. With tuition from €800–€2,500/year and a growing tech and startup scene, Spain is increasingly popular among international students.",
    whyStudyHere: [
        "Affordable tuition: €800–€2,500/year",
        "Excellent quality of life and Mediterranean lifestyle",
        "Work permit up to 30h/week during studies",
        "Strong programs in business, architecture, and medicine",
        "1-year job seeker extension visa",
    ],
    generalInfo: {
        tuitionRange: "€800 – €2,500/year (public universities)",
        scholarships: "Becas Santander, MAEC-AECID, Erasmus+",
        visaType: "Student Visa (Visado de Estudios)",
        postStudyWork: "1-year job seeker extension",
        studentPopulation: "Over 90,000 international students",
    },
    cities: [
        {
            slug: "madrid",
            name: "Madrid",
            region: "Community of Madrid",
            population: "3.3 million",
            overview: "Spain's vibrant capital — a world-class city with exceptional universities, a booming tech sector, and an unmatched cultural and social scene.",
            costOfLiving: {
                monthly: "€900 – €1,300/month",
                rent: "€450 – €800/month",
                food: "€150 – €250/month",
                transport: "€20/month (student pass)",
                utilities: "€60 – €100/month",
                breakdown: [
                    { label: "Shared Room", range: "€450 – €700" },
                    { label: "Private Studio", range: "€700 – €1,100" },
                    { label: "Food & Groceries", range: "€150 – €250" },
                    { label: "Transport", range: "€20/month student" },
                ],
            },
            accommodation: {
                types: ["Student residences (€400–€700/month)", "Shared apartments (€450–€700/month)"],
                averageRent: "€550/month",
                tips: "Look in Moncloa-Aravaca (near Complutense), Malasaña for student areas.",
                resources: ["Uniplaces", "Idealista.es", "Spotahome"],
            },
            studentLife: "Incredible nightlife, culture, football, flamenco. Madrid never sleeps — the student social scene is extraordinary.",
            partTimeWork: "Hospitality, tourism, English teaching, retail. Growing tech sector in startups.",
            safety: "Very safe — Madrid is one of Western Europe's safest capitals.",
            universities: [
                {
                    slug: "ucm",
                    name: "Complutense University of Madrid",
                    shortName: "UCM",
                    founded: 1293,
                    website: "https://www.ucm.es",
                    type: "Public",
                    worldRanking: "Top 200 globally (QS 2024)",
                    overview: "One of the oldest universities in the world and the largest in Spain with over 86,000 students. Strong in law, medicine, social sciences, and humanities.",
                    strengths: ["Law", "Medicine", "Social Sciences", "Humanities", "Psychology"],
                    programs: [
                        { name: "International Business Management", level: "Master", language: "English", duration: "1 year" },
                        { name: "Public Health", level: "Master", language: "English", duration: "1 year" },
                    ],
                    admissionRequirements: {
                        bachelor: ["High school diploma ENIC/NARIC recognized", "Spanish B1 for Spanish programs"],
                        master: ["Bachelor's in relevant field", "IELTS 6.0 for English programs"],
                    },
                    languageRequirements: {
                        english: "IELTS 6.0 or TOEFL 79+",
                        italian: "N/A",
                        notes: "Spanish B2 required for Spanish-taught programs. English programs growing.",
                    },
                    scholarships: ["Becas Santander", "Compliance Scholarships", "Erasmus+", "MAEC-AECID"],
                    applicationPortal: "https://www.ucm.es/admision-y-acceso",
                },
            ],
        },
    ],
};

const lithuania: Country = {
    slug: "lithuania",
    name: "Lithuania",
    flag: "🇱🇹",
    capital: "Vilnius",
    language: "Lithuanian (Most programs in English)",
    currency: "Euro (€)",
    overview:
        "Lithuania is one of Europe's best-kept secrets for international students — affordable, safe, with high-quality English-taught programs across medicine, technology, and business. As an EU member, Lithuania graduates receive EU-recognized degrees and can access EU job markets.",
    whyStudyHere: [
        "Very low tuition: €2,000–€6,000/year for international students",
        "Most programs fully in English",
        "One of Europe's fastest-growing economies",
        "Schengen Area access",
        "Safe and student-friendly cities",
        "Strong programs in medicine, IT, and business",
    ],
    generalInfo: {
        tuitionRange: "€2,000 – €6,000/year",
        scholarships: "Lithuanian State Government Scholarships, university grants",
        visaType: "Lithuanian Student Visa (D visa)",
        postStudyWork: "EU Blue Card / Lithuanian Temporary Residence for work",
        studentPopulation: "Over 7,000 international students",
    },
    cities: [
        {
            slug: "vilnius",
            name: "Vilnius",
            region: "Vilnius County",
            population: "600,000",
            overview: "Lithuania's capital and largest city. A UNESCO World Heritage old town, a thriving startup scene (dubbed 'Europe's Silicon Valley'), and a welcoming international student community.",
            costOfLiving: {
                monthly: "€600 – €900/month",
                rent: "€250 – €450/month",
                food: "€100 – €180/month",
                transport: "€15/month",
                utilities: "€50 – €80/month",
                breakdown: [
                    { label: "Shared Room / Student Hall", range: "€150 – €400" },
                    { label: "Private Studio", range: "€400 – €700" },
                    { label: "Food & Groceries", range: "€100 – €180" },
                    { label: "Transport", range: "€15/month" },
                ],
            },
            accommodation: {
                types: ["University dorms (€100–€200/month)", "Shared apartments (€250–€400/month)", "Private studios (€400–€700/month)"],
                averageRent: "€300/month",
                tips: "One of the most affordable capitals in the EU. University dorms are excellent value. Old Town and Žirmūnai are popular student areas.",
                resources: ["Vilnius University Housing", "Aruodas.lt (rental site)", "Facebook Vilnius Expats groups"],
            },
            studentLife: "Compact, safe, and dynamic. Medieval old town, startup culture, and a rapidly growing international community. Great food, craft beer scene, and close proximity to Latvia, Estonia, and Poland.",
            partTimeWork: "Growing IT sector, hospitality, tourism. English is widely spoken in business. 20h/week permitted for non-EU students.",
            safety: "One of Europe's safest capitals. Very low crime rates and a welcoming attitude toward international students.",
            universities: [
                {
                    slug: "vilnius-university",
                    name: "Vilnius University",
                    shortName: "VU",
                    founded: 1579,
                    website: "https://www.vu.lt",
                    type: "Public",
                    worldRanking: "Top 650 globally (QS 2024)",
                    overview: "Founded in 1579, Vilnius University is the oldest and most prestigious university in the Baltic states. It offers a broad range of programs and has a growing number of English-taught Master's and Bachelor's courses attracting international students.",
                    strengths: ["Computer Science", "Business", "Law", "Life Sciences", "Humanities", "Physics"],
                    programs: [
                        { name: "Computer Science", level: "Master", language: "English", duration: "2 years" },
                        { name: "Data Science", level: "Master", language: "English", duration: "2 years" },
                        { name: "Business Analytics", level: "Master", language: "English", duration: "2 years" },
                        { name: "International Business", level: "Bachelor", language: "English", duration: "3 years" },
                        { name: "Biochemistry", level: "Master", language: "English", duration: "2 years" },
                    ],
                    admissionRequirements: {
                        bachelor: ["High school diploma", "IELTS 5.5 or TOEFL 72+", "Apply directly to VU"],
                        master: ["Bachelor's in relevant field", "IELTS 6.0 or TOEFL 79+", "Motivation letter and CV"],
                    },
                    languageRequirements: {
                        english: "IELTS 6.0 (Bachelor: IELTS 5.5) or equivalent TOEFL",
                        italian: "N/A",
                        notes: "Most international programs fully in English. Lithuanian not required.",
                    },
                    scholarships: ["Lithuanian State Studies Foundation Scholarship", "VU Rector's Scholarship", "Erasmus+"],
                    applicationPortal: "https://www.vu.lt/en/studies/international-students",
                },
            ],
        },
    ],
};

// ─────────────────────────────────────────────────────────────
// COMPREHENSIVE ITALIAN UNIVERSITY DIRECTORY
// Source: MIUR official registration, 2024/25
// ─────────────────────────────────────────────────────────────

export interface ItalianUniversityEntry {
    slug: string;
    name: string;
    nameIT: string;
    city: string;
    region: string;
    founded?: number;
    website: string;
    type: "State University" | "Polytechnic" | "Special Institute" | "Public Non-State";
    murId: string;
    englishPrograms: boolean;
    scholarshipBody?: string;
}

export const allItalianUniversities: ItalianUniversityEntry[] = [
    // ── Polytechnics ─────────────────────────────────────
    { slug: "polimi", nameIT: "Politecnico di Milano", name: "Politecnico di Milano", city: "Milan", region: "Lombardia", website: "https://polimi.it", type: "Polytechnic", murId: "01502", englishPrograms: true, scholarshipBody: "DSU Lombardia (ERDIS)" },
    { slug: "polito", nameIT: "Politecnico di Torino", name: "Politecnico di Torino", city: "Turin", region: "Piemonte", founded: 1906, website: "https://www.polito.it", type: "Polytechnic", murId: "00102", englishPrograms: true, scholarshipBody: "DSU Piemonte" },
    { slug: "poliba", nameIT: "Politecnico di Bari", name: "Polytechnic University of Bari", city: "Bari", region: "Puglia", founded: 1990, website: "https://www.poliba.it", type: "Polytechnic", murId: "07202", englishPrograms: true, scholarshipBody: "ADISU Puglia" },
    // ── State Universities ────────────────────────────────
    { slug: "unibo", nameIT: "Università degli Studi di Bologna", name: "University of Bologna", city: "Bologna", region: "Emilia Romagna", founded: 1088, website: "https://www.unibo.it", type: "State University", murId: "03701", englishPrograms: true, scholarshipBody: "ER.GO" },
    { slug: "uniroma1", nameIT: "Università degli studi di Roma La Sapienza", name: "Sapienza University of Rome", city: "Rome", region: "Lazio", founded: 1303, website: "https://www.uniroma1.it", type: "State University", murId: "05801", englishPrograms: true, scholarshipBody: "DiSCo Lazio" },
    { slug: "unito", nameIT: "Università degli studi di Torino", name: "University of Turin", city: "Turin", region: "Piemonte", founded: 1404, website: "https://www.unito.it", type: "State University", murId: "00101", englishPrograms: true, scholarshipBody: "DSU Piemonte" },
    { slug: "unipi", nameIT: "Università degli studi di Pisa", name: "University of Pisa", city: "Pisa", region: "Toscana", website: "https://www.unipi.it", type: "State University", murId: "05001", englishPrograms: true, scholarshipBody: "DSU Toscana" },
    { slug: "unifi", nameIT: "Università degli studi di Firenze", name: "University of Florence", city: "Florence", region: "Toscana", founded: 1321, website: "https://www.unifi.it", type: "State University", murId: "04701", englishPrograms: true, scholarshipBody: "DSU Toscana" },
    { slug: "unipd", nameIT: "Università Ca' Foscari Venezia / UniPD", name: "University of Padua", city: "Padua", region: "Veneto", website: "https://www.unipd.it", type: "State University", murId: "02401", englishPrograms: true, scholarshipBody: "ESU Padova" },
    { slug: "unitn", nameIT: "Università degli studi di Trento", name: "University of Trento", city: "Trento", region: "Trentino-Alto Adige", website: "https://www.unitn.it", type: "State University", murId: "02201", englishPrograms: true, scholarshipBody: "OP.A. Trento" },
    { slug: "unive", nameIT: "Università Ca\' Foscari Venezia", name: "Ca' Foscari University of Venice", city: "Venice", region: "Veneto", website: "https://unive.it", type: "State University", murId: "02701", englishPrograms: true, scholarshipBody: "ESU Venezia" },
    { slug: "unimistat", nameIT: "Università degli studi di Milano", name: "University of Milan", city: "Milan", region: "Lombardia", website: "https://www.unimi.it", type: "State University", murId: "01501", englishPrograms: true, scholarshipBody: "DSU Lombardia" },
    { slug: "unimib", nameIT: "Università degli studi di Milano-Bicocca", name: "University of Milan-Bicocca", city: "Milan", region: "Lombardia", website: "https://www.unimib.it", type: "State University", murId: "01503", englishPrograms: true, scholarshipBody: "DSU Lombardia" },
    { slug: "unige", nameIT: "Università degli studi di Genova", name: "University of Genova", city: "Genova", region: "Liguria", website: "https://unige.it", type: "State University", murId: "01001", englishPrograms: true, scholarshipBody: "ARDSU Liguria" },
    { slug: "unibs", nameIT: "Università degli studi di Brescia", name: "University of Brescia", city: "Brescia", region: "Lombardia", website: "https://www.unibs.it", type: "State University", murId: "01701", englishPrograms: true, scholarshipBody: "DSU Lombardia" },
    { slug: "unibg", nameIT: "Università degli studi di Bergamo", name: "University of Bergamo", city: "Bergamo", region: "Lombardia", website: "https://www.unibg.it", type: "State University", murId: "01201", englishPrograms: true, scholarshipBody: "DSU Lombardia" },
    { slug: "uninsubria", nameIT: "Università degli studi dell' Insubria", name: "University of Insubria", city: "Varese", region: "Lombardia", website: "https://www.uninsubria.it", type: "State University", murId: "01202", englishPrograms: true, scholarshipBody: "DSU Lombardia" },
    { slug: "unipv", nameIT: "Università degli studi di Pavia", name: "University of Pavia", city: "Pavia", region: "Lombardia", website: "https://web.unipv.it", type: "State University", murId: "01301", englishPrograms: true, scholarshipBody: "EDiSU Pavia" },
    { slug: "uniupo", nameIT: "Università degli studi del Piemonte orientale", name: "University of Piemonte Orientale", city: "Vercelli", region: "Piemonte", website: "https://www.uniupo.it", type: "State University", murId: "00201", englishPrograms: false, scholarshipBody: "DSU Piemonte" },
    { slug: "unife", nameIT: "Università degli studi di Ferrara", name: "University of Ferrara", city: "Ferrara", region: "Emilia Romagna", website: "https://www.unife.it", type: "State University", murId: "03801", englishPrograms: true, scholarshipBody: "ER.GO" },
    { slug: "unipr", nameIT: "Università degli studi di Parma", name: "University of Parma", city: "Parma", region: "Emilia Romagna", website: "https://www.unipr.it", type: "State University", murId: "04001", englishPrograms: true, scholarshipBody: "ER.GO" },
    { slug: "unimore", nameIT: "Università degli studi di Modena e Reggio Emilia", name: "University of Modena and Reggio Emilia", city: "Modena", region: "Emilia Romagna", website: "https://www.unimore.it", type: "State University", murId: "03901", englishPrograms: true, scholarshipBody: "ER.GO" },
    { slug: "unipg", nameIT: "Università degli studi di Perugia", name: "University of Perugia", city: "Perugia", region: "Umbria", website: "https://www.unipg.it", type: "State University", murId: "05401", englishPrograms: true, scholarshipBody: "ADISU Umbria" },
    { slug: "unisi", nameIT: "Università degli studi di Siena", name: "University of Siena", city: "Siena", region: "Toscana", website: "https://www.unisi.it", type: "State University", murId: "05201", englishPrograms: true, scholarshipBody: "DSU Toscana" },
    { slug: "unitus", nameIT: "Università degli studi della Tuscia", name: "University of Tuscia", city: "Viterbo", region: "Lazio", founded: 1979, website: "https://www.unitus.it", type: "State University", murId: "05601", englishPrograms: false, scholarshipBody: "DiSCo Lazio" },
    { slug: "uniroma2", nameIT: "Università degli studi di Roma Tor Vergata", name: "University of Rome Tor Vergata", city: "Rome", region: "Lazio", founded: 1972, website: "https://web.uniroma2.it", type: "State University", murId: "05802", englishPrograms: true, scholarshipBody: "DiSCo Lazio" },
    { slug: "uniroma4", nameIT: "Università degli studi di Roma Foro Italico", name: "University of Rome Foro Italico", city: "Rome", region: "Lazio", website: "https://www.uniroma4.it", type: "State University", murId: "05806", englishPrograms: false },
    { slug: "unicas", nameIT: "Università degli studi di Cassino e del Lazio Meridionale", name: "University of Cassino", city: "Cassino", region: "Lazio", founded: 1979, website: "https://www.unicas.it", type: "State University", murId: "06001", englishPrograms: false },
    { slug: "unina", nameIT: "Università degli studi di Napoli Federico II", name: "University of Naples Federico II", city: "Naples", region: "Campania", website: "https://www.unina.it", type: "State University", murId: "06301", englishPrograms: true, scholarshipBody: "ADISU Campania" },
    { slug: "uniparthenope", nameIT: "Università degli studi di Napoli Parthenope", name: "University of Naples Parthenope", city: "Naples", region: "Campania", website: "https://www.uniparthenope.it", type: "State University", murId: "06305", englishPrograms: false },
    { slug: "unior", nameIT: "Università degli studi L'Orientale di Napoli", name: "University of Naples L'Orientale", city: "Naples", region: "Campania", website: "https://www.unior.it", type: "State University", murId: "06303", englishPrograms: true },
    { slug: "unicampania", nameIT: "Università degli studi della Campania Luigi Vanvitelli", name: "University Luigi Vanvitelli", city: "Caserta", region: "Campania", website: "https://www.unicampania.it", type: "State University", murId: "06306", englishPrograms: true },
    { slug: "unisa", nameIT: "Università degli studi di Salerno", name: "University of Salerno", city: "Salerno", region: "Campania", website: "https://www.unisa.it", type: "State University", murId: "06501", englishPrograms: true },
    { slug: "unisannio", nameIT: "Università degli Studi del Sannio", name: "University of Sannio", city: "Benevento", region: "Campania", website: "https://unisannio.it", type: "State University", murId: "06201", englishPrograms: true },
    { slug: "uniba", nameIT: "Università degli Studi di Bari", name: "University of Bari", city: "Bari", region: "Puglia", website: "https://www.uniba.it", type: "State University", murId: "07201", englishPrograms: true },
    { slug: "unifg", nameIT: "Università degli studi di Foggia", name: "University of Foggia", city: "Foggia", region: "Puglia", website: "https://www.unifg.it", type: "State University", murId: "07502", englishPrograms: false },
    { slug: "unisalento", nameIT: "Università del Salento", name: "University of Salento", city: "Lecce", region: "Puglia", website: "https://www.unisalento.it", type: "State University", murId: "07501", englishPrograms: true },
    { slug: "unical", nameIT: "Università della Calabria", name: "University of Calabria", city: "Rende", region: "Calabria", website: "https://www.unical.it", type: "State University", murId: "07801", englishPrograms: true },
    { slug: "unirc", nameIT: "Università degli studi di Reggio Calabria Mediterranea", name: "University Mediterranea of Reggio Calabria", city: "Reggio Calabria", region: "Calabria", website: "https://www.unirc.it", type: "State University", murId: "08001", englishPrograms: false },
    { slug: "unicz", nameIT: "Università degli studi di Catanzaro Magna Grecia", name: "University of Catanzaro", city: "Catanzaro", region: "Calabria", founded: 1998, website: "https://web.unicz.it", type: "State University", murId: "07901", englishPrograms: false },
    { slug: "unipa", nameIT: "Università degli studi di Palermo", name: "University of Palermo", city: "Palermo", region: "Sicilia", website: "https://www.unipa.it", type: "State University", murId: "08101", englishPrograms: true },
    { slug: "unict", nameIT: "Università degli studi di Catania", name: "University of Catania", city: "Catania", region: "Sicilia", website: "https://www.unict.it", type: "State University", murId: "08201", englishPrograms: true },
    { slug: "unime", nameIT: "Università degli studi di Messina", name: "University of Messina", city: "Messina", region: "Sicilia", website: "https://www.unime.it", type: "State University", murId: "08301", englishPrograms: false },
    { slug: "unica", nameIT: "Università degli studi di Cagliari", name: "University of Cagliari", city: "Cagliari", region: "Sardegna", website: "https://unica.it", type: "State University", murId: "09201", englishPrograms: true },
    { slug: "uniss", nameIT: "Università degli studi di Sassari", name: "University of Sassari", city: "Sassari", region: "Sardegna", website: "https://www.uniss.it", type: "State University", murId: "09001", englishPrograms: false },
    { slug: "univaq", nameIT: "Università degli studi di L'Aquila", name: "University of L'Aquila", city: "L'Aquila", region: "Abruzzo", founded: 1596, website: "https://www.univaq.it", type: "State University", murId: "06801", englishPrograms: true },
    { slug: "unich", nameIT: "Università degli studi Gabriele D'Annunzio di Chieti e Pescara", name: "G. d'Annunzio University of Chieti-Pescara", city: "Chieti", region: "Abruzzo", website: "https://www.unich.it", type: "State University", murId: "06901", englishPrograms: true },
    { slug: "unite", nameIT: "Università degli studi di Teramo", name: "University of Teramo", city: "Teramo", region: "Abruzzo", website: "https://www.unite.it", type: "State University", murId: "06701", englishPrograms: false },
    { slug: "unimol", nameIT: "Università degli studi del Molise", name: "University of Molise", city: "Campobasso", region: "Molise", website: "https://www2.unimol.it", type: "State University", murId: "07001", englishPrograms: false },
    { slug: "unibas", nameIT: "Università degli studi della Basilicata", name: "University of Basilicata", city: "Potenza", region: "Basilicata", website: "https://portale.unibas.it", type: "State University", murId: "07601", englishPrograms: false },
    { slug: "units", nameIT: "Università degli studi di Trieste", name: "University of Trieste", city: "Trieste", region: "Friuli Venezia Giulia", website: "https://www.units.it", type: "State University", murId: "03201", englishPrograms: true },
    { slug: "uniud", nameIT: "Università degli studi di Udine", name: "University of Udine", city: "Udine", region: "Friuli Venezia Giulia", website: "https://www.uniud.it", type: "State University", murId: "03001", englishPrograms: true },
    { slug: "univr", nameIT: "Università degli studi di Verona", name: "University of Verona", city: "Verona", region: "Veneto", website: "https://www.univr.it", type: "State University", murId: "02301", englishPrograms: true },
    { slug: "iuav", nameIT: "Università Iuav di Venezia", name: "IUAV University of Venice", city: "Venice", region: "Veneto", website: "https://www.iuav.it", type: "State University", murId: "02702", englishPrograms: true },
    { slug: "univpm", nameIT: "Università Politecnica delle Marche", name: "Polytechnic University of Marche", city: "Ancona", region: "Marche", website: "https://www.univpm.it", type: "State University", murId: "04201", englishPrograms: true },
    { slug: "unimc", nameIT: "Università degli studi di Macerata", name: "University of Macerata", city: "Macerata", region: "Marche", website: "https://www.unimc.it", type: "State University", murId: "04301", englishPrograms: false },
    { slug: "unicam", nameIT: "Università degli studi di Camerino", name: "University of Camerino", city: "Camerino", region: "Marche", founded: 1336, website: "https://www.unicam.it", type: "State University", murId: "04202", englishPrograms: true },
    { slug: "univda", nameIT: "Università della Valle d'Aosta", name: "University of Aosta Valley", city: "Aosta", region: "Valle d'Aosta", founded: 2000, website: "https://www.univda.it", type: "Public Non-State", murId: "00701", englishPrograms: false },
    { slug: "unistrapg", nameIT: "Università per stranieri di Perugia", name: "University for Foreigners of Perugia", city: "Perugia", region: "Umbria", website: "https://www.unistrapg.it", type: "State University", murId: "05403", englishPrograms: false },
    { slug: "unistrasi", nameIT: "Università per stranieri di Siena", name: "University for Foreigners of Siena", city: "Siena", region: "Toscana", website: "https://www.unistrasi.it", type: "State University", murId: "05202", englishPrograms: false },
    { slug: "unibz", nameIT: "Libera Università di Bolzano", name: "Free University of Bozen-Bolzano", city: "Bolzano", region: "Trentino-Alto Adige", founded: 1997, website: "https://www.unibz.it", type: "Public Non-State", murId: "02101", englishPrograms: true, scholarshipBody: "UNIBZ Scholarship Office" },
    { slug: "iusspavia", nameIT: "Istituto universitario di studi superiori di Pavia", name: "IUSS Pavia — School for Advanced Studies", city: "Pavia", region: "Lombardia", founded: 1997, website: "https://www.iusspavia.it", type: "Special Institute", murId: "01802", englishPrograms: true },
    // ── Special Advanced Schools ──────────────────────────
    { slug: "sns", nameIT: "Scuola normale superiore di Pisa", name: "Scuola Normale Superiore", city: "Pisa", region: "Toscana", founded: 1810, website: "https://www.sns.it", type: "Special Institute", murId: "05002", englishPrograms: true },
    { slug: "santanna", nameIT: "Scuola superiore di studi universitari S. Anna di Pisa", name: "Sant'Anna School of Advanced Studies", city: "Pisa", region: "Toscana", founded: 1987, website: "https://www.santannapisa.it", type: "Special Institute", murId: "05003", englishPrograms: true },
    { slug: "sissa", nameIT: "Scuola internazionale superiore di studi avanzati di Trieste", name: "SISSA — International School for Advanced Studies", city: "Trieste", region: "Friuli Venezia Giulia", founded: 1978, website: "https://www.sissa.it", type: "Special Institute", murId: "03202", englishPrograms: true },
    { slug: "imtlucca", nameIT: "Scuola IMT Alti Studi di Lucca", name: "IMT School for Advanced Studies Lucca", city: "Lucca", region: "Toscana", founded: 2005, website: "https://www.imtlucca.it", type: "Special Institute", murId: "04601", englishPrograms: true },
    { slug: "gssi", nameIT: "Gran Sasso Science Institute", name: "Gran Sasso Science Institute (GSSI)", city: "L'Aquila", region: "Abruzzo", founded: 2012, website: "https://www.gssi.it", type: "Special Institute", murId: "06603", englishPrograms: true },
    { slug: "ssm", nameIT: "Scuola Superiore Meridionale di Napoli", name: "Scuola Superiore Meridionale", city: "Naples", region: "Campania", founded: 2022, website: "https://www.ssmeridionale.it", type: "Special Institute", murId: "06308", englishPrograms: true },
];

// Helper: get all universities with English programs (useful for filtering)
export const italianUniversitiesWithEnglish = allItalianUniversities.filter(u => u.englishPrograms);

// Helper: get universities by region
export function getUniversitiesByRegion(region: string): ItalianUniversityEntry[] {
    return allItalianUniversities.filter(u => u.region.toLowerCase().includes(region.toLowerCase()));
}

// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────

export const destinations: Country[] = [italy, germany, france, spain, lithuania];

export function getCountry(slug: string): Country | undefined {
    return destinations.find(c => c.slug === slug);
}

export function getCity(countrySlug: string, citySlug: string): City | undefined {
    return getCountry(countrySlug)?.cities.find(c => c.slug === citySlug);
}

export function getUniversity(countrySlug: string, citySlug: string, uniSlug: string): University | undefined {
    return getCity(countrySlug, citySlug)?.universities.find(u => u.slug === uniSlug);
}
