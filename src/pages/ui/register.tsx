import { Box, Button, Group, PasswordInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
import { useClient } from '@/components/Webphone';
import useIsConnected from '@/components/Webphone/hooks/use-is-connected';

const RegisterWebphone: React.FC = () => {
  const form = useForm<{
    type: 'token' | 'credential';
    token: string;
    user: string;
    name: string;
    password: string;
    uri: string;
    ws: string;
  }>({
    initialValues: {
      type: 'token',
      token: '',
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
            type: values.type,
            token: values.token,
            account: {
              user: values.user,
              uri: values.uri,
              name: values.name,
              password: values.password,
            },
            transport: {
              wsServers: values.ws,
            },
            media: {
              input: {
                id: undefined,
                volume: 0.8,
                audioProcessing: true,
                muted: false,
              },
              output: {
                id: undefined,
                volume: 0.5,
                muted: false,
              },
            },
          }).then((result) => {
            if (result) {
              result.init().then(() => {
                result.connect();
              });
            }
          });
        })}
      >
        <Select
          label="Auth type"
          data={[
            { label: 'Token', value: 'token' },
            { label: 'Credential', value: 'credential' },
          ]}
          {...form.getInputProps('type')}
        />
        {form.values.type === 'token' ? (
          <TextInput label="Token" placeholder="Your token" {...form.getInputProps('token')} />
        ) : (
          <>
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
          </>
        )}

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
