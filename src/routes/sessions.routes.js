import { Router } from "express";
import { userService } from "../constants/index.js";
import { createHash , isValidPassword} from "../utils.js";
//import { usersModel } from "../dao/models/user.model.js";
import passport from "passport";

const router = Router();

router.post("/signup",passport.authenticate("signupStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
}),(req,res)=>{
    res.render("login",{message:"usuario registrado"})
});

router.get("/fail-signup",(req,res)=>{
    res.render("signup",{error:"No se pudo registrar el usuario"})
});

router.post("/login",passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/fail-login"
}),(req,res)=>{
    res.redirect("/perfil")
});

router.get("/fail-login",(req,res)=>{
    res.render("login",{error:"Credenciales invalidas"});
});

router.post("/cambiarContraseña",async(req,res)=>{
    try {
        const form=req.body;
        const user = await userService.getByEmail(form.email);
        if(!user){
            return res.render("changePassword",{error:
            "No se pudo cambiar la contraseña"})
        }
        user.password=createHash(form.newPassword);
        await userService.update(user._id,user);
        return res.render("login", {message:"Contraseña restaurada"});
    } catch (error) {
        res.render("changePassword",{error:error.message});
    }
})

router.get("/loginGithub",passport.authenticate("githubLoginStrategy"));

router.get("/github-callback",passport.authenticate("githubLoginStrategy",{
    failureRedirect:"/fail-signup"
}),(req,res)=>{
    res.render("profile")
})

router.get("/logout",(req,res)=>{
    req.logOut(error=>{
        if(error){
            return res.render("profile",{user: req.user, error: "No se pudo cerrar la sesión"})
        }else{
            req.session.destroy(error=>{
                if(error)return res.render("profile",{user: req.session.userInfo, error: "No se pudo cerrar la sesión"})
                res.redirect("/login");
            })
        }
    })
});

export { router as sessionsRouter}