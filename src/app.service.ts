import { Injectable } from '@nestjs/common';

export interface HealthCheckResponse {
  status: number;
  message: string;
}

@Injectable()
export class AppService {
  healthCheck(): HealthCheckResponse {
    return {
      status: 200,
      message: 'App is running well!',
    };
  }
}
