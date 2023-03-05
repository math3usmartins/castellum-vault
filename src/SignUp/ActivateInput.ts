export class ActivateInput {
	constructor(readonly email: string, readonly token: string, readonly mfaCode: string) {}
}
