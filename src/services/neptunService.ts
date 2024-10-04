import { db } from "../database/db"
import { Neptun } from "../models/neptun"


export class NeptunService {

    collectionName: string = "neptun"

    async createNeptun(user: Neptun): Promise<void> {

        const collection = db.collection<Neptun>(this.collectionName)
        await collection.insertOne(user)

        
    }

    async getNeptunById(id: string): Promise<Neptun | undefined> {

        const collection = db.collection<Neptun>(this.collectionName)
        const neptun = await collection.findOne({ id: id })

        return neptun ? neptun : undefined
    }

    async editNeptun(update: Neptun): Promise<Boolean> {

        const collection = db.collection<Neptun>(this.collectionName)
        const result = await collection.updateOne({ id: update.id }, { $set: update })

        return result.modifiedCount > 0

    }


}

