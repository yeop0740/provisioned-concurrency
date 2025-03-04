import * as cdk from "aws-cdk-lib";
import { Alias, Function, Version } from "aws-cdk-lib/aws-lambda";
import {
  ScalableTarget,
  Schedule,
  ServiceNamespace,
} from "aws-cdk-lib/aws-applicationautoscaling";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs";
import {
  DINNER_TIME_END,
  DINNER_TIME_START,
  GRAPHQL_LAMBDA_NAME,
  GRAPHQL_LAMBDA_VERSION,
  NODE_ENV,
  NODE_ENV_PASCAL,
  NODE_ENV_UPPER,
  TEST_TIME_END,
  TEST_TIME_START,
} from "../config";
import { convertKSTToUTC } from "../util";

export class GoondoriProvisionedConcurrencyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const graphqlLambda = Function.fromFunctionName(
      this,
      `GraphqlLambda${NODE_ENV_PASCAL}`,
      GRAPHQL_LAMBDA_NAME
    );
    const graphqlLambdaVersion = Version.fromVersionAttributes(
      this,
      `GoondoriGraphqlLambdaVersion${NODE_ENV_PASCAL}`,
      {
        lambda: graphqlLambda,
        version: GRAPHQL_LAMBDA_VERSION,
      }
    );
    const lambdaAlias = new Alias(this, `Alias${NODE_ENV_PASCAL}Dev`, {
      aliasName: NODE_ENV_UPPER,
      version: graphqlLambdaVersion,
    });

    const apiGateway = new HttpApi(this, `ApiGateway${NODE_ENV_PASCAL}`, {
      apiName: `${NODE_ENV}2-goondori-backend`,
      corsPreflight: {
        allowHeaders: [
          "content-type",
          "x-amz-date",
          "authorization",
          "x-api-key",
          "x-amz-security-token",
          "x-amz-user-agent",
          "x-amz-trace-id",
        ],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ["*"],
      },
    });
    const integration = new HttpLambdaIntegration(
      `ApiGatewayIntegration${NODE_ENV_PASCAL}`,
      lambdaAlias
    );
    apiGateway.addRoutes({
      path: "/",
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: integration,
    });

    const scalingTarget = new ScalableTarget(
      this,
      `ScalingTarget${NODE_ENV_PASCAL}`,
      {
        serviceNamespace: ServiceNamespace.LAMBDA,
        maxCapacity: 10,
        minCapacity: 0,
        resourceId: `function:${graphqlLambda.functionName}:${lambdaAlias.aliasName}`,
        scalableDimension: "lambda:function:ProvisionedConcurrency",
      }
    );

    const dinnerStartTime = convertKSTToUTC(new Date(DINNER_TIME_START));
    const dinnerEndTime = convertKSTToUTC(new Date(DINNER_TIME_END));

    scalingTarget.scaleOnSchedule(`DinnerTimeScaleOut${NODE_ENV_PASCAL}`, {
      schedule: Schedule.cron({
        minute: dinnerStartTime.getUTCMinutes().toString(),
        hour: dinnerStartTime.getUTCHours().toString(),
      }),
      maxCapacity: 10,
      minCapacity: 9,
    });

    scalingTarget.scaleOnSchedule(`DinnerTimeScaleIn${NODE_ENV_PASCAL}`, {
      schedule: Schedule.cron({
        minute: dinnerEndTime.getUTCMinutes().toString(),
        hour: dinnerEndTime.getUTCHours().toString(),
      }),
      minCapacity: 0,
      maxCapacity: 0,
    });

    const testStartTime = convertKSTToUTC(new Date(TEST_TIME_START));
    const testEndTime = convertKSTToUTC(new Date(TEST_TIME_END));

    scalingTarget.scaleOnSchedule(`TestTimeScaleOut${NODE_ENV_PASCAL}`, {
      schedule: Schedule.cron({
        minute: testStartTime.getUTCMinutes().toString(),
        hour: testStartTime.getUTCHours().toString(),
      }),
      maxCapacity: 10,
      minCapacity: 9,
    });

    scalingTarget.scaleOnSchedule(`TestTimeScaleIn${NODE_ENV_PASCAL}`, {
      schedule: Schedule.cron({
        minute: testEndTime.getUTCMinutes().toString(),
        hour: testEndTime.getUTCHours().toString(),
      }),
      minCapacity: 0,
      maxCapacity: 0,
    });
  }
}
