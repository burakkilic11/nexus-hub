// server/src/user/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Gelecekte buraya 'username', 'firstName' vs. ekleyebiliriz.
}

export const UserSchema = SchemaFactory.createForClass(User);
