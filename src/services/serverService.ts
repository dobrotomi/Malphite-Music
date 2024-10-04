import { Server } from "../models/server"
import { User } from "../models/serverUser"
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite'
import { db } from "../database/db"
export class ServerService {
    collectionName: string = "servers"

    async create(server: Server): Promise<void> {
        if((await this.getServerById(server.id)) == undefined) {
            try {
                const collectionRef = collection(db, this.collectionName)
                const customDocRef = doc(collectionRef, server.id);
                await setDoc(customDocRef, {
                    id: server.id,
                    name: server.name,
                    djrole: server.djrole,
                    volume: server.volume,
                    joinedAt: server.joinedAt,
                    users: Object.fromEntries(server.users.entries())
                })
            } catch (e) {
                console.error(`Couldn't create database for server ${server.name}\n` + e);
            }
        }
    }

    async getServerById(id: string) : Promise<Server | undefined> {
        const documentRef = doc(db, this.collectionName, id );
        
        try {
            const docSnap = await getDoc(documentRef);
            if (docSnap.exists()) {
                const server: Server = new Server(docSnap.data().id, 
                                                  docSnap.data().name, 
                                                  docSnap.data().djrole, 
                                                  docSnap.data().volume, 
                                                  docSnap.data().joinedAt)
                
                for(const key in docSnap.get("users")) {
                    server.users.set(key, docSnap.get("users")[key])
                }                             
                return server;
            }
        } catch (e) {
            console.error(`Couldn't get data ${id}\n` + e);
        }
        return undefined;
    }

    async updateServerById(id: string, server: Server) : Promise<void> {
        const documentRef = doc(db, this.collectionName, id);
        
        try {
            if (server) {
                updateDoc(documentRef, {
                    djrole: server.djrole,
                    volume: server.volume
                })                         
            }
        } catch (e) {
            console.error('Error update server' , e);
        }
    }

    async addUser(user: User, serverId: string) {
        const documentRef = doc(db, this.collectionName, serverId);
        try {
            let server: Server | undefined = await this.getServerById(serverId)
            if(server != undefined) {
                server.users.set(user.id, {id: user.id, name: user.name, cigi: user.cigi, balance: user.balance})
                //console.log(server.users)
                
                await updateDoc(documentRef, {
                    users: Object.fromEntries(server.users.entries())
                    //users: server.users
                })
            }
        } catch(e) {
            console.error('Error adding new user to server: ', e);
        }
    }

    async getUserById(userId: string, serverId: string) : Promise<User | undefined> {
        let server: Server | undefined = await this.getServerById(serverId)
        if(server != undefined) {
            //console.log(server.users)
            return server.users.get(userId)
        } 

        return undefined
    }

    async updateUser(user: User, serverId: string): Promise<void> {
        const documentRef = doc(db, this.collectionName, serverId);
        try {
            let server: Server | undefined = await this.getServerById(serverId)
            if(server != undefined) {
                server.users.set(user.id, {id: user.id, name: user.name, cigi: user.cigi, balance: user.balance})
                //console.log(server.users)
                
                await updateDoc(documentRef, {
                    users: Object.fromEntries(server.users.entries())
                    //users: server.users
                })
            }
        } catch(e) {
            console.error('Error update user ', e);
        }
    }
}