var express = require('../../');
var path = require('path');
var countries = require('./data/country.json');
var  app = express();
var port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }))

app.get('/',(req,res)=>{

    var keyword = req.query.search;
    var allCountries = countries;
    if(!keyword) return res.render('index',{countries: countries})
    
    if(keyword)
    var results = allCountries.filter(country=>{
        return country.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) || country.code.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())  
    })
    if(!results) return res.json({results:"Not found"})
    
    return res.render('index',{
        countries:results
    })
})





if(!module.parent)
   app.listen(port,()=>console.log(`Your application is running on http://localost:${port}`))