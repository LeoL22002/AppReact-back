import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Controller, Post, Body, Get, BadRequestException, Logger, Header } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LocationService } from './location.service';

@WebSocketGateway({ cors: true })
@Controller('location')
export class LocationController {
  private readonly logger = new Logger(LocationController.name);
  @WebSocketServer()
  server: Server;

  constructor(private readonly locationService: LocationService) {}

  // Manejar conexión de un cliente
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Manejar desconexión de un cliente
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Recibir ubicación de "B" y transmitirla a "A"
  @SubscribeMessage('updateLocation')
  handleLocationUpdate(
    @MessageBody() data: { userId: string; latitude: number; longitude: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Transmitir ubicación a todos los clientes conectados
    this.server.emit('locationUpdate', data);
    return { status: 'success', data };
  }


  @Get('adjust')
  getHello(): string {
    return 'Hello!!!';
  }
  // Endpoint para ajustar la ubicación de "B"

  // @Post('adjust')
  // async adjustLocation(
  //   @Body() body: { latitude: number; longitude: number },
  //   ) {
    
  //   this.logger.log(`Body received: ${JSON.stringify(body)}`);

  //   if (!body || body.latitude === undefined || body.longitude === undefined) {
  //     this.logger.error('Invalid body: Latitude and longitude are required');
  //     throw new BadRequestException('Latitude and longitude are required');
  //   }

  //   return this.locationService.adjustToNearestRoad(body.latitude, body.longitude);
  // }
}


