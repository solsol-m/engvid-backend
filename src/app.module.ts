import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const required = ['MONGODB_URI', 'JWT_SECRET'] as const;
        const missing = required.filter((k) => {
          const v = config[k];
          return typeof v !== 'string' || v.trim().length === 0;
        });

        if (missing.length) {
          throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`,
          );
        }

        // Normalize common values (helpful if .env has spaces)
        return {
          ...config,
          MONGODB_URI: String(config.MONGODB_URI).trim(),
          JWT_SECRET: String(config.JWT_SECRET).trim(),
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: (configService.get<string>('MONGODB_URI') ?? '').trim(),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    VideosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
