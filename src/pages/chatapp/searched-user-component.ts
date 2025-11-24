import Block from 'core/Block';
import './chatapp.css';

interface Props {
    name: string
}

export default class FUUser extends Block {
    constructor(props: Props) {
        super('div', { 
            ...props,
            className: 'fu-user',
        })
    }
    public render(): string {
        return `
            <p>{{ name }}</p>
        `
    }
}
