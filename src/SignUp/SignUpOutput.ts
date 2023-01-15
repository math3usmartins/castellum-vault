import type { Seed } from "../MultiFactorAuth/Seed"

export class SignUpOutput {
	constructor(readonly seed: Seed) {}
}
