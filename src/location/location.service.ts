import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
const apiKey = process.env.API_KEY;
@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  async correctLocation(latitude: number, longitude: number): Promise<any> {
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    const response = await axios.get(url);
    const correctedLocation = response.data.results[0]?.geometry.location;

    return correctedLocation || { latitude, longitude };
  }

  async adjustToNearestRoad(latitude: number, longitude: number): Promise<any> {
    try {
      const apiKey = process.env.API_KEY;
      const url = `https://roads.googleapis.com/v1/nearestRoads?points=${latitude},${longitude}&key=${apiKey}`;

      this.logger.log(`Making request to Google Roads API: ${url}`);
      
      const response = await axios.get(url);
      const snappedPoints = response.data.snappedPoints.map((point) => ({
        latitude: point.location.latitude,
        longitude: point.location.longitude,
        placeId: point.placeId,
      }));
      
      this.logger.log(`Response from Google Roads API: ${JSON.stringify(response.data)}`);

      // return response.data;
      return snappedPoints;
    } catch (error) {
      this.logger.error(`Error al ajustar la ubicación: ${error.message}`, error.stack);
      if (error.response) {
        this.logger.error(`API Response: ${JSON.stringify(error.response.data)}`);
      }
      throw new InternalServerErrorException('Error al ajustar la ubicación');
    }
  }
}
