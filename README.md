# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## 출력 파일 생성 및 실행

synth 를 실행

```shell
npx cdk synth --profile <profile>
```

deploy 실행

```shell
npx cdk deploy --profile <profile>
```

## 등록 확인

scalable target 으로 람다가 등록되었는지 확인

```shell
aws application-autoscaling describe-scalable-targets \
    --service-namespace lambda \
    --profile <profile>
```

예약한 시간에 provisioning 된 수치를 확인하려면 get-provisioned-concurrency-config 명령어를 사용한다.

```shell
aws lambda get-provisioned-concurrency-config \
    --function-name <function-name> \
    --qualifier <alias> \
    --profile <profile>
```

스케쥴 된 작업의 결과를 확인할 수 있다.

```shell
aws application-autoscaling describe-scaling-activities \
--service-namespace lambda \
--scalable-dimension lambda:function:ProvisionedConcurrency \
--resource-id <resource-id> \
--profile <profile>
```
