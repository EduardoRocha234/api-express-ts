export type UserProps = {
    id: string
    name: string
    email: string
    password: string
}

export class User {
    private constructor(private props: UserProps) {}

    public static create(name: string, email: string, password: string) {
        return new User({
            id: crypto.randomUUID().toString(),
            name,
            email,
            password
        })
    }

    public static with(props: UserProps) {
        return new User(props)
    }

    public get id() {
        return this.props.id
    }

    public get name() {
        return this.props.name
    }

    public get email() {
        return this.props.email
    }

    public get password() {
        return this.props.password
    }
}
