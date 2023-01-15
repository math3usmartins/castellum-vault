import type { LoginSessionRepository } from "../LoginSessionRepository"
import type { Account } from "../../Account"
import { LoginSession } from "../LoginSession"

export class InMemoryRepository implements LoginSessionRepository {
	private sessions: LoginSession[] = []

	public static withAlreadyExistingSession(sessions: LoginSession[]): InMemoryRepository {
		const repository = new InMemoryRepository()
		repository.sessions = [...sessions]

		return repository
	}

	public async create(account: Account): Promise<LoginSession> {
		const session = new LoginSession(`SID-${this.sessions.length + 1}`, account.email)

		this.sessions = [...this.sessions, session]

		return await Promise.resolve(session)
	}
}
