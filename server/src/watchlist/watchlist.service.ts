// server/src/watchlist/watchlist.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Watchlist, WatchlistDocument } from './watchlist.schema';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist.name)
    private watchlistModel: Model<WatchlistDocument>,
  ) {}

  /**
   * GET /watchlist
   */
  async getWatchlist(userId: string): Promise<Watchlist[]> {
    return this.watchlistModel.find({ userId: userId }).exec();
  }

  /**
   * POST /watchlist
   */
  async addVideo(url: string, userId: string): Promise<Watchlist> {
    // DÜZELTME 1: 'videoId' değişkeni artık 'null' da olabilir.
    let videoId: string | null;
    try {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      // 'get' metodu 'string | null' döndürür, bu artık 'videoId' ile uyumlu.
      videoId = params.get('v');

      if (!videoId) {
        throw new Error('Geçersiz YouTube URL');
      }
    } catch {
      // DÜZELTME 2: 'error' değişkenini 'unused' (kullanılmayan) olduğu için kaldırdık.
      throw new BadRequestException('Geçersiz URL formatı');
    }
    // Artık 'videoId'nin 'string' olduğunu biliyoruz, kaydedebiliriz.
    const newVideo = new this.watchlistModel({
      userId: userId,
      videoId: videoId,
    });

    return newVideo.save();
  }
}
