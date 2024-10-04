import { db } from "../database/db";
import { Server, ServerImpl } from "../models/server"
import { User } from "../models/user"

export class ServerService {
    collectionName: string = "servers"

    async createServer(server: Server): Promise<void> {
        const collection = db.collection<Server>(this.collectionName)
        await collection.insertOne(server)
    }

    async getServerById(id: string) : Promise<Server | undefined> {

        const collection = db.collection<Server>(this.collectionName)
        const server = await collection.findOne({ id: id })

        return server ? server : undefined
    }

    async updateServerById(update: Server) : Promise<boolean> {
        
        const collection = db.collection<Server>(this.collectionName)
        const result = await collection.updateOne({ id: update.id }, { $set: update })

        return result.modifiedCount > 0

    }
/*
    async addUser(user: User, serverId: string) {
        const server = await this.getServerById(serverId)
        if(server === undefined) {
            return
        }
        if(server?.users.find(u  => u.id === user.id)) return
        server?.users.push(user)
        await this.updateServerById(server)
    }

    async getUserById(serverId: string, userId: string): Promise<User | undefined> {
        const server = await this.getServerById(serverId)
        return server?.users.find(u => u.id === userId)
    }

    async updateUser(user: User, serverId: string) {
        let server = await this.getServerById(serverId)
        //console.log(user)
        if(server === undefined) {
            return
        }
        const userIndex = server.users.findIndex(u => u.id == user.id)
        if(userIndex !== -1) {
            server.users[userIndex] = user
        }
        //console.log(server.users)
        await this.updateServerById(server)
    }
*/
}