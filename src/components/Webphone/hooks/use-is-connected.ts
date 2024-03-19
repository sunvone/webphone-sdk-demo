import { useEffect, useState } from 'react';
import { ClientStatus } from '@atlasat/webphone-sdk';
import { useClient } from '..';

const useIsConnected = () => {
  const { client } = useClient();
  const [status, setConnected] = useState<{ isConnected: boolean; state: ClientStatus }>({
    isConnected: false,
    state: ClientStatus.DISCONNECTED,
  });
  useEffect(() => {
    const listener = (state: ClientStatus) => {
      switch (state) {
        case ClientStatus.CONNECTED:
          setConnected({ isConnected: true, state });
          break;
        default:
          setConnected({ isConnected: false, state });
          break;
      }
    };
    if (client) {
      client.on('status', listener);
    }

    return () => {
      if (client) {
        client.removeListener('status', listener);
      }
    };
  }, [client]);
  return status;
};

export default useIsConnected;
