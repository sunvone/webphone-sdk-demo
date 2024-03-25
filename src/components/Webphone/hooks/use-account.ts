import { useEffect, useState } from 'react';
import { ClientStatus, IAccount } from '@atlasat/webphone-sdk';
import { useClient } from '..';

const useAccount = () => {
  const { client } = useClient();
  const [account, setAccount] = useState<IAccount>();
  useEffect(() => {
    const listener = (state: ClientStatus) => {
      switch (state) {
        case ClientStatus.CONNECTED:
          setAccount(client?.account);
          break;
        default:
          setAccount(undefined);
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
  return account;
};

export default useAccount;
