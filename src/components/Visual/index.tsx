import React, { useEffect } from 'react';
import { Group, useMantineTheme } from '@mantine/core';
import { IconMicrophone, IconVolume } from '@tabler/icons-react';
import { AudioVisualizer } from './audio-visualizer';

const Visual: React.FC<{
  mediaStream: MediaStream;
  type: 'local' | 'remote';
}> = ({ mediaStream, type }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [audioVisual, setAudioVisual] = React.useState<AudioVisualizer>();
  const theme = useMantineTheme();
  const visualColor = theme.colors.gray[4];

  useEffect(() => {
    const addtrack = () => {
      if (mediaStream && canvasRef.current) {
        const init = new AudioVisualizer(mediaStream, canvasRef.current, visualColor);
        setAudioVisual(init);
        init.play();
      }
    };

    const removetrack = () => {
      if (mediaStream) {
        setAudioVisual((previous) => {
          previous?.pause();
          return undefined;
        });
      }
    };

    if (mediaStream) {
      mediaStream.addEventListener('addtrack', addtrack);
      mediaStream.addEventListener('removetrack', removetrack);
    }

    return () => {
      mediaStream?.removeEventListener('addtrack', addtrack);
      mediaStream?.removeEventListener('removetrack', removetrack);
    };
  }, [mediaStream]);

  useEffect(
    () => () => {
      audioVisual?.pause();
    },
    [audioVisual]
  );

  return (
    <Group gap={5}>
      {type === 'local' ? (
        <IconMicrophone size={16} color={visualColor} />
      ) : (
        <IconVolume size={16} color={visualColor} />
      )}
      <canvas ref={canvasRef} width={50} height={35} />
    </Group>
  );
};

export default Visual;
