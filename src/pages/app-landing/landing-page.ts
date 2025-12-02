import './landing-style.css';

import Button from "components/button/button";
import Block from "core/Block";
import type Router from 'core/router';
import { checkLogin } from 'services/service';
import { injectRouter } from "utils/injectRouter";

interface THome {
    router: Router
}
class Home extends Block<THome,Record<string,Block>>{
    constructor(props: THome) {
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
                        this.props.router.go('/log-in');
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
