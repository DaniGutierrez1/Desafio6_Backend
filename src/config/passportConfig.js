import passport from "passport";
import localStrategy from "passport-local";
import { createHash, isValidPassword} from "../utils.js"
import { userService } from "../constants/index.js";
import githubStrategy from "passport-github2"
import { config } from "./config.js";

export const initializePassport = ()=>{
    passport.use("signupStrategy", new localStrategy(
        {
            usernameField:"email",
            passReqtoCallback:true,
        },
        async(req,username,password,done)=>{
            try {
                const {first_name}=req.body;
                const user = await userService.getByEmail(username);
                if(user){
                    return done(null,false)
                }
                const newUser={
                    first_name:first_name,
                    email:username,
                    password:createHash(password)
                }
                const userCreated = await userService.save(newUser);
                return done(null,userCreated);

            } catch (error) {
                return done(error)
            }
        }
    ));
    
    passport.use("loginStrategy",new localStrategy(
        {
            usernameField:"email"
        },
        async(username,password,done)=>{
            try {
                const user = await userService.getByEmail(username);
                if(!user){
                    return done(null,false)
                }
                if(isValidPassword(user,password)){
                    return done(null,user);
                }else{
                    return done(null,false);
                }
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use("githubLoginStrategy", new githubStrategy(
        {
            clientID:config.github.clienteId,
            clientSecret:config.github.clientSecret,
            callbackUrl:config.github.callbackUrl,
        },
        async(accesstoken,refreshToken,profile,done)=>{
            try {
                const user = await userService.getByEmail(profile.username);
                if(!user){  
                    const newUser={
                        first_name:'',
                        email:profile.username,
                        password: createHash(profile.id)
                    };
                    const userCreated=await userService.save(newUser);
                    return done(null,userCreated)
                }else{
                    return done(null, user)
                }
            } catch (error) {
                return done(error);
            }

        }
    ));

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    });

    passport.deserializeUser(async(id,done)=>{
        const user=await userService.getById(id)
        done(null,user)
    });
}  