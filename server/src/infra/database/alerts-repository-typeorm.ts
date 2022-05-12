import { Alert } from '@app/core/entities/alert';
import { AlertsRepository } from '@app/core/repositories/alerts';
import { AlertORMEntity } from '@app/infra/database/typeorm/entities/alert';
import { DataSource, Repository } from 'typeorm';

export class AlertsRepositoryTypeORM implements AlertsRepository {
  private alertsRepository: Repository<AlertORMEntity>;

  constructor(private dataSource: DataSource) {
    this.alertsRepository = this.dataSource.getRepository(AlertORMEntity);
  }

  async save(alert: Alert): Promise<Alert> {
    const created = this.alertsRepository.create({ ...alert, alertSended: alert.alertSended });
    const saved = await this.alertsRepository.save(created);
    return saved.toEntity();
  }
}
