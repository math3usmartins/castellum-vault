import {
	CreateTableCommand,
	ProvisionedThroughput,
} from "@aws-sdk/client-dynamodb"

import type { BillingMode } from "@aws-sdk/client-dynamodb/dist-types/models/models_0"

export class CreateTableFactory {
	constructor(
		private readonly tableName: string,
		private readonly provisionedThroughput: ProvisionedThroughput,
		private readonly billingMode: BillingMode,
	) {}

	public execute(): CreateTableCommand {
		return new CreateTableCommand({
			TableName: this.tableName,
			ProvisionedThroughput: this.provisionedThroughput,
			BillingMode: this.billingMode,
			KeySchema: [
				{
					AttributeName: "id",
					KeyType: "HASH",
				},
			],
			AttributeDefinitions: [
				{
					AttributeName: "id",
					AttributeType: "S",
				},
			],
		})
	}
}
