import express from 'express';
import type { Express, Request, Response } from 'express';

const app: Express = express();

app.get( '/', function ( request: Request, response: Response ) {
  console.log( request.url );

  response.send( 'Hello World' );
} );

app.listen( 3000, () => {
  console.log( 'Express started on port 3000' );
  console.log( '  - http://localhost:3000' );
} );
