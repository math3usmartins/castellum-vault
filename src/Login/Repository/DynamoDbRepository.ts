import type { LoginSessionRepository } from "../LoginSessionRepository"
import { LoginSession } from "../LoginSession"
import type { Account } from "../../Account"

import type { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutItemFactory } from "./DynamoDb/PutItemFactory"
import type { IdGenerator } from "./DynamoDb/IdGenerator"

export class DynamoDbRepository implements LoginSessionRepository {
	constructor(
		private readonly client: DynamoDBClient,
		private readonly idGenerator: IdGenerator,
		private readonly tableName: string,
	) {}

	async create(account: Account): Promise<LoginSession> {
		const id: string = await this.idGenerator.generate()

		const putItemCommand = PutItemFactory.execute(
			this.tableName,
			id,
			account,
		)

		await this.client.send(putItemCommand)

		return new LoginSession(id, account.email)
	}
}
