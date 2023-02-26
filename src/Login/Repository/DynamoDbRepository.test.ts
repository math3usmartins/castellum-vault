import assert from "assert"
import "mocha"

import {
	BillingMode,
	DeleteTableCommand,
	DynamoDBClient,
} from "@aws-sdk/client-dynamodb"
import { CreateTableFactory } from "./DynamoDb/CreateTableFactory"
import { DynamoDbRepository } from "./DynamoDbRepository"
import { InMemoryIdGenerator } from "./DynamoDb/IdGenerator/InMemoryIdGenerator"
import { Account } from "../../Account"
import { Seed } from "../../MultiFactorAuth/Seed"
import { SeedCollection } from "../../MultiFactorAuth/SeedCollection"
import { LoginSession } from "../LoginSession"

const client = new DynamoDBClient({
	region: "local",
	endpoint: "http://dynamodb:8000",
	credentials: {
		accessKeyId: "DUMMYIDEXAMPLE",
		secretAccessKey: "DUMMYEXAMPLEKEY",
	},
})
const TABLE_NAME = "LoginSessionTest"

const seed = new Seed("seed-123").active()
const email = "someone@acme.org"

describe("DynamoDbRespoitory", async () => {
	it("must store a new session", async () => {
		await setUp()

		const repository = new DynamoDbRepository(
			client,
			new InMemoryIdGenerator(["SID-1"]),
			TABLE_NAME,
		)

		const account = new Account(email, SeedCollection.with([seed]))

		const session = await repository.create(account)

		assert.deepStrictEqual(session, new LoginSession("SID-1", email))

		await tearDown()
	})
})

async function setUp(): Promise<void> {
	const throughput = {
		ReadCapacityUnits: 1,
		WriteCapacityUnits: 1,
	}

	const commandFactory = new CreateTableFactory(
		TABLE_NAME,
		throughput,
		BillingMode.PAY_PER_REQUEST,
	)

	await client.send(commandFactory.execute())
}

async function tearDown(): Promise<void> {
	await client.send(
		new DeleteTableCommand({
			TableName: TABLE_NAME,
		}),
	)
}
