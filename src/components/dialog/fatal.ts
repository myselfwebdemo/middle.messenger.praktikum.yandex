import Block from 'core/Block';
import '../dialog/dialog.css';
import Button from 'components/button/button';

interface Props {
    title: string
    mainMessage: string
    finalAction: string
    extratip?: string
}
export default class Fatal extends Block {
    constructor(props: Props) {
        super('div', {
            ...props,
            className: 'dialog-wrapper fatal', 
            events: {
                click: (e: Event) => {
                    // @ts-ignore
                    if (!e.target.closest('.fatal-dialog') || e.target.closest('.button.u-secondary')) {
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

