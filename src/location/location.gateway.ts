import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: {origin: '*'} }) 
export class LocationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendLocation')
 async handleSendLocation(@MessageBody() data: { latitude: number; longitude: number }){
    const adjustedLocation =  await this.adjustLocation(data);

    console.log('Ubicación recibida del cliente:', data);
    console.log('Ubicación ajustada:', adjustedLocation);
    // Se transmite la ubicación a todos los clientes conectados
    this.server.emit('locationUpdate', adjustedLocation);
    return { success: true, message: 'Ubicación enviada correctamente.' };
  }

  private async adjustLocation(data: { latitude: number; longitude: number }) {
    const apiKey = process.env.API_KEY;
    const url = `https://roads.googleapis.com/v1/snapToRoads?path=${data.latitude},${data.longitude}&interpolate=true&key=${apiKey}`;
  
    const response = await fetch(url);
    const result = await response.json();
    if (result.snappedPoints && result.snappedPoints.length > 0) {
      return {
        latitude: result.snappedPoints[0].location.latitude,
        longitude: result.snappedPoints[0].location.longitude,
      };
    }
    return data;
  }
}
