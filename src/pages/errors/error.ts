import './errors.css';
import Button from '../../components/button/button.ts';
import e from '../../components/error/error.ts';
import Block from '../../core/Block.ts';

interface EProps {
    eSrc: string
    eAlt: string
    error: string
}
type P = EProps & BlockBaseProps

export default class E extends Block<P, Record<string,Block>> {
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
                clientAction: 'Return back',
                events: {
                    click: () => {
                        window.history.back();
                    }
                }
            })
        })
    }
    public render(): string {
        return `
            {{{ Error }}}
            {{{ ReturnBack }}}
        `
    }
}
