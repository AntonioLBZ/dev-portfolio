export interface ProjectLinks {
    repo?: string;
    live?: string;
}

export interface Project {
    slug: string;
    title: string;
    summary: string;
    description: string[];
    year: string;
    role: string;
    stack: string[];
    cover?: string;
    accent?: string;
    links: ProjectLinks;
    featured: boolean;
    placeholder?: boolean;
}
