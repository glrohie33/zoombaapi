import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: String, required: [true, 'permission name is required'], unique:true })
  name: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
export const PermissionModel =  {name: 'permissions',schema:PermissionSchema };