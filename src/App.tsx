import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Router } from './Router';
import { theme } from './theme';
import WebphoneProvider from './components/Webphone';

import '@mantine/notifications/styles.css';

export default function App() {
  return (
    <WebphoneProvider>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Router />
        </ModalsProvider>
      </MantineProvider>
    </WebphoneProvider>
  );
}
