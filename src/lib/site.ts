export const site = {
  name: 'Windtask',
  description:
    'Field notes on coding agents, leftover cloud infrastructure, and the bills that outlive the chat.',
  descriptionZh: '关于编程代理、会话留下的云资源，以及对话结束后仍在计费的现场笔记。',
  url: 'https://windtask.com',
  adsenseAccount: 'ca-pub-7256473819820075',
} as const;

export function formatDate(date: Date, lang: 'en' | 'zh' = 'en'): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatDateCompact(date: Date, lang: 'en' | 'zh' = 'en'): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function readingMinutes(body: string | undefined, lang: 'en' | 'zh' = 'en'): number {
  if (!body) return 1;
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_~`|]/g, ' ');
  if (lang === 'zh') {
    const chars = text.replace(/\s+/g, '').length;
    return Math.max(1, Math.round(chars / 450));
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
