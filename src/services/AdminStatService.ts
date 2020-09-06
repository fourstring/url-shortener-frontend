import {AxiosInstance} from "axios";
import config from "../config";
import {client as normalClient} from "../utils/network";
import {IGeneralStat, ITopLink} from "../types/IAdminStat";

export class AdminStatService {
  client: AxiosInstance;

  constructor(client ?: AxiosInstance) {
    if (client) {
      this.client = client;
    } else if (config.globalE2EMock) {
      this.client = config.globalE2EMockClient;
    } else {
      this.client = normalClient;
    }
  }

  async getGeneral(): Promise<IGeneralStat> {
    let response = await this.client.get<IGeneralStat>('/admin/analysis/general');
    return response.data
  }

  async getTop10(): Promise<ITopLink[]> {
    let response = await this.client.get<ITopLink[]>('/admin/analysis/top10');
    return response.data
  }
}

export const adminStatService = new AdminStatService();
