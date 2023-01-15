import type { Seed } from "./Seed"

export interface SeedGenerator {
	generate: () => Promise<Seed>
}
