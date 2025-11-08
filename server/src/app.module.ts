import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // .env dosyasını yüklemek için (1)
    ConfigModule.forRoot({
      isGlobal: true, // Config modülünü global yapar
    }),

    // Veritabanı bağlantısı için (2)
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Config modülünü burada da kullan
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'), // .env'den URL'i çek
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
