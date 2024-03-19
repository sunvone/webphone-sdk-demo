import { ISession } from '@atlasat/webphone-sdk';
import { useEffect, useState } from 'react';

const useSessionDuration = (session: ISession) => {
  const [duration, setDuration] = useState<number>(0);
  useEffect(() => {
    const listener = (data: number) => {
      setDuration(data);
    };
    session.on('duration', listener);

    return () => {
      session.removeListener('duration', listener);
    };
  }, []);

  return duration;
};

export default useSessionDuration;
