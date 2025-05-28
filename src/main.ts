import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Dictator } from './dictators/entities/dictator.entity';
import { scryptSync, randomBytes } from 'crypto';

async function seedAdmin(dataSource: DataSource) {
  const repo = dataSource.getRepository(Dictator);
  const exists = await repo.findOne({ where: { email: 'admin@carolina.gov' } });

  if (!exists) {
    const salt = randomBytes(8).toString('hex');
    const hash = scryptSync('123456', salt, 32).toString('hex');
    const password = `${salt}:${hash}`;

    const admin = repo.create({
      name: 'Admin Preconfigurado',
      email: 'admin@carolina.gov',
      password,
      territory: 'Zona 0',
      number_of_slaves: 99,
      loyalty_to_carolina: 100
    });

    await repo.save(admin);
    console.log('✅ Admin creado: admin@carolina.gov / 123456');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const dataSource = app.get(DataSource);
  await seedAdmin(dataSource);

  await app.listen(3000);
}
bootstrap();

