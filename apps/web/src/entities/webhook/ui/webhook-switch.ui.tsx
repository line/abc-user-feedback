import clsx from 'clsx';

import { Webhook, WebhookInput } from '../webhook.type';

interface IProps {
  webhook: Webhook;
  onChangeUpdate: (webhookId: number, webhook: WebhookInput) => void;
}

const WebhookSwitch: React.FC<IProps> = (props) => {
  const { webhook, onChangeUpdate } = props;

  return (
    <input
      type="checkbox"
      className={clsx('toggle toggle-sm', {
        'border-fill-primary bg-fill-primary': webhook.status === 'INACTIVE',
      })}
      checked={webhook.status === 'ACTIVE'}
      onChange={(e) => {
        onChangeUpdate(webhook.id, {
          ...webhook,
          events: webhook.events.map((event) => ({
            ...event,
            channelIds: event.channels.map((channel) => channel.id),
          })),
          status: e.target.checked ? 'ACTIVE' : 'INACTIVE',
        });
      }}
    />
  );
};

export default WebhookSwitch;
