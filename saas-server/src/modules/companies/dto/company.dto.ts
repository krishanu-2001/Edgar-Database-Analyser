import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Collection, ISubCollection, SubCollection } from 'fireorm';
import { _8k } from './eightK.dto';
import { _10k } from './tenK.dto';
import { _10q } from './tenQ.dto';

@ObjectType()
class ScoreObject {
  @Field({ nullable: true })
  year: string;

  @Field({ nullable: true })
  score: number;
}

@ObjectType()
@Collection('company')
export class CompanyType {
  @Field(() => ID)
  id: string; // same as CIK

  @Field({ nullable: true })
  Address: string;

  @Field({ nullable: true })
  CompanyName: string;

  @Field({ nullable: true })
  FaxNumber: string;

  @Field({ nullable: true })
  HoldingType: string;

  @Field({ nullable: true })
  PhoneNumber: string;

  @Field({ nullable: true })
  URL: string;

  @Field({ nullable: true })
  IPODate: string;

  @Field({ nullable: true })
  exchange: string;

  @Field({ nullable: true })
  ticker: string;

  @Field(type => [_10k], { nullable: true })
  @SubCollection(_10k)
  _10k: ISubCollection<_10k>[];

  @Field(type => [_10q], { nullable: true })
  @SubCollection(_10q)
  _10q: ISubCollection<_10q>[];

  @Field(type => [_8k], { nullable: true })
  @SubCollection(_8k)
  _8k: ISubCollection<_8k>[];

  @Field(type => [ScoreObject], { nullable: true })
  score: ScoreObject[];
}
