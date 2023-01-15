import type { AccountRepository } from "../AccountRepository"
import { Account } from "../../Account"
import { AccountNotFoundError } from "./Error/AccountNotFoundError"
import type { Seed } from "../../MultiFactorAuth/Seed"
import { SeedCollection } from "../../MultiFactorAuth/SeedCollection"
import { AccountId } from "../AccountId"

export class InMemoryRepository implements AccountRepository {
	constructor(private accounts: Account[]) {}

	public async getByEmail(email: string): Promise<Account> {
		const account = this.accounts.find((a: Account): boolean => a.email === email)

		if (account !== undefined) {
			return await Promise.resolve(account)
		} else {
			return await Promise.reject(new AccountNotFoundError())
		}
	}

	public async create(email: string, seed: Seed): Promise<Account> {
		const id = this.accounts.length + 1

		const account = new Account(new AccountId(`user-${id}`), email, SeedCollection.with([seed]))

		await this.save(account)

		return account
	}

	public async save(account: Account): Promise<void> {
		const otherAccounts = this.accounts.filter((a: Account) => a.email !== account.email)

		this.accounts = [...otherAccounts, account]

		await Promise.resolve()
	}
}
