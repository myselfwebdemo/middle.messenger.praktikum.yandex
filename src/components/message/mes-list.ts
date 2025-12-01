import Block from 'core/Block';
import './message.css';
import Button from 'components/button/button';

export default class MessageList extends Block<Record<string,any>,Record<string,Block>> {
    constructor() {
        super('div', {
            className: 'messages',
            events: {
                scroll: () => {
                    const el = this._element as unknown; 
                    if ((el as HTMLElement).scrollTop <= 0) {
                        const maxMesId = this.getMaxMesID();
                        window.__socket.send(JSON.stringify({
                            content: maxMesId.toString(),
                            type: 'get old'
                        }));
                    }
                }
            },

            SayHI: new Button({
                classTypeOfButton: 'secondary small complex',
                buttonType: 'button',
                clientAction: 'Say 👋 Hello',
                events: {
                    click: () => {
                        window.__socket.send(JSON.stringify({
                            content: '👋 Hello',
                            type: 'message'
                        }))
                    }
                }
            })
        })
    }
    private getMaxMesID() {
        let temp = 0;
        Object.keys(this.children).forEach(name => {
            if (name!=='SayHI') {
                const n = Number(name.split('_')[1]);
                if (n>temp) {
                    temp=n;
                }
            }
        })
        return temp;
    }
    public render(): string {
        if (Object.keys(this.children).length > 1) {
            const children_names = Object.keys(this.children);
            const line = [];

            for(const name of children_names) {
                if (name !== 'SayHI') {
                    line.push(`{{{ ${name} }}}`);
                }
            }

            return line.join(' ');
        } else {
            return `
                <div class="meslist-cork">
                    <h3>This chat is empty</h3>
                    <h5>You can start talking by typing message in the input field below or press the button beneath</h5>
                    {{{ SayHI }}}
                </div>
            `
        }
    }
}
