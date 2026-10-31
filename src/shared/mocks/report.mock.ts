import type { Report } from '@/shared/types'

const readme = `# LinkNest

Portfolio para developers: reúne tus proyectos, enlaces y stack en una sola página.

## Instalación

\`\`\`bash
git clone https://github.com/eddiedev14/linknest.git
cd linknest
npm install
\`\`\`

## Uso

Ejecuta \`npm run dev\` y abre http://localhost:5173. Edita \`src/data/profile.js\`
con tu nombre, redes y proyectos destacados.

## Licencia

MIT
`

export const mockReport: Report = {
  repo: 'eddiedev14/linknest',
  owner: 'eddiedev14',
  name: 'linknest',
  url: 'https://github.com/eddiedev14/linknest',
  description: 'Portfolio para developers',
  stars: 12,
  forks: 3,
  license: 'MIT',
  createdAt: '2026-01-10',
  languages: [
    { name: 'JavaScript', percent: 62.4 },
    { name: 'CSS', percent: 20.1 },
    { name: 'HTML', percent: 9.8 },
    { name: 'TypeScript', percent: 5.4 },
    { name: 'Shell', percent: 2.3 },
  ],
  contributors: [45, 20, 12, 5, 3, 2].map((commits, i) => ({
    user: ['eddiedev14', 'ana-dev', 'carlosm', 'lauraq', 'jpereira', 'sofi-codes'][i],
    avatar: `https://avatars.githubusercontent.com/u/${i + 1}?v=4`,
    commits,
  })),
  commitsPerWeek: [3, 5, 8, 4, 10, 7, 12, 6, 9, 11, 5, 7].map((commits, i) => ({
    // Lunes consecutivos desde 2026-08-10
    week: new Date(Date.UTC(2026, 7, 10 + i * 7)).toISOString().slice(0, 10),
    commits,
  })),
  issues: { open: 4, closed: 12 },
  readme,
  isEmptyRepo: false,
}

export const mockReportEmpty: Report = {
  repo: 'demo/repo-vacio',
  owner: 'demo',
  name: 'repo-vacio',
  url: 'https://github.com/demo/repo-vacio',
  description: null,
  stars: 0,
  forks: 0,
  license: null,
  createdAt: '2026-10-30',
  languages: [],
  contributors: [],
  commitsPerWeek: [],
  issues: { open: 0, closed: 0 },
  readme: null,
  isEmptyRepo: true,
}

export const mockReportManyLanguages: Report = {
  ...mockReport,
  languages: [
    ['TypeScript', 40], ['JavaScript', 20], ['CSS', 12], ['HTML', 8], ['Python', 6],
    ['Shell', 5], ['Dockerfile', 4], ['Makefile', 3], ['Lua', 2],
  ].map(([name, percent]) => ({ name: name as string, percent: percent as number })),
}
