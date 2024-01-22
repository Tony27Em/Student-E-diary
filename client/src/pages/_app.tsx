import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { DataProvider } from '@/context/dataContext';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <ThemeProvider enableSystem={false}>
        <DataProvider>
          <NextNProgress options={{ showSpinner: false }} />
          <Component {...pageProps} />
        </DataProvider>
      </ThemeProvider>
    </>
  )
}
