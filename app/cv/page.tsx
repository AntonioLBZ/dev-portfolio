import { CVClient } from '@/components/cv/cv-client';
import cvData from '@/content/cv.json';
import type { CVData } from '@/types/cv';

export default function CVPage() {
    return <CVClient cv={cvData as CVData} />;
}
