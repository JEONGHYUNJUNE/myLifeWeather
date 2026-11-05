import { readFile } from 'node:fs/promises';
import path from 'node:path';
import episodes from '@/data/hey-tablo/episodes.json';

export const runtime = 'nodejs';
export async function GET(_request: Request, { params }: { params: Promise<{ episode: string }> }) {
  const { episode } = await params;
  const entry = episodes.find(item => String(item.number) === episode);
  if (!entry) return new Response('회차를 찾을 수 없습니다.', { status: 404 });
  const html = await readFile(path.join(process.cwd(), 'public', 'hey-tablo', `ep-${entry.number}.html`), 'utf8');
  return new Response(html, { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'X-Robots-Tag': 'noindex, noarchive',
    'X-Content-Type-Options': 'nosniff',
  } });
}
