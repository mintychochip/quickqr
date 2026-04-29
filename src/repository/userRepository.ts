import type {UserRecord} from './models';
import type {UUID} from '../container/uuid';

// Alias for compatibility
type User = UserRecord;

export interface UserRepository {
    create(user: User): Promise<boolean>;
    read(userId: UUID): Promise<User>;
    update(user: User): Promise<boolean>;
    delete(userId: UUID): Promise<boolean>;
    getAll(): Promise<User[]>;
}
