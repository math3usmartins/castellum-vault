export class LoginInput {
	constructor(readonly email: string, readonly token: string, readonly mfaCode: string) {}
}
