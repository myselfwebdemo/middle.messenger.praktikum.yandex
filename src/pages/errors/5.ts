import Button from "components/button/button";
import e from "components/error/error";
import Block from "core/block";

interface EProps {
    eSrc: string
    eAlt: string
    error: string
}
export default class E extends Block {
    constructor(props: EProps) {
        super('div', {
            className: 'error-container',

            Error: new e({
                src: props.eSrc,
                alt: props.eAlt,
                ernum: props.error
            }),
            ReturnBack: new Button({
                classTypeOfButton: 'tetriary',
                buttonType: 'button',
                clientAction: 'Back to chats'
            })
        })
    }
    public render(): string {
        return `
            {{{ Error }}}
            {{{ ReturnBack }}}
        `
    }
}
