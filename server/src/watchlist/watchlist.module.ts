// server/src/watchlist/watchlist.module.ts

import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';

// YENİ EKLENDİ: Mongoose ve Watchlist Şeması (Schema)
import { MongooseModule } from '@nestjs/mongoose';
import { Watchlist, WatchlistSchema } from './watchlist.schema';

@Module({
  // YENİ EKLENDİ: MongooseModule'ü 'import' ediyoruz
  imports: [
    MongooseModule.forFeature([
      { name: Watchlist.name, schema: WatchlistSchema },
    ]),
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
