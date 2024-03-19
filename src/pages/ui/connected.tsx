import { Badge } from '@mantine/core';
import React from 'react';
import useIsConnected from '@/components/Webphone/hooks/use-is-connected';

const ConnectedStatus: React.FC = () => {
  const { isConnected, state } = useIsConnected();
  return <Badge color={isConnected ? 'green' : 'gray'}>{state}</Badge>;
};

export default ConnectedStatus;
