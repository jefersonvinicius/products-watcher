import { AlertsRepositoryTypeORM } from '@app/infra/database/alerts-repository-typeorm';
import { dataSource } from '@app/infra/database/typeorm/datasource';

export function makeAlertsRepository() {
  return new AlertsRepositoryTypeORM(dataSource);
}
