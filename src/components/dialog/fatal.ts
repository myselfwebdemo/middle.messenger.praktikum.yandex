import '../dialog/dialog.css';
import Block from '../../core/Block.ts';
import Button from '../../components/button/button.ts';

interface FatalProps {
    title: string
    mainMessage: string
    finalAction: string
    extratip?: string
    finalEvent?: Record<string, () => void>
}
export default class Fatal extends Block {
    constructor(props: FatalProps) {
        super('div', {
            ...props,
            className: 'dialog-wrapper fatal', 
            events: {
                click: (e: Event) => {
                    if (!(e.target as HTMLElement).closest('.fatal-dialog') || (e.target as HTMLElement).closest('.fatal-dialog .button')) {
                        this.close();
                    }
                }
            },

            cancel: new Button({
                classTypeOfButton: 'secondary small',
                buttonType: 'button',
                clientAction: 'cancel',
            }),
            Action: new Button({
                classTypeOfButton: 'fatal-primary small',
                buttonType: 'button',
                clientAction: props.finalAction,
                events: props.finalEvent
            }),
        })
    }
    public render(): string {
        return `
            <div class="fatal-dialog">
                <h3>{{title}}</h3>
                <p id="mm">{{mainMessage}}</p>
                
                {{#if extratip}}
                    <p id="et">{{extratip}}</p>
                {{/if}}

                <div class="fd-actions">
                    {{{ cancel }}}
                    {{{ Action }}}
                </div>
            </div>
        `
    }
}

