import type { Account } from "../../../Account"
import { PutItemCommand } from "@aws-sdk/client-dynamodb"

export class PutItemFactory {
	public static execute(
		tableName: string,
		id: string,
		account: Account,
	): PutItemCommand {
		return new PutItemCommand({
			TableName: tableName,
			Item: {
				id: {
					S: id,
				},
				email: {
					S: account.email,
				},
			},
		})
	}
}
