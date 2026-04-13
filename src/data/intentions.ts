/**
 * Daily intentions / quotes
 * Rotates based on day of year, so every day shows a different one
 */

export type DailyIntention = {
  quote: string;
  author?: string;
  theme: 'focus' | 'calm' | 'action' | 'growth';
};

export const DAILY_INTENTIONS: DailyIntention[] = [
  { quote: 'O dia de hoje e o unico que tens.', theme: 'action' },
  { quote: 'Nao ha caminho pequeno para quem vai na direcao certa.', theme: 'focus' },
  { quote: 'A melhor altura para plantar uma arvore foi ha 20 anos. A segunda melhor e agora.', author: 'Proverbio chines', theme: 'action' },
  { quote: 'Nao sejas prisioneiro do barulho do mundo.', theme: 'calm' },
  { quote: 'Pequenos habitos sao os juros compostos da auto-melhoria.', author: 'James Clear', theme: 'growth' },
  { quote: 'Quem domina a si proprio e mais forte do que quem conquista cidades.', author: 'Lao Tzu', theme: 'focus' },
  { quote: 'A mente e tudo. Aquilo em que pensas, e no que te tornas.', author: 'Buda', theme: 'growth' },
  { quote: 'O sofrimento vem da resistencia. A paz vem da aceitacao.', theme: 'calm' },
  { quote: 'Nao procures aprovacao. Procura resultados.', theme: 'action' },
  { quote: 'O que nao e medido nao melhora.', theme: 'growth' },
  { quote: 'A disciplina e escolher entre o que queres agora e o que queres mais.', theme: 'focus' },
  { quote: 'Faz hoje o que eles nao querem fazer, para viveres amanha como eles nao podem.', theme: 'action' },
  { quote: 'A vida e 10% o que te acontece e 90% como reages.', author: 'Charles Swindoll', theme: 'growth' },
  { quote: 'Respira. Estas vivo. Isso ja e um milagre.', theme: 'calm' },
  { quote: 'Nao comeces quando estiveres pronto. Fica pronto comecando.', theme: 'action' },
  { quote: 'O melhor investimento e em ti proprio.', author: 'Warren Buffett', theme: 'growth' },
  { quote: 'A simplicidade e a suprema sofisticacao.', author: 'Leonardo da Vinci', theme: 'calm' },
  { quote: 'Nao te compares com os outros. Compara-te com quem foste ontem.', theme: 'focus' },
  { quote: 'O tempo que gostas de perder nao e tempo perdido.', author: 'Bertrand Russell', theme: 'calm' },
  { quote: 'A persistencia e a genialidade dos comuns.', theme: 'action' },
  { quote: 'Foca-te no que podes controlar. Aceita o resto.', theme: 'calm' },
  { quote: 'Nao ha atalhos para qualquer lugar que valha a pena ir.', author: 'Beverly Sills', theme: 'focus' },
  { quote: 'A maior riqueza e a saude.', author: 'Virgilio', theme: 'growth' },
  { quote: 'Quem tem um porque, suporta qualquer como.', author: 'Nietzsche', theme: 'focus' },
  { quote: 'O sucesso e a soma de pequenos esforcos repetidos dia apos dia.', author: 'Robert Collier', theme: 'action' },
  { quote: 'Hoje e um bom dia para comecar.', theme: 'action' },
  { quote: 'A paz comeca com um sorriso.', author: 'Madre Teresa', theme: 'calm' },
  { quote: 'Aprende como se fosses viver para sempre. Vive como se fosses morrer amanha.', theme: 'growth' },
  { quote: 'Aquilo que fazes diariamente importa mais do que o que fazes ocasionalmente.', author: 'Gretchen Rubin', theme: 'focus' },
  { quote: 'Nao deixes o bom ser inimigo do perfeito.', theme: 'action' },
];

export function getTodayIntention(): DailyIntention {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return DAILY_INTENTIONS[dayOfYear % DAILY_INTENTIONS.length];
}
