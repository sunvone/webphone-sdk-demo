import { Box, Button, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
import { useClient } from '@/components/Webphone';
import useIsConnected from '@/components/Webphone/hooks/use-is-connected';

const RegisterWebphone: React.FC = () => {
  const form = useForm({
    initialValues: {
      user: '',
      name: '',
      password: '',
      uri: '',
      ws: '',
    },
  });
  const { instance, client } = useClient();
  const { isConnected } = useIsConnected();

  return (
    <Box maw={340} mx="auto">
      <form
        onSubmit={form.onSubmit((values) => {
          instance({
            account: values,
            transport: {
              wsServers: values.ws,
            },
          }).then((result) => {
            if (result) {
              result.connect();
            }
          });
        })}
      >
        <TextInput
          label="Ws server"
          placeholder="wss://your-sip-provider.tld:8089/ws"
          {...form.getInputProps('ws')}
        />
        <TextInput
          label="Uri"
          placeholder="sip:201002@your-sip-provider.tld"
          {...form.getInputProps('uri')}
        />
        <TextInput label="Name" placeholder="example: 201002" {...form.getInputProps('name')} />
        <TextInput label="User" placeholder="example: 201002" {...form.getInputProps('user')} />
        <PasswordInput
          autoComplete="new-password"
          label="Password"
          {...form.getInputProps('password')}
        />
        <Group>
          <Button type="submit" mt="md" disabled={isConnected}>
            Register
          </Button>
          <Button
            disabled={!isConnected}
            variant="default"
            mt="md"
            onClick={() => client?.disconnect()}
          >
            Unregister
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default RegisterWebphone;
