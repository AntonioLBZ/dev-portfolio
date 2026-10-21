import cvData from '@/content/cv.json';
import projects from '@/content/projects.json';
import type { CVData } from '@/types/cv';
import type { Project } from '@/types/project';

const typedCvData = cvData as CVData;
const typedProjects = projects as Project[];

const spanishMonths = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export interface Profile {
    name: string;
    title: string;
    city: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    about: string;
}

export interface Employers {
    // Role without an end date
    current?: string;
    previous: string[];
}

export interface ExperienceGroup {
    company: string;
    location: string;
    roles: {
        position: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
}

export function getProfile(): Profile {
    // Address is "city, region, country": only the first and last parts are exposed
    const parts = typedCvData.personalInfo.address
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
    const city = parts[0] ?? '';
    const country = parts.length > 1 ? parts[parts.length - 1] : '';

    return {
        name: typedCvData.personalInfo.name,
        title: typedCvData.personalInfo.title,
        city,
        location: [city, country].filter(Boolean).join(', '),
        email: typedCvData.personalInfo.email,
        linkedin: typedCvData.personalInfo.linkedin,
        github: typedCvData.personalInfo.github,
        about: typedCvData.about,
    };
}

export function getExperience(): ExperienceGroup[] {
    const groups: ExperienceGroup[] = [];

    for (const exp of typedCvData.experience) {
        const lastGroup = groups[groups.length - 1];

        if (lastGroup && lastGroup.company === exp.company && lastGroup.location === exp.location) {
            lastGroup.roles.push({
                position: exp.position,
                startDate: exp.startDate,
                endDate: exp.endDate,
                description: exp.description,
            });
        } else {
            groups.push({
                company: exp.company,
                location: exp.location,
                roles: [
                    {
                        position: exp.position,
                        startDate: exp.startDate,
                        endDate: exp.endDate,
                        description: exp.description,
                    },
                ],
            });
        }
    }

    return groups;
}

export function getEmployers(): Employers {
    const groups = getExperience();
    const current = groups.find((group) => group.roles.some((role) => role.endDate === 'Actual'))?.company;
    const previous = [...new Set(groups.map((group) => group.company).filter((company) => company !== current))];

    return { current, previous };
}

export function getEducation() {
    return typedCvData.education;
}

export function getCertifications() {
    return [...typedCvData.certifications].sort((a, b) => {
        const dateA = new Date(a.issueDate.split('/').reverse().join('-'));
        const dateB = new Date(b.issueDate.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
    });
}

export function getLanguages() {
    return typedCvData.languages;
}

export function getSkills() {
    return typedCvData.skills;
}

export function getProjects(): Project[] {
    return typedProjects;
}

export function getProject(slug: string): Project | undefined {
    return typedProjects.find((p) => p.slug === slug);
}

export function formatDate(date: string): string {
    const match = date.match(/^(\d{2})\/(\d{4})$/);
    if (!match) {
        return date;
    }

    const [, month, year] = match;
    const monthIndex = parseInt(month, 10) - 1;

    if (monthIndex < 0 || monthIndex > 11) {
        return date;
    }

    return `${spanishMonths[monthIndex]} ${year}`;
}
