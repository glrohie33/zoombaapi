import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Permission } from '../../permissions/entities/permission.entity';

export type RoleDocument = Role & mongoose.Document;
@Schema({ timestamps: true })
export class Role {
  @Prop({ type: String,unique:[true,'This role already exist'],required: [true, 'Role name is required'] })
  name: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'permissions' }])
  permissions: Permission;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export const RoleModel = { name: 'roles', schema: RoleSchema };
