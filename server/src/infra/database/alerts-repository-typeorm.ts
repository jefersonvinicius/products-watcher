import { Alert } from '@app/core/entities/alert';
import { AlertsRepository } from '@app/core/repositories/alerts';
import { AlertORMEntity } from '@app/infra/database/typeorm/entities/alert';
import { DataSource, Repository } from 'typeorm';

export class AlertsRepositoryTypeORM implements AlertsRepository {
  private alertsRepository: Repository<AlertORMEntity>;

  constructor(private dataSource: DataSource) {
    this.alertsRepository = dataSource.getRepository(AlertORMEntity);
  }

  async save(data: Alert): Promise<Alert> {
    return {} as Alert;
  }
}
