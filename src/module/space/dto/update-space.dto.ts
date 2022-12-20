import { PartialType } from '@nestjs/mapped-types';
import { Space } from '../../../persistence/entities/space.entity';

export class UpdateSpaceDto extends PartialType(Space) {}
