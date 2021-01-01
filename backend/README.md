Configure serverless

Ref: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html

```
serverless config credentials --provider aws --key AKIA2Y5HA3KGRM6IXZ5B --secret mKgc7Cq(...)+M2TKV --profile serverlessUser
```

sls login
Create the serverless API

```
serverless create --template aws-nodejs --path chessmate-sls
```

Install the packages:

```
npm i --save serverless-s3-sync serverless-webpack webpack
npm i --save lambda-hooks
webpack.config.js:
```

Configure webpack

```
module.exports = {
    target: 'node',
    mode: 'production' ## or 'none' to avoid minifying the code
};
```

Deploy the whole stack:

```
sls login
sls deploy

```

Deploy only a function:

```
sls deploy -f message
sls deploy -f disconnect

```

Testing from the browser (GET):
https://2al42uu8zk.execute-api.us-east-1.amazonaws.com/dev/users
https://2al42uu8zk.execute-api.us-east-1.amazonaws.com/dev/get-user/1

Test using
websocket.org/echo.html
wss://c4w68g49gb.execute-api.us-east-1.amazonaws.com/dev

Send message:

{ "message" : {"from":"e2", "to":"e4"}, "action" : "message"}
{ "message" : {"connect":"quiche310"}, "action" : "message"}
{ "message" : {"listUsers":"quiche310"}, "action" : "message"}

### Debugging

https://www.youtube.com/watch?v=PJ12zbdOQWI&t=384s
