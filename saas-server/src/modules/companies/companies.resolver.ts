import { Args, Query, Resolver } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { CompanyType } from './dto/company.dto';

@Resolver()
export class CompaniesResolver {
  constructor(private companyService: CompaniesService) {}

  @Query(() => [CompanyType])
  async getAllCompanies() {
    return this.companyService.getAllCompanies();
  }

  @Query(() => CompanyType)
  async getCompanyByCIK(@Args('cik') id: string) {
    return this.companyService.getCompanyByCIK(id);
  }
}
