import { User } from "./serverUser"

export class Server {
    id!: string;
    name!: string;
    djrole: string = "";
    volume: number = 100;
    joinedAt!: string;
    users: Map<any, any> = new Map()
    //users: Map<String, Map<String, String | Number>> = new Map<string, Map<String, String | Number>>



    constructor(id: string, name: string, djRole: string = "", volume: number = 100, joinedAt: string, users: Map<any, any> = new Map()) {
        this.id = id;
        this.name = name;
        this.djrole = djRole;
        this.volume = volume;
        this.joinedAt = joinedAt;
    }


}