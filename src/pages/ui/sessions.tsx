import { Table, ActionIcon, Badge } from '@mantine/core';
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
} from '@tabler/icons-react';
import useSessions from '@/components/Webphone/hooks/use-sessions';
import useSessionDuration from '@/components/Webphone/hooks/use-session-duration';

dayjs.extend(duration);

//IconPhoneCall

const Duration: React.FC<{ session: ISession }> = ({ session }) => {
  const timer = useSessionDuration(session);
  return <>{dayjs.duration(timer * 1000).format('mm:ss')}</>;
};

const Sessions: React.FC = () => {
  const sessions = useSessions();
  return (
    <Table.ScrollContainer minWidth={400}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Phone Number</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Duration</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sessions.map((session) => (
            <Table.Tr key={session.id}>
              <Table.Td>{session.remoteIdentity.phoneNumber}</Table.Td>
              <Table.Td>
                <Badge color="gray" variant="light">
                  {session.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Duration session={session} />
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  color="blue"
                  radius="lg"
                  disabled={session.status === SessionStatus.RINGING}
                  onClick={() => (session.isMute ? session.unmute() : session.mute())}
                >
                  {session.isMute ? <IconMicrophoneOff size={15} /> : <IconMicrophone size={15} />}
                </ActionIcon>{' '}
                <ActionIcon
                  color="blue"
                  radius="lg"
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
                    } else {
                      session.terminate();
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
