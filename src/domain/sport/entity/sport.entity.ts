export type SportProps = {
    id: number
    name: string
    displayColor: string
    displayIcon: string
}

export class Sport {
    private constructor(private props: SportProps) {}

    public static create(
        id: number,
        name: string,
        displayColor: string,
        displayIcon: string
    ): Sport {
        return new Sport({ id, name, displayColor, displayIcon })
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

    public get displayColor(): string {
        return this.props.displayColor
    }

    public get displayIcon(): string {
        return this.props.displayIcon
    }
}
