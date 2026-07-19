import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  // @Prop()
  // _id?: string;

  @Prop({ unique: true, required: true })
  username!: string;

  @Prop({ unique: true, required: true })
  email!: string;

  @Prop()
  password!: string;

  @Prop({ default: false })
  verified!: boolean;

  @Prop({ default: '' })
  profilePicture!: string;

  @Prop({ default: null })
  mobileNo!: Number;

  @Prop({ default: '' })
  address!: string;

  @Prop({ default: null })
  dateOfBirth!: Date;

  @Prop({ default: 0 })
  averageScore!: number;

  @Prop({ default: null })
  verificationId!: string;

  @Prop({ default: null })
  verificationIdExpiry!: Date;

  @Prop({ default: '' })
  refreshToken!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);