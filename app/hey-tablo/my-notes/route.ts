import { readFile } from 'node:fs/promises';
import path from 'node:path';
export const runtime = 'nodejs';
export async function GET() {
  const html = await readFile(path.join(process.cwd(),'public/english-notes/my-notes.html'),'utf8');
  return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, noarchive','X-Content-Type-Options':'nosniff'}});
}
