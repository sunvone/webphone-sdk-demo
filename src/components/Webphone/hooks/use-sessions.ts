import { useEffect, useState } from 'react';
import { ISession } from '@atlasat/webphone-sdk';
import { useClient } from '..';

const useSessions = () => {
  const { client } = useClient();
  const [sessions, setSessions] = useState<ISession[]>([]);
  useEffect(() => {
    const sessionAdded = () => {
      if (client) {
        const allSession = client.getSessions();
        allSession.forEach((session) => {
          session.on('statusUpdate', () => setSessions(client.getSessions()));
          session.on('mute', () => setSessions(client.getSessions()));
          session.localStream?.addEventListener('addtrack', () =>
            setSessions(client.getSessions())
          );
        });
        setSessions(allSession);
      }
    };

    const sessionRemoved = () => {
      if (client) {
        setSessions(client.getSessions());
      }
    };

    if (client) {
      client.on('sessionAdded', sessionAdded);
      client.on('sessionRemoved', sessionRemoved);
    }

    return () => {
      if (client) {
        client.removeListener('sessionAdded', sessionAdded);
        client.removeListener('sessionRemoved', sessionRemoved);
      }
    };
  }, [client]);

  return sessions;
};

export default useSessions;
