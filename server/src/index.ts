import 'reflect-metadata';
import { dataSource } from '@app/infra/database/typeorm/datasource';
import { startHTTPServer } from './infra/http/server';
import { redisClient } from '@app/infra/cache/redis-client';

async function bootstrap() {
  await redisClient.connect();
  await dataSource.initialize();
  startHTTPServer();
}

bootstrap();
