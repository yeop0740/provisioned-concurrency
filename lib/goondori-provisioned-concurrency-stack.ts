import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as applicationautoscaling from "aws-cdk-lib/aws-applicationautoscaling";
import { Construct } from "constructs";
import {
  DINNER_TIME_END,
  DINNER_TIME_START,
  GRAPHQL_LAMBDA_NAME,
  NODE_ENV_PASCAL,
  NODE_ENV_UPPER,
  TEST_TIME_END,
  TEST_TIME_START,
} from "../config";
import { convertKSTToUTC } from "../util";

export class GoondoriProvisionedConcurrencyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const graphqlLambda = lambda.Function.fromFunctionName(
      this,
      `GraphqlLambda${NODE_ENV_PASCAL}`,
      GRAPHQL_LAMBDA_NAME
    );

    const lambdaAlias = new lambda.Alias(this, `Alias${NODE_ENV_PASCAL}Dev`, {
      aliasName: NODE_ENV_UPPER,
      version: graphqlLambda.latestVersion,
    });

    const scalingTarget = new applicationautoscaling.ScalableTarget(
      this,
      `ScalingTarget${NODE_ENV_PASCAL}`,
      {
        serviceNamespace: applicationautoscaling.ServiceNamespace.LAMBDA,
        maxCapacity: 10,
        minCapacity: 1,
        resourceId: `function:${graphqlLambda.functionName}:${lambdaAlias.aliasName}`,
        scalableDimension: "lambda:function:ProvisionedConcurrency",
      }
    );

    const dinnerStartTime = convertKSTToUTC(new Date(DINNER_TIME_START));
    const dinnerEndTime = convertKSTToUTC(new Date(DINNER_TIME_END));

    scalingTarget.scaleOnSchedule(`DinnerTimeScaleOut${NODE_ENV_PASCAL}`, {
      schedule: applicationautoscaling.Schedule.cron({
        minute: dinnerStartTime.getUTCMinutes().toString(),
        hour: dinnerStartTime.getUTCHours().toString(),
      }),
      maxCapacity: 10,
      minCapacity: 9,
    });

    scalingTarget.scaleOnSchedule(`DinnerTimeScaleIn${NODE_ENV_PASCAL}`, {
      schedule: applicationautoscaling.Schedule.cron({
        minute: dinnerEndTime.getUTCMinutes().toString(),
        hour: dinnerEndTime.getUTCHours().toString(),
      }),
      minCapacity: 0,
      maxCapacity: 0,
    });

    const testStartTime = convertKSTToUTC(new Date(TEST_TIME_START));
    const testEndTime = convertKSTToUTC(new Date(TEST_TIME_END));

    scalingTarget.scaleOnSchedule(`TestTimeScaleOut${NODE_ENV_PASCAL}`, {
      schedule: applicationautoscaling.Schedule.cron({
        minute: testStartTime.getUTCMinutes().toString(),
        hour: testStartTime.getUTCHours().toString(),
      }),
      maxCapacity: 10,
      minCapacity: 9,
    });

    scalingTarget.scaleOnSchedule(`TestTimeScaleIn${NODE_ENV_PASCAL}`, {
      schedule: applicationautoscaling.Schedule.cron({
        minute: testEndTime.getUTCMinutes().toString(),
        hour: testEndTime.getUTCHours().toString(),
      }),
      minCapacity: 0,
      maxCapacity: 0,
    });
  }
}
