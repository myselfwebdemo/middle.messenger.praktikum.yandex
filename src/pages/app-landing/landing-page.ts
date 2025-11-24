import './landing-style.css';

import Button from "components/button/button";
import Block from "core/Block";
import { checkLogin } from 'services/service';
import { injectRouter } from "utils/injectRouter";

class Home extends Block {
    // @ts-ignore
    constructor(props) {
        super('div', {
            ...props,
            className: 'app-landing',
            
            Enter: new Button({
                classTypeOfButton: 'primary small',
                buttonType: 'button',
                clientAction: 'Enter app',
                events: {
                    click: () => {
                        checkLogin();
                        this.props.router.go('/login');
                    }
                },
            })
        })
    }
    public render(): string {
        return `
            {{#if loading}}
                <div class="loader-wrapper">
                    <div class="global-loader-wrapper">
                        <div class="global-loader"></div>
                    </div>
                </div>
            {{/if}}

            <span>
                <h1>Welcome!</h1>
                <div class="landing-logo"></div>
            </span>
            {{{ Enter }}}
            <h5>Your personal space.</h5>
        `;
    }
}

export default injectRouter(Home);
