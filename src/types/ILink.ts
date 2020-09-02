import {IEntity} from "./IEntity";
import {IUser} from "./IUser";

export interface ILinkInput {
  user: number;
  href: string;
  linkKey?: string;
}

export interface ILink extends IEntity {
  user: IUser;
  linkKey: string;
  href: string;
  disabled: boolean;
}
