import Block from "../../core/block";

interface TAProps {
    id: string
    label: string
    placeholder?: string
    required?: boolean
    events?: Record<string, () => void> 
}

export default class SelfSearch extends Block {
    constructor(props: TAProps) {
        super('div', {
            ...props,
            className: 'ta-wrapper',
            events: props.events
        });
    }

    public render(): string {
        return `
            <label for="{{id}}">{{label}}</label>
            <p  id={{id}}
                {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
                contenteditable/></p>
        `
    }
}
