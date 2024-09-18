export type SportProps = {
    id: number
    name: string
}

export class Sport {
    private constructor(private props: SportProps) {}

    public static create(id: number, name: string): Sport {
        return new Sport({ id, name })
    }

    public static with(props: SportProps) {
        return new Sport(props)
    }

    public get id(): number {
        return this.props.id
    }

    public get name(): string {
        return this.props.name
    }
}
