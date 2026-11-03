export const site = {
  name: 'Windtask',
  description:
    'Field notes on coding agents, leftover cloud infrastructure, and the bills that outlive the chat.',
  url: 'https://windtask.com',
  adsenseAccount: 'ca-pub-7256473819820075',
} as const;

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
