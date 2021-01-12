import {Request, Response} from 'express';
const _ = require('lodash');

export class IndexController{

    prettySource: Boolean = true;

    public home(req: Request, res: Response){
        res.render('index', {title:'Hello World!',pretty: this.prettySource})
    }


}
