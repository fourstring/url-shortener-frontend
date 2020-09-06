import {ILink, ILinkInput} from "../types/ILink";
import {BaseService} from "./BaseService";
import urljoin from "url-join";

export class AdminService extends BaseService<ILink, ILinkInput> {
  endpoint = "/admin/links";

  async disable(id: number, disabled: boolean): Promise<ILink | null>{
    try {
      let fullUrl: string = urljoin(this.endpoint, `${id}`);
      let result = await this.client.patch(fullUrl, {
        disabled: disabled
      });
      return result.data;
    }catch (e) {
      if (e.isAxiosError && e.response.status === 404) {
        return null;
      }
      throw e;
    }
  }
}

export const adminService = new AdminService();