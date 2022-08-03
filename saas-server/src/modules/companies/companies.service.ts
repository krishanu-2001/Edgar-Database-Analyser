import { Injectable } from '@nestjs/common';
import { getRepository, BaseFirestoreRepository } from 'fireorm';
import { CompanyType } from './dto/company.dto';
import { getFirestoreApp } from '../../utils/firebase';
import { _10k } from './dto/tenK.dto';

@Injectable()
export class CompaniesService {
  companyRepository: BaseFirestoreRepository<CompanyType>;
  firestoreApp: any;

  constructor() {
    this.companyRepository = getRepository(CompanyType);
    this.firestoreApp = getFirestoreApp();
  }

  async getAllCompanies() {
    const res: CompanyType[] = [];
    const companies = await this.companyRepository.find();
    // console.log(companies);

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      // console.log(company.id);

      const tempCompany = company;

      await this.firestoreApp
        .collection(`/company/${company.id}/_10k`)
        .get()
        .then(querySnapshot => {
          const tempDoc = [];
          querySnapshot.forEach(doc => {
            tempDoc.push({ id: doc.id, ...doc.data() });
          });
          tempCompany._10k = tempDoc;
          // console.log(res);
        });

      await this.firestoreApp
        .collection(`/company/${company.id}/_10q`)
        .get()
        .then(querySnapshot => {
          const tempDoc = [];
          querySnapshot.forEach(doc => {
            tempDoc.push({ id: doc.id, ...doc.data() });
          });
          tempCompany._10q = tempDoc;
        });

      await this.firestoreApp
        .collection(`/company/${company.id}/_8k`)
        .get()
        .then(querySnapshot => {
          const tempDoc = [];
          querySnapshot.forEach(doc => {
            tempDoc.push({ id: doc.id, ...doc.data() });
          });
          tempCompany._8k = tempDoc;
          res.push(tempCompany);
        });
    }

    return res;
  }

  async getCompanyByCIK(id: string) {
    const company: CompanyType = await this.companyRepository.findById(id);

    if (!company) throw new Error(`Company with CIK ${id} could not be found`);

    await this.firestoreApp
      .collection(`/company/${company.id}/_10k`)
      .get()
      .then(querySnapshot => {
        const tempDoc = [];
        querySnapshot.forEach(doc => {
          tempDoc.push({ id: doc.id, ...doc.data() });
        });
        company._10k = tempDoc;
        // console.log(res);
      });

    await this.firestoreApp
      .collection(`/company/${company.id}/_10q`)
      .get()
      .then(querySnapshot => {
        const tempDoc = [];
        querySnapshot.forEach(doc => {
          tempDoc.push({ id: doc.id, ...doc.data() });
        });
        company._10q = tempDoc;
        // console.log(res);
      });

    await this.firestoreApp
      .collection(`/company/${company.id}/_8k`)
      .get()
      .then(querySnapshot => {
        const tempDoc = [];
        querySnapshot.forEach(doc => {
          tempDoc.push({ id: doc.id, ...doc.data() });
        });
        company._8k = tempDoc;
      });

    return company;
  }
}
