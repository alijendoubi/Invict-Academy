const fs = require('fs');
const path = require('path');

const filePath = path.resolve('d:/Invict Academy/Invict-Academy/apps/web/src/lib/destinations.ts');
let content = fs.readFileSync(filePath, 'utf8');

const germanyNewCities = `
        {
            slug: "munich", name: "Munich", region: "Bavaria", population: "1.5 million",
            overview: "A major center for technology, engineering, and business in Germany.",
            costOfLiving: { monthly: "€1,000–€1,500/month", rent: "€600–€900/month", food: "€200–€300/month", transport: "€50/month", utilities: "€100/month", breakdown: [] },
            accommodation: { types: ["Dorms", "Shared"], averageRent: "€700/month", tips: "Apply very early", resources: [] },
            studentLife: "Rich Bavarian culture and Oktoberfest.", partTimeWork: "Great opportunities in tech and auto.", safety: "Very safe.",
            universities: [{
                slug: "lmu-munich", name: "Ludwig Maximilian University", shortName: "LMU", founded: 1472, website: "https://www.lmu.de", type: "Public",
                worldRanking: "Top 100 globally (QS 2024)", overview: "Top-ranked university in Germany.", strengths: ["Medicine", "Sciences", "Humanities"],
                programs: [{ name: "Data Science", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.5", italian: "N/A", notes: "" },
                scholarships: ["DAAD"], applicationPortal: "https://www.lmu.de" }]
        },
        {
            slug: "heidelberg", name: "Heidelberg", region: "Baden-Württemberg", population: "160,000",
            overview: "Historic student city with Germany's oldest university.",
            costOfLiving: { monthly: "€900–€1,200/month", rent: "€500–€700/month", food: "€200/month", transport: "€40/month", utilities: "€90/month", breakdown: [] },
            accommodation: { types: ["Dorms", "Shared"], averageRent: "€600/month", tips: "Competitive housing", resources: [] },
            studentLife: "Traditional German university town atmosphere.", partTimeWork: "Research, hospitality.", safety: "Very safe.",
            universities: [{
                slug: "heidelberg-uni", name: "Heidelberg University", shortName: "HU", founded: 1386, website: "https://www.uni-heidelberg.de", type: "Public",
                worldRanking: "Top 150 globally", overview: "Germany's oldest university.", strengths: ["Medicine", "Life Sciences", "Physics"],
                programs: [{ name: "Molecular Biosciences", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.5", italian: "N/A", notes: "" },
                scholarships: ["DAAD"], applicationPortal: "https://www.uni-heidelberg.de" }]
        },
        {
            slug: "aachen", name: "Aachen", region: "North Rhine-Westphalia", population: "250,000",
            overview: "Renowned globally for engineering and technology.",
            costOfLiving: { monthly: "€800–€1,100/month", rent: "€400–€600/month", food: "€200/month", transport: "€30/month", utilities: "€80/month", breakdown: [] },
            accommodation: { types: ["Dorms", "Shared"], averageRent: "€450/month", tips: "Affordable compared to Munich", resources: [] },
            studentLife: "Student-heavy city with tech focus.", partTimeWork: "Engineering internships.", safety: "Very safe.",
            universities: [{
                slug: "rwth-aachen", name: "RWTH Aachen University", shortName: "RWTH", founded: 1870, website: "https://www.rwth-aachen.de", type: "Public",
                worldRanking: "Top 200 globally", overview: "Leading technical university in Europe.", strengths: ["Engineering", "Computer Science", "Natural Sciences"],
                programs: [{ name: "Automotive Engineering", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.5", italian: "N/A", notes: "" },
                scholarships: ["DAAD"], applicationPortal: "https://www.rwth-aachen.de" }]
        },
        {
            slug: "hamburg", name: "Hamburg", region: "Hamburg", population: "1.8 million",
            overview: "Major port city with diverse international community.",
            costOfLiving: { monthly: "€900–€1,300/month", rent: "€500–€800/month", food: "€200/month", transport: "€40/month", utilities: "€100/month", breakdown: [] },
            accommodation: { types: ["Dorms", "Shared"], averageRent: "€600/month", tips: "Large city outskirt options", resources: [] },
            studentLife: "Vibrant cultural and nightlife.", partTimeWork: "Logistics, media, tech.", safety: "Safe for a large city.",
            universities: [{
                slug: "uni-hamburg", name: "University of Hamburg", shortName: "UHH", founded: 1919, website: "https://www.uni-hamburg.de", type: "Public",
                worldRanking: "Top 250 globally", overview: "Largest research and educational institution in Northern Germany.", strengths: ["Climate Sciences", "Law", "Business"],
                programs: [{ name: "International Business", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.5", italian: "N/A", notes: "" },
                scholarships: ["DAAD"], applicationPortal: "https://www.uni-hamburg.de" }]
        }
`;

const franceNewCities = `
        {
            slug: "lyon", name: "Lyon", region: "Auvergne-Rhône-Alpes", population: "520,000",
            overview: "A major and affordable student city renowned for its gastronomy and high quality of life.",
            costOfLiving: { monthly: "€800–€1,200/month", rent: "€400–€600/month", food: "€200/month", transport: "€35/month", utilities: "€80/month", breakdown: [] },
            accommodation: { types: ["CROUS", "Shared"], averageRent: "€500/month", tips: "Apply for CROUS early.", resources: [] },
            studentLife: "Vibrant student scene and cultural festivals.", partTimeWork: "Hospitality, tutoring.", safety: "Very safe.",
            universities: [{
                slug: "ens-lyon", name: "École Normale Supérieure de Lyon", shortName: "ENS Lyon", founded: 1880, website: "https://www.ens-lyon.fr", type: "Public",
                worldRanking: "Top 200 globally", overview: "Highly selective Grande École.", strengths: ["Sciences", "Humanities", "Mathematics"],
                programs: [{ name: "Physics and Chemistry", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["French Baccalauréat equivalent"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.5", italian: "N/A", notes: "" },
                scholarships: ["Eiffel", "Ampère"], applicationPortal: "https://www.ens-lyon.fr" }]
        },
        {
            slug: "toulouse", name: "Toulouse", region: "Occitanie", population: "500,000",
            overview: "The 'Pink City', famous as Europe's aerospace capital.",
            costOfLiving: { monthly: "€800–€1,100/month", rent: "€400–€600/month", food: "€200/month", transport: "€30/month", utilities: "€80/month", breakdown: [] },
            accommodation: { types: ["CROUS", "Shared"], averageRent: "€450/month", tips: "Great student housing availability.", resources: [] },
            studentLife: "Huge student population, lively atmosphere.", partTimeWork: "Aerospace sector, retail.", safety: "Very safe.",
            universities: [{
                slug: "univ-toulouse", name: "Université de Toulouse", shortName: "UT", founded: 1229, website: "https://www.univ-toulouse.fr", type: "Public",
                worldRanking: "Top 300 globally", overview: "Historical and comprehensive university system.", strengths: ["Aerospace", "Engineering", "Economics"],
                programs: [{ name: "Aerospace Engineering", level: "Master", language: "Both", duration: "2 years" }],
                admissionRequirements: { bachelor: ["French Baccalauréat equivalent"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.0", italian: "N/A", notes: "" },
                scholarships: ["Eiffel"], applicationPortal: "https://www.univ-toulouse.fr" }]
        },
        {
            slug: "strasbourg", name: "Strasbourg", region: "Grand Est", population: "290,000",
            overview: "Seat of the European Parliament, with a unique cross-cultural heritage.",
            costOfLiving: { monthly: "€800–€1,100/month", rent: "€400–€600/month", food: "€200/month", transport: "€30/month", utilities: "€80/month", breakdown: [] },
            accommodation: { types: ["CROUS", "Shared"], averageRent: "€450/month", tips: "Good value for a major city.", resources: [] },
            studentLife: "International and very European atmosphere.", partTimeWork: "International institutions, tourism.", safety: "Very safe.",
            universities: [{
                slug: "unistra", name: "University of Strasbourg", shortName: "Unistra", founded: 1538, website: "https://www.unistra.fr", type: "Public",
                worldRanking: "Top 400 globally", overview: "Largest university in France with numerous Nobel laureates.", strengths: ["Chemistry", "Law", "European Studies"],
                programs: [{ name: "European Law", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["French Baccalauréat equivalent"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.0", italian: "N/A", notes: "" },
                scholarships: ["Eiffel"], applicationPortal: "https://www.unistra.fr" }]
        },
        {
            slug: "montpellier", name: "Montpellier", region: "Occitanie", population: "300,000",
            overview: "Sunny Mediterranean city with a huge student population.",
            costOfLiving: { monthly: "€800–€1,100/month", rent: "€400–€600/month", food: "€200/month", transport: "€30/month", utilities: "€80/month", breakdown: [] },
            accommodation: { types: ["CROUS", "Shared"], averageRent: "€450/month", tips: "Book early due to high demand.", resources: [] },
            studentLife: "Beaches nearby and constant student events.", partTimeWork: "Tourism, retail.", safety: "Very safe.",
            universities: [{
                slug: "univ-montpellier", name: "University of Montpellier", shortName: "UM", founded: 1289, website: "https://www.umontpellier.fr", type: "Public",
                worldRanking: "Top 400 globally", overview: "One of the oldest universities in the world.", strengths: ["Medicine", "Ecology", "Law"],
                programs: [{ name: "Ecology and Evolutionary Biology", level: "Master", language: "Both", duration: "2 years" }],
                admissionRequirements: { bachelor: ["French Baccalauréat equivalent"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.0", italian: "N/A", notes: "" },
                scholarships: ["Eiffel"], applicationPortal: "https://www.umontpellier.fr" }]
        }
`;

const spainNewCities = `
        {
            slug: "barcelona", name: "Barcelona", region: "Catalonia", population: "1.6 million",
            overview: "A global city known for its startup ecosystem, architecture, and beaches.",
            costOfLiving: { monthly: "€1,000–€1,400/month", rent: "€500–€800/month", food: "€200/month", transport: "€40/month", utilities: "€90/month", breakdown: [] },
            accommodation: { types: ["Residences", "Shared"], averageRent: "€600/month", tips: "High demand.", resources: [] },
            studentLife: "Incredible international vibe.", partTimeWork: "Tech, tourism.", safety: "Beware of pickpockets.",
            universities: [{
                slug: "ub", name: "University of Barcelona", shortName: "UB", founded: 1450, website: "https://www.ub.edu", type: "Public",
                worldRanking: "Top 200 globally", overview: "Spain's top university.", strengths: ["Medicine", "Natural Sciences"],
                programs: [{ name: "Neurosciences", level: "Master", language: "English", duration: "1.5 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.0", italian: "N/A", notes: "" },
                scholarships: ["MAEC-AECID"], applicationPortal: "https://www.ub.edu" }]
        },
        {
            slug: "valencia", name: "Valencia", region: "Valencian Community", population: "800,000",
            overview: "Affordable Mediterranean city with excellent tech and engineering schools.",
            costOfLiving: { monthly: "€800–€1,100/month", rent: "€300–€500/month", food: "€200/month", transport: "€25/month", utilities: "€70/month", breakdown: [] },
            accommodation: { types: ["Residences", "Shared"], averageRent: "€350/month", tips: "Affordable student living.", resources: [] },
            studentLife: "Relaxed lifestyle, great weather.", partTimeWork: "Tourism.", safety: "Very safe.",
            universities: [{
                slug: "upv", name: "Universitat Politècnica de València", shortName: "UPV", founded: 1968, website: "https://www.upv.es", type: "Public",
                worldRanking: "Top 400 globally", overview: "Leading technical university in Spain.", strengths: ["Engineering", "Architecture"],
                programs: [{ name: "Telecommunication Engineering", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.0", italian: "N/A", notes: "" },
                scholarships: ["Erasmus+"], applicationPortal: "https://www.upv.es" }]
        },
        {
            slug: "seville", name: "Seville", region: "Andalusia", population: "680,000",
            overview: "The heart of Andalusian culture.",
            costOfLiving: { monthly: "€700–€1,000/month", rent: "€250–€400/month", food: "€200/month", transport: "€25/month", utilities: "€70/month", breakdown: [] },
            accommodation: { types: ["Shared", "Residences"], averageRent: "€300/month", tips: "Low rents.", resources: [] },
            studentLife: "Flamenco, tapas.", partTimeWork: "Tourism-based jobs.", safety: "Very safe.",
            universities: [{
                slug: "us", name: "University of Seville", shortName: "US", founded: 1505, website: "https://www.us.es", type: "Public",
                worldRanking: "Top 500 globally", overview: "One of Spain's oldest universities.", strengths: ["Law", "Arts", "Engineering"],
                programs: [{ name: "International Relations", level: "Master", language: "Both", duration: "1 year" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.0", italian: "N/A", notes: "" },
                scholarships: ["Erasmus+"], applicationPortal: "https://www.us.es" }]
        },
        {
            slug: "granada", name: "Granada", region: "Andalusia", population: "230,000",
            overview: "Iconic student city with cheap tapas.",
            costOfLiving: { monthly: "€600–€900/month", rent: "€200–€350/month", food: "€150/month", transport: "€20/month", utilities: "€60/month", breakdown: [] },
            accommodation: { types: ["Shared", "Residences"], averageRent: "€250/month", tips: "Extremely affordable.", resources: [] },
            studentLife: "Classic Spanish student experience.", partTimeWork: "Hospitality.", safety: "Very safe.",
            universities: [{
                slug: "ugr", name: "University of Granada", shortName: "UGR", founded: 1531, website: "https://www.ugr.es", type: "Public",
                worldRanking: "Top 500 globally", overview: "Popular Erasmus destination.", strengths: ["Computer Science", "Linguistics"],
                programs: [{ name: "Data Science and Computer Engineering", level: "Master", language: "English", duration: "1.5 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 6.0", italian: "N/A", notes: "" },
                scholarships: ["Erasmus+"], applicationPortal: "https://www.ugr.es" }]
        }
`;

const lithuaniaNewCities = `
        {
            slug: "kaunas", name: "Kaunas", region: "Kaunas County", population: "290,000",
            overview: "Lithuania's second-largest city, a major hub for technology.",
            costOfLiving: { monthly: "€500–€800/month", rent: "€200–€400/month", food: "€150/month", transport: "€15/month", utilities: "€60/month", breakdown: [] },
            accommodation: { types: ["Dorms", "Shared"], averageRent: "€250/month", tips: "Dorms are very cheap.", resources: [] },
            studentLife: "Active nightlife.", partTimeWork: "IT, logistics.", safety: "Very safe.",
            universities: [{
                slug: "ktu", name: "Kaunas University of Technology", shortName: "KTU", founded: 1922, website: "https://en.ktu.edu", type: "Public",
                worldRanking: "Top 800 globally", overview: "Leading technological university in the Baltics.", strengths: ["Engineering", "IT", "Business"],
                programs: [{ name: "Artificial Intelligence", level: "Bachelor", language: "English", duration: "4 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 5.5", italian: "N/A", notes: "" },
                scholarships: ["State grants"], applicationPortal: "https://en.ktu.edu" }]
        },
        {
            slug: "klaipeda", name: "Klaipeda", region: "Klaipeda County", population: "150,000",
            overview: "Coastal city with a focus on maritime studies.",
            costOfLiving: { monthly: "€500–€800/month", rent: "€200–€400/month", food: "€150/month", transport: "€15/month", utilities: "€60/month", breakdown: [] },
            accommodation: { types: ["Dorms", "Shared"], averageRent: "€250/month", tips: "Plenty of affordable housing.", resources: [] },
            studentLife: "Relaxed seaside lifestyle.", partTimeWork: "Port-related industries.", safety: "Very safe.",
            universities: [{
                slug: "ku", name: "Klaipeda University", shortName: "KU", founded: 1991, website: "https://www.ku.lt", type: "Public",
                worldRanking: "Top 1200 globally", overview: "Known for marine sciences and health.", strengths: ["Marine Sciences", "Health Sciences"],
                programs: [{ name: "Marine Environment", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 5.5", italian: "N/A", notes: "" },
                scholarships: ["State grants"], applicationPortal: "https://www.ku.lt" }]
        },
        {
            slug: "siauliai", name: "Šiauliai", region: "Siauliai County", population: "100,000",
            overview: "A quieter, extremely affordable city.",
            costOfLiving: { monthly: "€400–€700/month", rent: "€150–€300/month", food: "€150/month", transport: "€15/month", utilities: "€50/month", breakdown: [] },
            accommodation: { types: ["Dorms", "Shared"], averageRent: "€200/month", tips: "Lowest costs in Lithuania.", resources: [] },
            studentLife: "Calm and peaceful.", partTimeWork: "Local businesses.", safety: "Very safe.",
            universities: [{
                slug: "vu-siauliai", name: "Vilnius University Šiauliai Academy", shortName: "VUSA", founded: 1997, website: "https://www.sa.vu.lt", type: "Public",
                worldRanking: "Top 650 globally", overview: "Regional academy of Vilnius University.", strengths: ["Education", "Public Administration"],
                programs: [{ name: "Special Education", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 5.5", italian: "N/A", notes: "" },
                scholarships: ["State grants"], applicationPortal: "https://www.sa.vu.lt" }]
        },
        {
            slug: "panevezys", name: "Panevėžys", region: "Panevezys County", population: "85,000",
            overview: "A specialized hub for robotics and business.",
            costOfLiving: { monthly: "€400–€700/month", rent: "€150–€300/month", food: "€150/month", transport: "€15/month", utilities: "€50/month", breakdown: [] },
            accommodation: { types: ["Dorms", "Shared"], averageRent: "€200/month", tips: "Dorms are readily available.", resources: [] },
            studentLife: "Community focused.", partTimeWork: "Engineering, tech.", safety: "Very safe.",
            universities: [{
                slug: "ktu-panevezys", name: "KTU Panevėžys Faculty", shortName: "KTU PTVF", founded: 1965, website: "https://ptvf.ktu.edu", type: "Public",
                worldRanking: "Top 800 globally", overview: "Specialized faculty focused on tech.", strengths: ["Robotics", "Management"],
                programs: [{ name: "Control Technologies", level: "Master", language: "English", duration: "2 years" }],
                admissionRequirements: { bachelor: ["High school diploma"], master: ["Bachelor's degree"] }, languageRequirements: { english: "IELTS 5.5", italian: "N/A", notes: "" },
                scholarships: ["State grants"], applicationPortal: "https://ptvf.ktu.edu" }]
        }
`;

const germanyTarget = `                    applicationPortal: "https://www.fu-berlin.de/en/studium/international/",
                },
            ],
        },`;

const franceTarget = `                    applicationPortal: "https://www.universite-paris-saclay.fr/en/admissions",
                },
            ],
        },`;

const spainTarget = `                    applicationPortal: "https://www.ucm.es/admision-y-acceso",
                },
            ],
        },`;

const lithuaniaTarget = `                    applicationPortal: "https://www.vu.lt/en/studies/international-students",
                },
            ],
        },`;

content = content.replace(germanyTarget, germanyTarget + "\\n" + germanyNewCities);
content = content.replace(franceTarget, franceTarget + "\\n" + franceNewCities);
content = content.replace(spainTarget, spainTarget + "\\n" + spainNewCities);
content = content.replace(lithuaniaTarget, lithuaniaTarget + "\\n" + lithuaniaNewCities);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Replaced cities successfully");
