import type { SeedCollection } from "./MultiFactorAuth/SeedCollection"
import type { Seed } from "./MultiFactorAuth/Seed"
import type { AccountId } from "./Account/AccountId"

export class Account {
	constructor(
		public readonly id: AccountId,
		public readonly email: string,
		public readonly multiFactorConfigCollection: SeedCollection,
	) {}

	public addMultiFactorAuthSeed(seed: Seed): Account {
		return new Account(this.id, this.email, this.multiFactorConfigCollection.add(seed))
	}

	public active(seed: Seed): Account {
		return new Account(this.id, this.email, this.multiFactorConfigCollection.add(seed.active()))
	}

	public isActive(): boolean {
		return this.multiFactorConfigCollection.getActive() !== null
	}
}
