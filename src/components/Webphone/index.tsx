import { Client, IClient, IClientOptions, ISession } from '@atlasat/webphone-sdk';
import { modals } from '@mantine/modals';
import React, { createContext, useEffect, useState } from 'react';

interface ClientProviderProps {
  client?: IClient;
  instance: (options: IClientOptions) => Promise<void | IClient>;
}

export const ClientContext = createContext<ClientProviderProps>({
  instance: () => Promise.resolve(),
});

const WebphoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<IClient>();
  const instance = (options: IClientOptions) => {
    const clientInstance = new Client(options);
    setClient(clientInstance);
    return Promise.resolve(clientInstance);
  };

  /**
   * open modal
   * @param session
   * @returns
   */
  const openModal = (session: ISession) =>
    modals.openConfirmModal({
      title: 'New Incoming Call',
      children: <>New Incoming call from {session.remoteIdentity.phoneNumber}</>,
      labels: { confirm: 'Accept', cancel: 'Reject' },
      onCancel: () => session.reject(),
      onConfirm: () => session.accept(),
    });

  useEffect(() => {
    const listener = (session: ISession) => {
      openModal(session);
    };
    if (client) {
      /**
       * event when receive new call
       */
      client.on('invite', listener);
    }

    /**
     * unmount component
     */
    return () => {
      client?.removeListener('invite', listener);
    };
  }, [client]);

  return <ClientContext.Provider value={{ instance, client }}>{children}</ClientContext.Provider>;
};
export const useClient = () => React.useContext(ClientContext);

export default WebphoneProvider;
