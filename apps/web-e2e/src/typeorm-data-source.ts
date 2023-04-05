import { join } from 'path';
import { DataSource } from 'typeorm';

require('dotenv').config();

class TestDataSource {
  dataSource: DataSource;
  private static instance: TestDataSource;
  public static get Instance(): TestDataSource {
    return this.instance || (this.instance = new this());
  }
  async initialize() {
    if (!this.dataSource) {
      this.dataSource = await new DataSource({
        type: 'mysql',
        url: process.env.MYSQL_URL,
        entities: [join(__dirname, '**/*.entity.{ts,js}')],
      }).initialize();
    }
  }
}

export const TypeormDataSource = TestDataSource.Instance;
