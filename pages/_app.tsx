import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme } from '../themes';
import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider theme={ lightTheme } >
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Component {...pageProps} />
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default MyApp