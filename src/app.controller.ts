import { Controller, Get } from '@nestjs/common';
import { AppService, HealthCheckResponse } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  healthCheck(): HealthCheckResponse {
    return this.appService.healthCheck();
  }
}
