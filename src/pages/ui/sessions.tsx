import {
  Table,
  ActionIcon,
  Badge,
  Popover,
  Box,
  Slider,
  Checkbox,
  Select,
  Group,
} from '@mantine/core';
import React from 'react';
import { ISession, SessionStatus } from '@atlasat/webphone-sdk';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  IconPhoneX,
  IconPhonePause,
  IconPhoneCall,
  IconMicrophone,
  IconMicrophoneOff,
  IconVolume,
  IconVolumeOff,
  IconSettings,
} from '@tabler/icons-react';
import useSessions from '@/components/Webphone/hooks/use-sessions';
import useSessionDuration from '@/components/Webphone/hooks/use-session-duration';
import useSessionMedia from '@/components/Webphone/hooks/use-session-media';
import useDevices from '@/components/Webphone/hooks/use-devices';
import Visual from '@/components/Visual';

dayjs.extend(duration);

//IconPhoneCall

const Duration: React.FC<{ session: ISession }> = ({ session }) => {
  const timer = useSessionDuration(session);
  return <>{dayjs.duration(timer * 1000).format('mm:ss')}</>;
};

const Volume: React.FC<{ session: ISession; media?: 'input' | 'output' }> = ({
  session,
  media = 'output',
}) => {
  /**
   * hook for media device change
   */
  const {
    output: { muted: outputMuted, volume },
    input: { muted: inputMuted, volume: inputVolume },
  } = useSessionMedia(session);

  return (
    <Box>
      <Slider
        min={0}
        max={1}
        step={0.025}
        label={(value) => `${value * 100} %`}
        value={media === 'output' ? volume : inputVolume}
        onChange={(value) => {
          if (media === 'output') {
            session.media.output.volume = value;
          } else if (media === 'input') {
            session.media.input.volume = value;
          }
        }}
      />
      <Checkbox
        size="xs"
        mt="xs"
        checked={media === 'input' ? inputMuted : outputMuted}
        label={media === 'input' ? 'Mute mic' : 'Mute speaker'}
        onChange={(event) => {
          if (media === 'input') {
            session.media.input.muted = event.currentTarget.checked;
          }
          if (media === 'output') {
            session.media.output.muted = event.currentTarget.checked;
          }
        }}
      />
    </Box>
  );
};

const MediaDevice: React.FC<{ session: ISession }> = ({ session }) => {
  const media = useDevices();

  return (
    <Box>
      <Select
        label="Input device"
        onChange={async (value) => {
          /**
           * set deviceId
           */
          session.media.input.id = value || undefined;
        }}
        value={session.media.input.id}
        data={media.audioInputDevices.map((item) => ({ label: item.label, value: item.deviceId }))}
      />
      <Select
        label="Output device"
        onChange={async (value) => {
          session.media.setOutput({
            id: value || undefined,
            audio: new Audio(),
          });
        }}
        value={session.media.output.id}
        data={media.audioOutputDevices.map((item) => ({ label: item.label, value: item.deviceId }))}
      />
    </Box>
  );
};

const Sessions: React.FC = () => {
  const sessions = useSessions();
  return (
    <Table.ScrollContainer minWidth={500}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Phone Number</Table.Th>
            <Table.Th>Source</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Visual</Table.Th>
            <Table.Th>Duration</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sessions.map((session) => (
            <Table.Tr key={session.id}>
              <Table.Td>{session.remoteIdentity.phoneNumber}</Table.Td>
              <Table.Td>{session.isIncoming ? 'Incoming' : 'Outgoing'}</Table.Td>

              <Table.Td>
                <Badge color="gray" variant="light">
                  {session.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group>
                  <Visual
                    //active={session.status === SessionStatus.ACTIVE}
                    mediaStream={session.media.localStream}
                    type="local"
                  />
                  <Visual
                    //active={session.status === SessionStatus.ACTIVE}
                    mediaStream={session.media.remoteStream}
                    type="remote"
                  />
                </Group>
              </Table.Td>
              <Table.Td>
                <Duration session={session} />
              </Table.Td>
              <Table.Td>
                <Popover width={350} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="outline" radius="lg">
                      <IconSettings size={15} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <MediaDevice session={session} />
                  </Popover.Dropdown>
                </Popover>{' '}
                <Popover width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="outline" radius="lg">
                      {session.media.output.muted ? (
                        <IconVolumeOff size={15} />
                      ) : (
                        <IconVolume size={15} />
                      )}
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Volume session={session} media="output" />
                  </Popover.Dropdown>
                </Popover>{' '}
                <Popover width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon
                      color="blue"
                      radius="lg"
                      variant="outline"
                      disabled={session.status === SessionStatus.RINGING}
                      //onClick={() => (session.isMute ? session.unmute() : session.mute())}
                    >
                      {session.media.input.muted ? (
                        <IconMicrophoneOff size={15} />
                      ) : (
                        <IconMicrophone size={15} />
                      )}
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Volume session={session} media="input" />
                  </Popover.Dropdown>
                </Popover>{' '}
                <ActionIcon
                  color="blue"
                  radius="lg"
                  variant="outline"
                  disabled={session.status === SessionStatus.RINGING}
                  onClick={() =>
                    session.status !== SessionStatus.ON_HOLD ? session.hold() : session.unhold()
                  }
                >
                  {session.status === SessionStatus.ON_HOLD ? (
                    <IconPhoneCall size={15} />
                  ) : (
                    <IconPhonePause size={15} />
                  )}
                </ActionIcon>{' '}
                <ActionIcon
                  size="lg"
                  color="red"
                  radius="lg"
                  onClick={() => {
                    if (session.status === SessionStatus.RINGING && !session.isIncoming) {
                      session.cancel();
                    } else if (
                      session.status === SessionStatus.ACTIVE ||
                      session.status === SessionStatus.ON_HOLD
                    ) {
                      session.bye();
                    } else if (session.isIncoming && session.status === SessionStatus.RINGING) {
                      session.reject();
                    }
                  }}
                >
                  <IconPhoneX size={15} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default Sessions;
