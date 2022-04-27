import { dataSource } from '@app/infra/database/typeorm/datasource';
import 'reflect-metadata';
import { startHTTPServer } from './infra/http/server';

async function bootstrap() {
  await dataSource.initialize();
  startHTTPServer();
}

bootstrap();
