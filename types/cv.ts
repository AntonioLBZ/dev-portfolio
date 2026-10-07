export interface PersonalInfo {
    name: string;
    title: string;
    birthDate: string;
    nationality: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
}

export interface Experience {
    company: string;
    location: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    title: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Certification {
    title: string;
    issuer: string;
    issueDate: string;
    credentialId: string;
    credentialUrl?: string;
}

export interface Language {
    language: string;
    level: string;
    certificate: string;
}

export interface Skills {
    frontend: string[];
    quality: string[];
    tools: string[];
    ai: string[];
    backend: string[];
    otherLanguages: string[];
}

export interface CVData {
    personalInfo: PersonalInfo;
    about: string;
    experience: Experience[];
    education: Education[];
    certifications: Certification[];
    languages: {
        native: string[];
        other: Language[];
    };
    skills: Skills;
}
