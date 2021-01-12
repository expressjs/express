import * as express from "express";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import {IndexRoutes} from './routes';
import * as path from 'path';

class App {

  public app: express.Application = express();

  // routes
  public indexRoutes: IndexRoutes = new IndexRoutes();

  setupRoutes(){
    this.indexRoutes.routes(this.app);
  }

  constructor() {
    this.config();
    this.setupRoutes();
  }

  private config(): void{
    this.app.use(helmet())
//        this.app.set('view options', { debug: false })
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'pug')
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.set('trust proxy', 1) // trust first proxy
    this.app.use(express.static('public'));
  }


}

export default new App().app;
