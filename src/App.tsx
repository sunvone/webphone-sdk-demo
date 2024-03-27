import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
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
        <Notifications />
        <ModalsProvider>
          <Router />
        </ModalsProvider>
      </MantineProvider>
    </WebphoneProvider>
  );
}
