import { ServerService } from "../services/serverService";

export interface User {
    id: string;
    name: string;
    balance: number;
    cigi: number;
    cigizik(): void;
}
    
    
export class UserImpl implements User {
    id: string;
    name: string;
    balance: number;
    cigi: number;

    constructor (id: string, name: string, balance: number = 2000,  cigi: number = 0) {

        this.id = id;
        this.name = name;
        this.balance = balance;
        this.cigi = cigi;
    }

    public cigizik() {
        this.cigi++;
        this.balance-= 100;
    }
    
}