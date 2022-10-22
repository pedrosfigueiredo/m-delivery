import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Producer } from 'kafkajs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RoutesGateway implements OnGatewayInit {
  private kafkaProducer: Producer;

  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {}

  async afterInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('new-direction')
  handleMessage(client: Socket, payload: any) {
    this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({
            routeId: payload.routeId,
            clientId: client.id,
          }),
        },
      ],
    });
    console.log(payload);
  }

  async sendPosition(data: {
    clientId: string;
    routeId: string;
    position: [number, number];
    finished: boolean;
  }) {
    console.log(data);
    try {
      const { clientId, ...rest } = data;
      const client = (await this.server.sockets.fetchSockets()).find(
        (socket) => socket.id === clientId,
      );

      if (!client) {
        console.error(
          'Client does not exists, refresh React Application and resend a new direction again.',
        );
        return;
      }

      client.emit('new-position', rest);
    } catch (error) {
      Logger.log(error);
    }
  }
}
