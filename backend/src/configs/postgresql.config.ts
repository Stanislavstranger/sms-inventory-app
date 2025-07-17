import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ProductEntity } from '../products/entities/product.entity';

export const getPostgresConfig = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (databaseUrl) {
      return {
        type: 'postgres',
        url: databaseUrl,
        entities: [ProductEntity],
        synchronize: true,
      };
    } else {
      return {
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [ProductEntity],
        synchronize: true,
      };
    }
  },
  inject: [ConfigService],
  imports: [ConfigModule],
});
