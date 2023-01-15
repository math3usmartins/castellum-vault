import type { SeedGenerator } from "../SeedGenerator"
import type { Seed } from "../Seed"

export class InMemorySeedGenerator implements SeedGenerator {
	constructor(private readonly seed: Seed) {}

	async generate(): Promise<Seed> {
		return await Promise.resolve(this.seed)
	}
}
