import type { LoginInput } from "./LoginInput"

export interface LoginValidator {
	validate: (input: LoginInput) => Promise<void>
}
