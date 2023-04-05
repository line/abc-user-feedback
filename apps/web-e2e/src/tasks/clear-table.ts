import { TenantEntity } from '../entities/tenant.entity';
import { TypeormDataSource } from '../typeorm-data-source';

export default async () => {
  await TypeormDataSource.initialize();

  await TypeormDataSource.dataSource.query('SET FOREIGN_KEY_CHECKS=0;');
  await TypeormDataSource.dataSource.getRepository(TenantEntity).clear();
  await TypeormDataSource.dataSource.query('SET FOREIGN_KEY_CHECKS=1;');
};
