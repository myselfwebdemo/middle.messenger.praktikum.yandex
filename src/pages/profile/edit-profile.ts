// @ts-nocheck
import Button from 'components/button/button';
import DialogWindow from 'components/dialog/dialog';
import Image from 'components/image/image';
import PSL from 'components/profile-info/psl';
import Block from 'core/block';

export default class EditUserProfile extends Block {
    constructor() {
        super('div', {
            className: 'profile',

            ReturnBack: new Button({
                classTypeOfButton: 'send back-btn',
                buttonType: 'button',
                typeIMG: true,
                src: 'back.png'
            }),
            ProfileIcon: new Image({
                class: 'profile-icon',
                src: '/profile/example.png',
                alt: 'profile picture'
            }),

            l: new PSL({
                trait: 'Email', 

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,

                id: 'email',
                name: 'email',
                value: 'user-email@domain.com',
                placeholder: 'user-email@domain.com',
            }),
            l1: new PSL({
                trait: 'Name', 
                
                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_first_name',
                name: 'profile_first_name',
                value: 'User Name',
                placeholder: 'User Name'
            }),
            l2: new PSL({
                trait: 'Surname', 

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_second_name',
                name: 'profile_second_name',
                value: 'User Surname',
                placeholder: 'User Surname'
            }),
            l3: new PSL({
                trait: 'Username',

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_login',
                name: 'profile_login',
                value: 'usexample2000kill',
                placeholder: 'usexample2000kill'
            }),
            l4: new PSL({
                trait: 'Phone',
                
                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_phone',
                name: 'profile_phone',
                value: '+112223334455',
                placeholder: '+112223334455'
            }),

            Submit: new Button({
                classTypeOfButton: 'primary',
                buttonType: 'submit',
                clientAction: 'Confirm changes'
            })
        })
    }
    public render(): string {
        return `
            {{{ ReturnBack }}}

            <div class="profile-icon-wrapper">
                {{{ ProfileIcon }}}
            </div>
            <h1 id="profile_user_fullname">user name</h1>
            <form class="paw"> {{!-- PAW: profile action wrapper --}}
                <div class="ps-lines">
                    {{{ l }}} {{{ l1 }}} {{{ l2 }}} {{{ l3 }}} {{{ l4 }}}
                </div>
                <div class="profile-action">
                    {{{ Submit }}}
                </div>
            </form>
        `
    }
}
