<<<<<<< HEAD
import {IUser} from "./IUser";

export interface ILink {
    id: number;
    user: IUser;
    linkKey: string;
    href: string;
    createAt: string;
    updateAt: string;
}
=======
import {IEntity} from "./IEntity";
import {IUser} from "./IUser";

export interface ILinkInput {
  user: number;
  href: string;
}

export interface ILink extends IEntity {
  user: IUser;
  linkKey: string;
  href: string;
}
>>>>>>> dev
