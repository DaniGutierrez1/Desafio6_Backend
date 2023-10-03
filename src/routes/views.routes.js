import { Router } from "express";
import { ProductManager } from "../dao/managers/fileSystem/productsFiles.js";
import { ProductsMongo } from "../dao/managers/mongo/productsMongo.js";

import { usersMongo } from "../dao/managers/mongo/userMongo.js";
import { checkUserAuthenticated, showLoginView } from "../middlewares/auth.js";


const userService=new usersMongo()
const productService = new ProductManager('products.json')
const productServiceDB = new ProductsMongo('products.json')

const router = Router();

router.get("/",async(req,res)=>{
    const products = await productService.get();
    res.render("home",{products})
    

});

router.get("/realtimeproducts",(req,res)=>{
    res.render("realTimeProducts")
});

router.get("/registro",showLoginView,(req,res)=>{
    res.render("signup");
})

router.get("/login",showLoginView,(req,res)=>{
    res.render("login");
})

router.get("/cambio-contraseña",(req,res)=>{
    res.render("changePassword")
})

router.get("/perfil",checkUserAuthenticated,(req,res)=>{
    /*
    const user = await userService.getByEmail(user.email,{lean:true})
    */
    res.render("profile",{user:JSON.parse(JSON.stringify(req.user))});
});

router.get("/products",async (req,res)=>{
    try {
        const {limit=5,page=1,stock,sort="asc"} = req.query
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        if(!["asc","desc"].includes(sort)){
            return res.render("products", {error:"Orden no valido"})
        }
    
        const sortValue = sort === "asc" ? 1: -1 ;
        let query ={};
        if(stockValue){
            query={stock:{$gte:stockValue}}
        }
    
        const products = await productServiceDB.getPaginate(query,{
            page,
            limit,
            sort:{price:sortValue},
            lean:true,
        });
        console.log(products)
        const baseUrl=`${req.protocol}://${req.get("host")}${req.originalUrl}`
        
        const resultProductsView = {
            status : "succes",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            netPage:products.nextPage,
            page:  products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage?`${baseUrl.replace(`page=${products.page}`,`page=${products.prevPage}`)}`:null,
            nextLink:products.hasNextPage?`${baseUrl.replace(`page=${products.page}`,`page=${products.nextPage}`)}`:null,
            
            
        }
        
        res.render("products",resultProductsView)
        console.log(resultProductsView)
    } catch (error) {
        throw error
    }

});

export {router as viewsRouter}