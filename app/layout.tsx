import type { Metadata } from 'next';
import '@fontsource/gowun-dodum/400.css';
import './globals.css';
export const metadata: Metadata = { title:'내 인생 날씨', description:'태어난 날부터 오늘까지, 내가 살아온 날씨의 기록' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ko"><body>{children}</body></html> }
