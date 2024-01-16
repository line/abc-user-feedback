import { test } from '@playwright/test';
import { ResultSetHeader } from 'mysql2';

import { createConnection } from './database-utils';
import createProject from './scenarios/no-database-seed/create-project.spec';
import createChannel from './scenarios/with-database-seed/create-channel.spec';
import createFeedback from './scenarios/with-database-seed/create-feedback.spec';

test.describe('Tests without database seed', () => {
  createProject();
});

test.describe('Tests with database seed', () => {
  test.beforeEach(async () => {
    await seedDatabase();
  });

  test.afterEach(async () => {
    await clearDatabase();
  });

  createChannel();
  createFeedback();
});

async function seedDatabase() {
  const connection = await createConnection();
  try {
    const projects = (await connection.execute(
      `INSERT INTO projects (name, tenant_id) VALUES (?, ?)`,
      ['SeededTestProject', 1],
    )) as ResultSetHeader[];

    const channels = (await connection.execute(
      `INSERT INTO channels (name, project_id) VALUES (?, ?)`,
      ['SeededTestChannel', projects[0].insertId],
    )) as ResultSetHeader[];

    await connection.query(
      `INSERT INTO fields (name, \`key\`, format, type, status, channel_id) VALUES ?`,
      [
        [
          [
            'SeededTestTextField',
            'SeededTestTextField',
            'text',
            'API',
            'ACTIVE',
            channels[0].insertId,
          ],
          ['ID', 'id', 'number', 'DEFAULT', 'ACTIVE', channels[0].insertId],
          [
            'Created',
            'createdAt',
            'date',
            'DEFAULT',
            'ACTIVE',
            channels[0].insertId,
          ],
          [
            'Updated',
            'updatedAt',
            'date',
            'DEFAULT',
            'ACTIVE',
            channels[0].insertId,
          ],
          [
            'Issue',
            'issues',
            'multiSelect',
            'DEFAULT',
            'ACTIVE',
            channels[0].insertId,
          ],
        ],
      ],
    );

    console.log('seeding database succeeds');
  } finally {
    await connection.end();
  }
}

async function clearDatabase() {
  const connection = await createConnection();
  try {
    await connection.execute(`DELETE FROM projects WHERE name = ?`, [
      'SeededTestProject',
    ]);
  } finally {
    await connection.end();
  }
}
