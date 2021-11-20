import { RefreshingAuthProvider } from '@twurple/auth';
import { PubSubClient, PubSubRedemptionMessage } from '@twurple/pubsub';
import * as WebSocket from 'ws';
import { writeTokenToDisk } from './tokens';

export const webSocketServer = new WebSocket.Server({ port: 3001 });

export async function initPubSub(initialToken) {
  const authProvider = new RefreshingAuthProvider(
    {
      clientId: process.env.TWITCH_CLIENT,
      clientSecret: process.env.TWITCH_SECRET,
      onRefresh: writeTokenToDisk,
    },
    initialToken,
  );
  const pubSubClient = new PubSubClient();
  const userId = await pubSubClient.registerUserListener(authProvider);
  console.log(`PUB-SUB INIT FOR ${userId}`);
  pubSubClient.onRedemption(userId, emitRedenmptionMessage);
}

export function emitRedenmptionMessage(redenmptionRawData: PubSubRedemptionMessage) {
  const message = JSON.stringify({
    name: redenmptionRawData.rewardTitle,
    type: 'reward',
    data: {
      defaultImage: redenmptionRawData.defaultImage,
      id: redenmptionRawData.id,
      message: redenmptionRawData.message,
      redemptionDate: redenmptionRawData.redemptionDate,
      rewardCost: redenmptionRawData.rewardCost,
      rewardId: redenmptionRawData.rewardId,
      rewardImage: redenmptionRawData.rewardImage,
      rewardTitle: redenmptionRawData.rewardTitle,
      status: redenmptionRawData.status,
      userDisplayName: redenmptionRawData.userDisplayName,
      userId: redenmptionRawData.userId,
      userName: redenmptionRawData.userName,
    },
  });

  webSocketServer.clients.forEach((client) => {
    client.send(message);
  });
}
