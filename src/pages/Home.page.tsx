/* eslint-disable no-console */
import { Container, Grid, Group, Title, Text, TextInput, Button, Badge } from '@mantine/core';
import { useRef } from 'react';
import RegisterWebphone from './ui/register';
import ConnectedStatus from './ui/connected';
import Sessions from './ui/sessions';
import { useClient } from '@/components/Webphone';
import useAccount from '@/components/Webphone/hooks/use-account';

export function HomePage() {
  const { client } = useClient();
  const account = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container mt="lg" size="lg">
      <Title order={4}>Example demo sdk</Title>
      <Grid mt="md">
        <Grid.Col span={3}>
          <RegisterWebphone />
        </Grid.Col>
        <Grid.Col span={9}>
          <Group>
            <Text>Status</Text>
            <ConnectedStatus />
            <Text>Account: </Text>
            <Badge color="gray">{account?.user || 'No user connected'}</Badge>
          </Group>
          <Group mt="md">
            <TextInput ref={inputRef} placeholder="sip:number@domain.com" />
            <Button
              onClick={() => {
                if (inputRef.current) {
                  client?.invite(inputRef.current.value, { earlyMedia: true }).then(() => {});
                }
              }}
            >
              Dial
            </Button>
          </Group>
          <Title order={4} mt="md" mb="md">
            Sessions
          </Title>
          <Sessions />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
