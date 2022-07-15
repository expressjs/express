import type { Request, Response } from 'express';

const express = require( 'express' );

const app = express();

app.get( '/', function ( request: Request, response: Response ) {
  console.log( request.url );

  response.send( 'Hello World' );
} );

app.listen( 3000, () => {
  console.log( 'Express started on port 3000' );
  console.log( '  - http://localhost:3000' );
} );
