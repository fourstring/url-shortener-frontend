import {IEntity} from "./IEntity";

export interface ILinkInput {
    user:number;
    href: string;
}

export interface ILink extends IEntity{
    user:{
        id:number;
        username:string;
    }
    linkKey: string;
    href: string;
}