import { ISession } from '@atlasat/webphone-sdk';
import { useEffect, useState } from 'react';

const useSessionMedia = (session: ISession) => {
  const [inputMuted, setInputMuted] = useState<boolean>(session.media.input.muted);
  const [outputMuted, setOutputMuted] = useState<boolean>(session.media.output.muted);

  const [volume, setVolume] = useState<number>(session.media.output.volume);
  const [volumeInput, setVolumeInput] = useState<number>(session.media.input.volume);

  useEffect(() => {
    session.media.on('outputMuted', setOutputMuted);
    session.media.on('inputMuted', setInputMuted);
    session.media.on('outputVolume', setVolume);
    session.media.on('inputVolume', setVolumeInput);

    return () => {
      session.media.removeListener('inputMuted', setInputMuted);
      session.media.removeListener('outputMuted', setOutputMuted);
      session.media.removeListener('outputVolume', setVolume);
      session.media.removeListener('inputVolume', setVolumeInput);
    };
  }, []);

  return {
    output: {
      muted: outputMuted,
      volume,
    },
    input: {
      muted: inputMuted,
      volume: volumeInput,
    },
  };
};

export default useSessionMedia;
