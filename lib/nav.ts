export const NAV_ITEMS = [
    { id: 'sobre-mi', index: '01', label: 'Sobre mí' },
    { id: 'experiencia', index: '02', label: 'Experiencia' },
    { id: 'stack', index: '03', label: 'Stack' },
    { id: 'proyectos', index: '04', label: 'Proyectos' },
    { id: 'formacion', index: '05', label: 'Formación' },
    { id: 'contacto', index: '06', label: 'Contacto' },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]['id'];
