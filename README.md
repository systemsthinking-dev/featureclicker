# featureclicker

[![Netlify Status](https://api.netlify.com/api/v1/badges/30df406f-737e-493b-9366-49494e44a58f/deploy-status)](https://app.netlify.com/sites/featureclicker/deploys)

What could be more fun than work? Pretend work!

## errata

backend is from: https://github.com/aws-samples/simple-websockets-chat-app

Jess, you put the backend in aws and retrieved its URL using:
```
aws cloudformation describe-stacks \
    --stack-name serverlessrepo-featureclicker-chat-app --query 'Stacks[].Outputs'
```
after an `aws configure`

Then you put that wss:// URL as VUE_APP_BACKEND in feature-clicker/.env, which is in .gitignore

You can try it:

```
npm i -g wscat
$ wscat -c $URL
Connected (press CTRL+C to quit)
> { "action":"sendmessage", "data": "poo" }
< poo
> ...
```
