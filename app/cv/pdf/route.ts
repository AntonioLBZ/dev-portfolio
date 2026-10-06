import { NextResponse } from 'next/server';
import cvData from '@/content/cv.json';
import type { CVData } from '@/types/cv';

export async function GET() {
    const cv = cvData as CVData;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${cv.personalInfo.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #ffffff;
            padding: 2rem;
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid #3b82f6;
        }
        .name {
            font-size: 2rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 0.25rem;
        }
        .title {
            font-size: 1.1rem;
            color: #3b82f6;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        .info {
            color: #666;
            font-size: 0.95rem;
        }
        .container {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        .sidebar {
            font-size: 0.9rem;
        }
        .main {
            font-size: 0.95rem;
        }
        .section {
            margin-bottom: 1.5rem;
        }
        .section-title {
            font-size: 1rem;
            font-weight: 700;
            color: #3b82f6;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.75rem;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid #e5e7eb;
        }
        .contact-item {
            margin-bottom: 0.5rem;
        }
        .language-group {
            margin-bottom: 1rem;
        }
        .language-title {
            font-size: 0.8rem;
            font-weight: 600;
            color: #666;
            margin-bottom: 0.25rem;
        }
        .language-level {
            font-weight: 600;
            color: #3b82f6;
        }
        .language-certificate {
            font-size: 0.8rem;
            color: #666;
        }
        .skill-group {
            margin-bottom: 1rem;
        }
        .skill-title {
            font-size: 0.8rem;
            font-weight: 600;
            color: #666;
            margin-bottom: 0.25rem;
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
        }
        .tag {
            display: inline-block;
            padding: 0.125rem 0.5rem;
            background: #eff6ff;
            color: #3b82f6;
            border-radius: 4px;
            font-size: 0.75rem;
        }
        .timeline-item {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #f3f4f6;
        }
        .timeline-item:last-child {
            border-bottom: none;
        }
        .timeline-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.25rem;
        }
        .timeline-title {
            font-size: 1rem;
            font-weight: 600;
        }
        .timeline-date {
            font-size: 0.85rem;
            color: #3b82f6;
            font-weight: 500;
        }
        .timeline-company {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.25rem;
        }
        .timeline-description {
            font-size: 0.9rem;
            color: #444;
        }
        .credential-id {
            font-size: 0.75rem;
            color: #999;
        }
        .about-text {
            line-height: 1.7;
        }
        @media print {
            body { padding: 1rem; }
            .container { grid-template-columns: 260px 1fr; }
        }
    </style>
</head>
<body>
    <header class="header">
        <h1 class="name">${cv.personalInfo.name}</h1>
        <p class="title">${cv.personalInfo.title}</p>
        <p class="info">Fecha de nacimiento: ${cv.personalInfo.birthDate} · Nacionalidad: ${cv.personalInfo.nationality}</p>
    </header>

    <div class="container">
        <aside class="sidebar">
            <div class="section">
                <h2 class="section-title">Contacto</h2>
                <div class="contact-item">📍 ${cv.personalInfo.address}</div>
                <div class="contact-item">✉️ ${cv.personalInfo.email}</div>
                <div class="contact-item">📞 ${cv.personalInfo.phone}</div>
                ${cv.personalInfo.linkedin ? `<div class="contact-item">💼 <a href="${cv.personalInfo.linkedin}">LinkedIn</a></div>` : ''}
            </div>

            <div class="section">
                <h2 class="section-title">Idiomas</h2>
                <div class="language-group">
                    <h3 class="language-title">Lengua materna</h3>
                    ${cv.languages.native.map((l) => `<span class="tag">${l}</span>`).join(' ')}
                </div>
                ${cv.languages.other.map((lang) => `
                    <div class="language-group">
                        <h3 class="language-title">${lang.language}</h3>
                        <p class="language-level">Nivel: ${lang.level}</p>
                        ${lang.certificate ? `<p class="language-certificate">${lang.certificate}</p>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <h2 class="section-title">Competencias</h2>
                <div class="skill-group">
                    <h3 class="skill-title">Aptitudes principales</h3>
                    <div class="tags">${cv.skills.main.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
                </div>
                <div class="skill-group">
                    <h3 class="skill-title">Herramientas</h3>
                    <div class="tags">${cv.skills.tools.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
                </div>
                <div class="skill-group">
                    <h3 class="skill-title">Lenguajes de programación</h3>
                    <div class="tags">${cv.skills.languages.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
                </div>
                <div class="skill-group">
                    <h3 class="skill-title">Programación de aplicaciones</h3>
                    <div class="tags">${cv.skills.appProgramming.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
                </div>
                <div class="skill-group">
                    <h3 class="skill-title">Servicios web</h3>
                    <div class="tags">${cv.skills.webServices.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
                </div>
                <div class="skill-group">
                    <h3 class="skill-title">Capacidades de trabajo</h3>
                    <div class="tags">${cv.skills.workSkills.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
                </div>
            </div>
        </aside>

        <main class="main">
            <div class="section">
                <h2 class="section-title">Sobre mí</h2>
                <p class="about-text">${cv.about}</p>
            </div>

            <div class="section">
                <h2 class="section-title">Experiencia laboral</h2>
                ${cv.experience.map((exp) => `
                    <div class="timeline-item">
                        <div class="timeline-header">
                            <h3 class="timeline-title">${exp.position}</h3>
                            <span class="timeline-date">${exp.startDate} – ${exp.endDate}</span>
                        </div>
                        <p class="timeline-company">${exp.company} · ${exp.location}</p>
                        ${exp.description ? `<p class="timeline-description">${exp.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <h2 class="section-title">Educación</h2>
                ${cv.education.map((edu) => `
                    <div class="timeline-item">
                        <div class="timeline-header">
                            <h3 class="timeline-title">${edu.title}</h3>
                            <span class="timeline-date">${edu.startDate} – ${edu.endDate}</span>
                        </div>
                        <p class="timeline-company">${edu.institution} · ${edu.location}</p>
                        ${edu.description ? `<p class="timeline-description">${edu.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <h2 class="section-title">Certificaciones</h2>
                ${cv.certifications.map((cert) => `
                    <div class="timeline-item">
                        <div class="timeline-header">
                            <h3 class="timeline-title">${cert.title}</h3>
                            <span class="timeline-date">${cert.issueDate}</span>
                        </div>
                        <p class="timeline-company">${cert.issuer}</p>
                        ${cert.credentialId ? `<p class="credential-id">ID: ${cert.credentialId}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </main>
    </div>
</body>
</html>
    `;

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `attachment; filename="CV_${cv.personalInfo.name.replace(/\s+/g, '_')}.html"`,
        },
    });
}
