import Block from "../../core/block";

interface InputProps {
    id: string;
    name: string;
    type: string;
    class?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    typeIMG?: boolean;
    src?: string;
    mismatchObject?: string,
    events?: Record<string, () => void>;
}

export default class Input extends Block<InputProps> {
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
                {{#if class}}class="{{class}}"{{/if}}
                {{#if id}}id="{{id}}"{{/if}}
                type="{{type}}" 
                name="{{name}}"
                {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
                {{#if value}}value="{{value}}"{{/if}}
                {{#if required}}required="{{required}}"{{/if}}/>
            {{#if typeIMG}}<img src="/assets/{{src}}" alt="{{alt}}">{{/if}}
            {{#if mismatchObject}}<p class="{{mismatchObject}}"></p>{{/if}}
        `;
    }
}
