import '../dialog/dialog.css';
import Block from '../../core/Block.ts';

interface WarningProps {
    mesWarning: string
}
export default class Warning extends Block {
    constructor(props: WarningProps) {
        super('div', {
            ...props,
            className: 'dialog-wrapper warning', 
            events: {
                click: (e: Event) => {
                    if (!(e.target as HTMLElement).closest('.warning-dialog')) {
                        this.close();
                    }
                }
            }
        })
    }
    public render(): string {
        return `
            <div class="warning-dialog">
                <div>
                    <h3>Warning</h3>
                    <img src='/assets/warning.png'>
                </div>
                <p id='wp'>{{mesWarning}}</p>
                <p>To proceed click elsewhere (or this: outside this box)</p>
            </div>
        `
    }
}
