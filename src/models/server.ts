import { ServerService } from "../services/serverService";
import { User, UserImpl } from "./user";

export interface Server {
  id: string;
  name: string;
  joinedAt: string;
  djrole: string;
  volume: number;
  users: User[];
  addUser(user: User): Promise<void>;
  getUser(id: string): User | undefined;
  updateUser(user: User): Promise<void>;
}

export class ServerImpl implements Server {
  id: string;
  name: string;
  joinedAt: string;
  djrole: string;
  volume: number;
  users: User[];
  
  constructor(id: string, name: string, joinedAt: string = new Date().toUTCString(), djrole: string = "", volume: number = 100, users:  User[] = []) {

    this.id = id;
    this.name = name;
    this.joinedAt = joinedAt;
    this.djrole = djrole;
    this.volume = volume;
    this.users = users;
  }

  
  public async addUser(user: User): Promise<void> {
    if(user.id) {
      if(!this.users.find(u => u.id === user.id)) {
        this.users.push(user)
        await new ServerService().updateServerById(this)
      }
    }

  }

  public getUser(id: string): UserImpl | undefined {
    return this.users.find(u => u.id === id)
  }

  public async updateUser(user: User): Promise<void> {
    this.users.find(u => {
      if(u.id === user.id) {
        u.balance = user.balance;
        u.cigi = user.cigi;
      }
    })
    await new ServerService().updateServerById(this)
  }
}
