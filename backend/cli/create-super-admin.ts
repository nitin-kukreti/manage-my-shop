import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';
import { dataSourceOption } from 'db/data-source';

async function bootstrap() {
  const dataSource = new DataSource(dataSourceOption);
  await dataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
  };

  try {
    const email = await askQuestion('Enter super admin email: ');
    let password = await askQuestion('Enter super admin password: ');
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    // Create the user
    await queryRunner.query(
      `INSERT INTO "users" ("email", "password", "userStatus") VALUES ($1, $2, 'active') RETURNING "id"`,
      [email, password],
    );

    // Get the user id
    const userResult = await queryRunner.query(
      `SELECT "id" FROM "users" WHERE "email" = $1`,
      [email],
    );
    const userId = userResult[0]?.id;

    // Find or create the role
    const roleResult = await queryRunner.query(
      `SELECT "id" FROM "Role" WHERE "name" = 'super_admin'`,
    );

    let roleId: number;
    if (roleResult.length === 0) {
      throw new Error('Please Run migration and seed data');
    } else {
      roleId = roleResult[0].id;
    }

    // Assign the role to the user with no shop
    await queryRunner.query(
      `INSERT INTO "UserRole" ("userId", "roleId", "shopId") VALUES ($1, $2, NULL)`,
      [userId, roleId],
    );

    console.log('Super admin created and assigned successfully!');
    await queryRunner.commitTransaction();
  } catch (error) {
    console.error('Error creating super admin:', error);
    await queryRunner.rollbackTransaction();
  } finally {
    rl.close();
    await queryRunner.release();
    await dataSource.destroy();
  }
}

bootstrap();
