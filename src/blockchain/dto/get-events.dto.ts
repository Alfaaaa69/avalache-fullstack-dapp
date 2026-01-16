import{ ApiProperty } from '@nestjs/swagger';

export class GetEventsDto {
  @ApiProperty({ description: 'The starting block number', example: 50507423 })
  fromBlock: number;

  @ApiProperty({ description: 'The ending block number', example: 50508423 })
    toBlock: number;
}