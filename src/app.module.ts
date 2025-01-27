import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationModule } from './location/location.module';
import { LocationGateway } from './location/location.gateway';

@Module({
  imports: [LocationModule],
  controllers: [AppController],
  providers: [AppService,LocationGateway],
})
export class AppModule {}

