import type { MultiFactorAuthValidator } from "../MultiFactorAuthValidator"
import { InvalidMultiFactorAuthError } from "./Error/InvalidMultiFactorAuthError"

export class InMemoryMultiFactorAuthValidator implements MultiFactorAuthValidator {
	constructor(private readonly seed: string, private readonly mfaCode: string) {}

	async validate(seed: string, mfaCode: string): Promise<void> {
		this.seed === seed && this.mfaCode === mfaCode
			? await Promise.resolve()
			: await Promise.reject(new InvalidMultiFactorAuthError())
	}
}
