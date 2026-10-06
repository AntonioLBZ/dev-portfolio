export interface PersonalInfo {
    name: string;
    title: string;
    birthDate: string;
    nationality: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
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
}

export interface Language {
    language: string;
    level: string;
    certificate: string;
}

export interface Skills {
    main: string[];
    tools: string[];
    languages: string[];
    appProgramming: string[];
    webServices: string[];
    workSkills: string[];
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
