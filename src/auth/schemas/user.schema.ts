import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiTags } from "@nestjs/swagger";


@Schema({
    timestamps: true
})
@ApiTags('users')
export class User {
    @Prop({unique: [true,'Duplicate email entered']})
    @ApiProperty()
    email:string;
    
    @Prop()
    @ApiProperty()
    password:string;

    @Prop({ default: 'user' })
    @ApiProperty()
    role: string; 
}

export const UserSchema = SchemaFactory.createForClass(User);