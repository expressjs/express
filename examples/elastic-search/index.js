var express = require('../../');
var path = require('path');
var countries = require('./data/country.json');
var  app = express();
var port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }))

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/search',(req,res,next)=>{
    var keyword = req.query.search;
    console.log(keyword)
    var allCountries = countries;
    console.log(allCountries)
    if(!keyword) return res.json({results:"Keyword is empty"})


    if(keyword)
    var results = allCountries.filter(country=>{
        return country.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) || country.code.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())  
    })
    if(!results) return res.json({results:"Not found"})
    return res.json({results})
})



if(!module.parent)
   app.listen(3000,()=>console.log(`Your application is running on http://localost:${port}`))