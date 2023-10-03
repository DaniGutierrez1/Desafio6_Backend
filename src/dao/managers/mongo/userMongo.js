import { usersModel } from "../../models/user.model.js"

export class usersMongo{
    constructor(){
        this.model=usersModel;
    };

    async save(user){
        try {
            const userCreated = await this.model.create(user);
            return userCreated
            
            if(userCreated.email == "@coder.com"){
                userCreated.role = "admin";
            }else{
                userCreated.role= "user";
            }

        } catch (error) {
            throw error;
        }

    }

    async getById(userId){
        try {
            const user = await this.model.findById(userId)
            if(user){
                return user;
            }else{
                throw new Error("El usuario no existe")
            }
        } catch (error) {
            
        }
    };

    async getByEmail(userEmail){
        try {
            const user = await this.model.findOne({email:userEmail});
            if(user){
                return user;
            }else{
                return null;
            }
        } catch (error) {
            throw error;
        }
    };

    async update(userId,newUserInfo){
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId,newUserInfo,{new:true})
            return userUpdated;
        } catch (error) {
            throw error;
        }
    }
}

