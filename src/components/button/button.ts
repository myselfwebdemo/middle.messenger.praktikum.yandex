import './button.css';
import Block from '../../core/Block.ts';

interface localProps {
    classTypeOfButton: string
    buttonType: "button" | "submit"
    clientAction?: string
    inlineStyle?: string
    typeIMG?: boolean
    src?: string
    events?: Record<string, (e: Event) => void>
}
export default class Button extends Block {
    constructor(props: localProps) {
        super('button', {
            ...props,
            className: `button u-${props.classTypeOfButton}`,
            clientAction: props.clientAction,
            attrs: {
                type: props.buttonType,
            },
            events: props.events
        });
    }
    public render(): string {
        return `
            {{#if clientAction}}<span>{{clientAction}}</span>{{/if}}
            {{#if typeIMG}}<img src="/assets/{{src}}">{{/if}}
        `
    }
}
