import { Document } from 'mongoose';
import { Service, Inject } from 'typedi';
import { ICommon } from '../interfaces/ICommon';

@Service()
export default class JxFactoryService {
  constructor(@Inject('jxFactory') private jxFactory: Models.ICommonModel, @Inject('logger') private logger) {}

  public async getCode(): Promise<{ code: ICommon }> {
    const [record] = await this.jxFactory.aggregate([{ $sample: { size: 1 } }]);
    if (!record) {
      throw new Error('get shiCi error');
    }
    return { code: record };
  }

  public async createCode({ name, code }: { name: string; code: string }): Promise<{ code: ICommon & Document }> {
    const record = await this.jxFactory.findOneAndUpdate(
      { $or: [{ name, value: code }] },
      {
        value: code,
        name: name,
        type: 1,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    if (!record) {
      throw new Error('get shiCi error');
    }
    return { code: record };
  }

  public async countCode(): Promise<{ count: Number }> {
    const count = await this.jxFactory.count({});
    return { count };
  }

  public async removeCode(): Promise<{ msg: string }> {
    const count = await this.jxFactory.remove({});
    return { msg: 'success' };
  }
}
