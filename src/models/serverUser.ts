import { ServerService } from "../services/serverService"

export class User {
    id!: string;
    name!: string;
    balance: number = 20000;
    cigi: number = 0;
    

    constructor(id: string, name: string, balance: number = 2000, cigi: number = 0) {
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.cigi = cigi;
    }

    public async cigizik(amount: number, serverId: string, serverService: ServerService): Promise<boolean> {
        
        let szabad = (Math.random() < 0.5)
        this.balance -= amount;
        if (this.balance >= amount && szabad) {
            this.cigi++; 
            serverService.addUser(this, serverId)
            return true;
        }
        serverService.addUser(this, serverId)
        return false;
    }

    
}