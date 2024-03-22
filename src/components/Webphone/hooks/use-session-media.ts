import { ISession } from '@atlasat/webphone-sdk';
import { useEffect, useState } from 'react';

const useSessionMedia = (session: ISession) => {
  const [muted, setMute] = useState<boolean>(session.media.output.muted);
  const [volume, setVolume] = useState<number>(session.media.output.volume);
  const [volumeInput, setVolumeInput] = useState<number>(session.media.input.volume);

  useEffect(() => {
    session.media.on('outputMuted', setMute);
    session.media.on('outputVolume', setVolume);
    session.media.on('inputVolume', setVolumeInput);

    return () => {
      session.media.removeListener('outputMuted', setMute);
      session.media.removeListener('outputVolume', setVolume);
      session.media.removeListener('inputVolume', setVolumeInput);
    };
  }, []);

  return {
    output: {
      muted,
      volume,
    },
    input: {
      volume: volumeInput,
    },
  };
};

export default useSessionMedia;
