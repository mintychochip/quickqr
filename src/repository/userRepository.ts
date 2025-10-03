import type {User, UUID} from './models'
export interface UserRepository {
    create(user: User): Promise<boolean>;
    read(userId: UUID): Promise<User>;
    update(user: User): Promise<boolean>;
    delete(userId: UUID): Promise<boolean>;
    getAll(): Promise<User[]>;
}