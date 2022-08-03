// import { ObjectType } from '@nestjs/graphql';

// @ObjectType()
// export class _10q extends _10k {}

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
class CompanyFeatures {
  @Field({ nullable: true })
  ARR: string;

  @Field({ nullable: true })
  CashAndCashEquivalents: string;

  @Field({ nullable: true })
  CostOfSales: string;

  @Field({ nullable: true })
  GAAPRevenue: string;

  @Field({ nullable: true })
  Goodwill: string;

  @Field({ nullable: true })
  GrossProfit: string;

  @Field({ nullable: true })
  GrossPropertyAndEquipment: string;

  @Field({ nullable: true })
  MRR: string;

  @Field({ nullable: true })
  MarketableSecurities: string;

  @Field({ nullable: true })
  NetIncome: string;

  @Field({ nullable: true })
  NetLoss: string;

  @Field({ nullable: true })
  NonGAAPEarnings: string;

  @Field({ nullable: true })
  OperatingIncome: string;

  @Field({ nullable: true })
  PropertyAndEquipmentNet: string;

  @Field({ nullable: true })
  RecurringRevenue: string;

  @Field({ nullable: true })
  Revenues: string;

  @Field({ nullable: true })
  SalesAndMarketing: string;

  @Field({ nullable: true })
  SharesOutstanding: string;

  @Field({ nullable: true })
  StockPrice: string;

  @Field({ nullable: true })
  TotalAssets: string;

  @Field({ nullable: true })
  TotalCurrentAssets: string;

  @Field({ nullable: true })
  TotalCurrentLiabilities: string;

  @Field({ nullable: true })
  TotalDebt: string;

  @Field({ nullable: true })
  TotalEquity: string;

  @Field({ nullable: true })
  TotalOperatingExpenses: string;

  @Field({ nullable: true })
  TotalStockholdersEquity: string;
}

@ObjectType()
class CompanySecFiling {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  url: string;
}

@ObjectType()
export class _10q {
  @Field(() => ID, { nullable: true }) // same as the year of filing
  id: string;

  @Field({ nullable: true })
  DocURL: string;

  @Field({ nullable: true })
  FilingDate: string;

  @Field({ nullable: true })
  FilingForDate: string;

  @Field(type => CompanyFeatures, { nullable: true })
  features: CompanyFeatures;

  @Field(type => [CompanySecFiling], { nullable: true })
  sec_filing: CompanySecFiling[];
}
