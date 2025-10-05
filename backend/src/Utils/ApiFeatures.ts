import { Query, Document } from 'mongoose';
import { ProductQueryType } from '../Schemas/productQuery.js';
import { UserQueryType } from '../Schemas/userSchema.js';

class ApiFeatures<T extends Document> {
  query: Query<T[], T>;
  queryParams: ProductQueryType | { [key: string]: any } | UserQueryType;

  constructor(query: Query<T[], T>, queryParams: ProductQueryType | { [key: string]: any } | UserQueryType) {
    this.query = query;
    this.queryParams = queryParams;
  }

  filter() {
    const queryObj: Record<string, any> = { ...this.queryParams };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });
    

    // Advanced filtering (support gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }


  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 9;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  async execute() {
    const results = await this.query;
    const total = await this.query.model.countDocuments(this.query.getFilter());
    return {
      results,
      total,
      page: Number(this.queryParams.page) || 1,
      limit: Number(this.queryParams.limit) || 9,
    };
  }
}

export default ApiFeatures;