import './input.css';
import Block from '../../core/Block.ts';

interface InputProps {
    id: string
    name: string
    type: string
    class?: string
    label?: string
    placeholder?: string
    required?: boolean
    value?: string
    step?: number
    typeIMG?: boolean
    src?: string
    mismatchObject?: string
    disabled?: boolean
    events?: Record<string, (e: Event) => void>,
    accept?: string
}

export default class Input extends Block {
    constructor(props: InputProps) {
        super('div', {
            ...props,
            className: 'input-wrapper',
            events: props.events
        });
    }

    public render(): string {
        return `
            {{#if label}}<label for="{{id}}" data-verdict="no issues detected">{{label}}</label>{{/if}}
            <input 
                id={{id}}
                type={{type}}
                name={{name}}
                {{#if class}}class={{class}}{{/if}}
                {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
                {{#if value}}value="{{value}}"{{/if}}
                {{#if step}}step="{{step}}"{{/if}}
                {{#if required}}required{{/if}}
                />
            {{#if typeIMG}}<img src="/assets/{{src}}" alt="{{alt}}">{{/if}}
            {{#if mismatchObject}}<p class="{{mismatchObject}}"></p>{{/if}}
        `;
    }
}
