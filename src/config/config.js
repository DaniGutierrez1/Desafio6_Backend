export const config ={
    server:{
        port:8080,
        secretSession:"arribaAbajo"
    },
    mongo:{
        url:"mongodb+srv://Dani:DanyGutierrez913@cluster0.ovkmrpe.mongodb.net/ecommerce?retryWrites=true&w=majority"
    },
    github:{
        clientId:"Iv1.80926f1c9aa698ac",
        clientSecret:"56b0de7b4015273ecbd15dcd83c18e318b3765ee",
        callbackUrl:"http://localhost:8080/api/sessions/github-callback"
    },
} 