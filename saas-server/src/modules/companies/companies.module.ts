import { Module } from '@nestjs/common';
import { CompaniesResolver } from './companies.resolver';
import { CompaniesService } from './companies.service';

@Module({
  imports: [],
  providers: [CompaniesResolver, CompaniesService],
})
export class CompaniesModule {}
