<<<<<<< HEAD
export interface IUser {
    id: number;
    username: string;
    email: string;
  }
=======
import {IEntity} from "./IEntity";

export interface IUser extends IEntity {
  username: string;
  email: string;
}
>>>>>>> dev
