export interface MultiFactorAuthValidator {
	validate: (seed: string, mfaCode: string) => Promise<void>
}
