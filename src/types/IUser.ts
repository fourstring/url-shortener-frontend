import {IEntity} from "./IEntity";

export interface IUser extends IEntity {
  username: string;
  email: string;
}
