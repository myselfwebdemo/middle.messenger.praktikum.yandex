import './psl.css';
import Block from '../../core/Block.ts';
import Input from '../input/input.ts';

interface PSLProps {
    trait: string
    traitValue?: string

    reqInput?: boolean
    class?: string
    id?: string
    name?: string
    type?: string
    value?: string
    placeholder?: string
    required?: boolean
}

export default class PSL extends Block {
    constructor(props: PSLProps) {
        super('span', {
            ...props,
            className: 'psl',

            ...(props.reqInput 
                ? {
                    Input: new Input({
                        class: props.class,
                        id: props.id || '',
                        name: props.name || '',
                        type: props.type || '',
                        value: props.value,
                        placeholder: props.placeholder,
                        required: props.required
                    })
                }
                : {}
            )
        })
    }
    public render(): string {
        return `
            <p>{{trait}}</p>
            {{#if traitValue}} <p id="psl-data">{{traitValue}}</p> {{/if}}
            {{#if reqInput}}
                {{{ Input }}}
            {{/if}}
        `
    }
}
