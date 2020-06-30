[![Serverless Express Tencent Cloud](https://img.serverlesscloud.cn/2020210/1581352135771-express.png)](http://serverless.com)

Easily deploy Express.js applications using Tencent Cloud's serverless infrastructure using this Serverless Framework Component. Your application will auto-scale, never charge you for idle time, and require little-to-zero administration.

This example provides a walkthrough of how to deploy a simple Express.js application to the Cloud using [Tencent's Serverless Framework Component](https://intl.cloud.tencent.com/product/sf).

&nbsp;
<img align="right" width="400" src="https://s3.amazonaws.com/assets.general.serverless.com/component_express_tencent/express_demo_logo_light.gif" />

&nbsp;

- [请点击这里查看中文版部署文档](./README.md)

&nbsp;

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)
5. [Remove](#5-remove)

&nbsp;

&nbsp;

### 1. Install

```console
$ npm install -g serverless
```

### 2. Create

Just create `serverless.yml` and `.env` files

```console
$ touch .env # your Tencent API Keys
$ touch app.js
$ touch serverless.yml
```

Add the access keys of a [Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with `AdministratorAccess` in the `.env` file, using this format:

```
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

- If you don't have a Tencent Cloud account, you could [sign up](https://intl.cloud.tencent.com/register) first.

Initialize a new NPM package and install express:

```
npm init              # then keep hitting enter
npm i --save express  # install express
```

create your express app in `app.js`:

```js
const express = require('express')
const app = express()

app.get('/', function(req, res) {
  res.send('Hello Express')
})

// set binary types
// app.binaryTypes = [*/*];

// don't forget to export!
module.exports = app
```

### 3. Configure

```yml
# serverless.yml

express:
  component: '@serverless/tencent-express'
  inputs:
    region: ap-guangzhou
    runtime: Nodejs8.9
```

- [Click here to view the configuration document](https://github.com/serverless-tencent/tencent-express/blob/master/docs/configure.md)

### 4. Deploy

```
$ sls --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  DEBUG ─ Generating serverless handler...
  DEBUG ─ Generated serverless handler successfully.
  DEBUG ─ Compressing function express-test file to /Users/yugasun/Desktop/Develop/serverless/tencent-express/example/.serverless/express-test.zip.
  DEBUG ─ Compressed function express-test file successful
  DEBUG ─ Uploading service package to cos[sls-cloudfunction-ap-guangzhou-code]. sls-cloudfunction-default-express-test-1584355868.zip
  DEBUG ─ Uploaded package successful /Users/yugasun/Desktop/Develop/serverless/tencent-express/example/.serverless/express-test.zip
  DEBUG ─ Creating function express-test
  DEBUG ─ Created function express-test successful
  DEBUG ─ Setting tags for function express-test
  DEBUG ─ Creating trigger for function express-test
  DEBUG ─ Deployed function express-test successful
  DEBUG ─ Starting API-Gateway deployment with name ap-guangzhou-apigateway in the ap-guangzhou region
  DEBUG ─ Service with ID service-97m9tn6o created.
  DEBUG ─ API with id api-pvsf67t8 created.
  DEBUG ─ Deploying service with id service-97m9tn6o.
  DEBUG ─ Deployment successful for the api named ap-guangzhou-apigateway in the ap-guangzhou region.

  ExpressFunc:
    functionName:        express-test
    functionOutputs:
      ap-guangzhou:
        Name:        express-test
        Runtime:     Nodejs8.9
        Handler:     serverless-handler.handler
        MemorySize:  128
        Timeout:     3
        Region:      ap-guangzhou
        Namespace:   default
        Description: This is a template function
    region:              ap-guangzhou
    apiGatewayServiceId: service-97m9tn6o
    url:                 https://service-97m9tn6o-1251556596.gz.apigw.tencentcs.com/test/
    cns:                 (empty array)

  14s › ExpressFunc › done
```

You can now visit the output URL in the browser, and you should see the Express response.

### 5. Remove

```
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Removed function express-test successful
  DEBUG ─ Removing any previously deployed API. api-pvsf67t8
  DEBUG ─ Removing any previously deployed service. service-97m9tn6o

  6s › ExpressFunc › done
```

