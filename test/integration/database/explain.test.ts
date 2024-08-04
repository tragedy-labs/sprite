// Lib
import { ArcadeSqlExplanation } from '@/types/database.js';

// Testing
import { testClient as client } from './testClient.js';

describe('SpriteDatabase.explain', () => {

  let result: ArcadeSqlExplanation;

  beforeAll(async () => {
    result = await client.explain('SELECT FROM schema:types')
    console.log(result);
    // {
    //   "executionPlan": {
    //     "cost": -1,
    //     "javaType": "com.arcadedb.query.sql.executor.SelectExecutionPlan",
    //     "prettyPrint": "+ FETCH DATABASE METADATA TYPES",
    //     "steps": [
    //       {
    //         "cost": -1,
    //         "description": "+ FETCH DATABASE METADATA TYPES",
    //         "javaType": "com.arcadedb.query.sql.executor.FetchFromSchemaTypesStep",
    //         "name": "FetchFromSchemaTypesStep",
    //         "subSteps": [],
    //         "targetNode": "FetchFromSchemaTypesStep",
    //         "type": "FetchFromSchemaTypesStep",
    //       },
    //     ],
    //     "type": "QueryExecutionPlan",
    //   },
    //   "executionPlanAsString": "+ FETCH DATABASE METADATA TYPES",
    // }
  });
  
  it('matches the explanations snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('has a defined execution plan with necessary properties', () => {
    const { executionPlan } = result;
    expect(executionPlan).toBeDefined();
    expect(executionPlan.prettyPrint).toBeDefined();
    expect(executionPlan.steps).toBeDefined();
    expect(executionPlan.type).toBeDefined();
    expect(executionPlan.cost).toBeDefined();
    expect(executionPlan.javaType).toBeDefined();
  });

  it('has an execution plan as string', () => {
    expect(result.executionPlanAsString).toBeDefined();
  });

  it('the first step in the execution plan has necessary properties', () => {
    const firstStep = result.executionPlan.steps[0];
    expect(firstStep).toBeDefined();
    expect(firstStep.targetNode).toBeDefined();
    expect(firstStep.description).toBeDefined();
    expect(firstStep.name).toBeDefined();
    expect(firstStep.type).toBeDefined();
    expect(firstStep.subSteps).toBeDefined();
  });
});
