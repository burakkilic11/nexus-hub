import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service'; // User servisimiz
import { JwtService } from '@nestjs/jwt'; // Token oluşturmak için
import * as bcrypt from 'bcrypt'; // Şifre hash'leme için

@Injectable()
export class AuthService {
  constructor(
    // Gerekli servisleri 'inject' ediyoruz
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * (1) Kullanıcı Girişi (Sign-in)
   */
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    // 1. Kullanıcıyı e-mail ile veritabanında bul
    const user = await this.userService.findOneByEmail(email);

    // 2. Kullanıcı yoksa VEYA şifre (bcrypt) eşleşmiyorsa hata fırlat
    //    bcrypt.compare, girilen 'pass' ile DB'deki 'hash'lenmiş şifreyi karşılaştırır.
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    // 3. Şifre doğruysa, bir JWT payload'ı oluştur
    const payload = { sub: user._id, email: user.email }; // _id'yi Mongoose/Mongo otomatik verir

    // 4. Payload'ı kullanarak token'ı imzala ve döndür
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * (2) Kullanıcı Kaydı (Sign-up)
   */
  async signUp(email: string, pass: string): Promise<any> {
    // 1. Parolayı BCRYPT ile HASH'le
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltOrRounds);

    // 2. UserService'i kullanarak kullanıcıyı HASH'lenmiş şifre ile kaydet
    try {
      const user = await this.userService.create({
        email: email,
        password: hashedPassword, // ASLA 'pass' (orijinal şifre) değil
      });

      // Kayıt sonrası kullanıcıya token vermeden sadece bir başarı mesajı dönüyoruz.
      // İstersek doğrudan signIn'i de çağırabilirdik.
      return { message: 'Kullanıcı başarıyla oluşturuldu', userId: user._id };
    } catch (error: any) {
      // Eğer e-posta 'unique' (benzersiz) değilse (user.schema'da öyle demiştik)
      // veritabanı hatası (duplicate key) fırlatacaktır.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error && error.code === 11000) {
        throw new UnauthorizedException('Bu e-posta adresi zaten kullanılıyor');
      }
      throw error;
    }
  }
}
