import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// AI crawlers: model training, AI search and assistant fetchers
const AI_BOTS = [
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'anthropic-ai',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'PerplexityBot',
    'Perplexity-User',
    'Meta-ExternalAgent',
    'Meta-ExternalFetcher',
    'FacebookBot',
    'Bytespider',
    'Amazonbot',
    'cohere-ai',
    'cohere-training-data-crawler',
    'MistralAI-User',
    'DuckAssistBot',
    'Diffbot',
    'Omgilibot',
    'Timpibot',
    'ImagesiftBot',
    'PetalBot',
    'YouBot',
    'AI2Bot',
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: AI_BOTS, disallow: '/' },
            { userAgent: '*', allow: '/' },
        ],
    };
}
