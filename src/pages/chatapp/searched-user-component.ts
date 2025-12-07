import './chatapp.css';
import Block from '../../core/Block.ts';

interface FUUProps {
    name: string
}

export default class FUUser extends Block {
    constructor(props: FUUProps) {
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
