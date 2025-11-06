import './landing-style.css';

import Button from "components/button/button";
import Block from "core/Block";
import { injectRouter } from "utils/injectRouter";

class Home extends Block {
    // @ts-ignore
    constructor(props) {
        super('div', {
            ...props,
            className: 'app-landing',
            
            Enter: new Button({
                classTypeOfButton: 'primary',
                buttonType: 'button',
                clientAction: 'Enter app',
                events: {
                    click: () => {
                        this.props.router.go('/login');
                    }
                },
            }),

            EnterS: new Button({
                classTypeOfButton: 'primary',
                buttonType: 'button',
                clientAction: 'Messenger',
                events: {
                    click: () => {
                        this.props.router.go('/messenger');
                    }
                },
            })
        })
    }
    public render(): string {
        return `
            <h1>Welcome!</h1>
            {{{ Enter }}}
            {{{ EnterS }}}
        `;
    }
}

export default injectRouter(Home);
