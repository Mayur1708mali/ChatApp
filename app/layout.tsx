import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Chat App',
	description: 'Created by Rinku',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<ThemeProvider attribute='class' defaultTheme='dark'>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
