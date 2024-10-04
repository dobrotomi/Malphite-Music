import { uniqueUser } from "../models/uniqueUser"
import { addDoc, collection, doc, getDoc, or, setDoc, updateDoc } from 'firebase/firestore/lite'
import { db } from "../database/db"
import fs from "fs"
import path from "path"


export class UserService {

    collectionName: string = "Users"

    async create(user: uniqueUser): Promise<void> {
        if((await this.getUserById(user.userId)).userId== "") {
            try {
                const collectionRef = collection(db, this.collectionName)
                const customDocRef = doc(collectionRef, user.userId);
                await setDoc(customDocRef, user)

                let content = JSON.parse(fs.readFileSync(path.join(__dirname, "../commands/university/geci.json"), 'utf8'));
                content[user.userId] = user
                fs.writeFileSync(path.join(__dirname, "../commands/university/geci.json"), JSON.stringify(content))

            } catch (e) {
                console.error(`Couldn't create database for user ${user.userId}\n` + e);
            }
        }
    }

    async getUserById(id: string) : Promise<uniqueUser> {
        const documentRef = doc(db, this.collectionName, id );
        let user: uniqueUser = {
            userId: "",
            orarendColor: "",
            wantEloadas: false,
            username: ""
        }
        try {
            const docSnap = await getDoc(documentRef);
            if (docSnap.exists()) {
                //console.log('Document data:', docSnap.data());
                user.userId = docSnap.data().userId
                user.orarendColor = docSnap.data().orarendColor
                user.wantEloadas = docSnap.data().wantEloadas
                user.username = docSnap.data().username
                return user;
            }
        } catch (e) {
            console.error(`Couldn't get data ${id}\n` + e);
        }
        return user;
    }

    async getAllUsers(id: string) : Promise<uniqueUser> {
        const documentRef = doc(db, this.collectionName);
        let user: uniqueUser = {
            userId: "",
            orarendColor: "",
            wantEloadas: false,
            username: ""
        }
        try {
            const docSnap = await getDoc(documentRef);
            if (docSnap.exists()) {
                //console.log('Document data:', docSnap.data());
                user.userId = docSnap.data().userId
                user.orarendColor = docSnap.data().orarendColor
                user.wantEloadas = docSnap.data().wantEloadas
                user.username = docSnap.data().username
                return user;
            }
        } catch (e) {
            console.error(`Couldn't get data ${id}\n` + e);
        }
        return user;
    }

    async editUser(userId: string, orarendColor: string, wantEloadas: boolean) {
        //console.log(userId+"\n"+orarendColor+"\n"+wantEloadas)
        const documentRef = doc(db, this.collectionName, userId);
        try {
            const user: uniqueUser = await this.getUserById(userId)
            if(user.userId == "") {
                return
            }
            await updateDoc(documentRef, {
                orarendColor: orarendColor,
                wantEloadas: wantEloadas
            })

            let content = JSON.parse(fs.readFileSync(path.join(__dirname, "../commands/university/geci.json"), 'utf8'));
            content[user.userId].orarendColor = orarendColor
            content[user.userId].wantEloadas = wantEloadas
            fs.writeFileSync(path.join(__dirname, "../commands/university/geci.json"), JSON.stringify(content))


        } catch(e) {
            console.error('Error adding new user to server: ', e);
        }
    }


}