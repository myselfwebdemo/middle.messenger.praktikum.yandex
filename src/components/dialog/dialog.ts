// @ts-nocheck
import Block from 'core/Block';
import Button from '../button/button';
import Input from '../input/input';
import { getLocByQuery } from 'utils/locationAPI';
import SelfSearch from '../input/selfsearch';
import './dialog.css';
import { clg } from 'main';

interface DialogProps {
    title: string
    executiveAction: string
    executiveEvent?: Record<string, () => void>
    inputEvent?: Record<string, () => void>
    onSelSearchRes?: Record<string, () => void>
    id?: string
    name?: string
    type?: string
    class?: string
    label?: string
    placeholder?: string
    inputAccept?: string
    recipientLogin?: string
    locat?: boolean
    builtInSearch?: boolean
}

export default class DialogWindow extends Block {
    constructor(props: DialogProps) {
        super('div', {
            ...props,
            className: 'dialog-wrapper',
            events: {
                click: (e: Event) => {
                    if (props.onSelSearchRes) {
                        props.onSelSearchRes.click?.(e);
                    }

                    if (props.locat) {
                        const input = document.getElementById('standalone');
    
                        if (input.textContent === '') {
                            input?.setAttribute('placeholder','Required field: must contain the adress.');
                        }
                        if (e.target.closest('.button.u-primary') && input.textContent !== '') {
                            document.querySelector('.dialog form').submit();
                        }
                    }

                    if (!e.target.closest('.dialog') && document.activeElement.id !== 'map' && document.activeElement.id !== 'standalone' || e.target.closest('.dialog .button.u-secondary')) {
                        this.close();
                    }
                },
                change: (e: Event) => {
                    if (props.type !== 'text') {
                        const i = document.querySelector('.dialog input[type="file"]')
                        const preview = document.getElementById('dialog-preview');

                        preview.src = window.URL.createObjectURL(i.files[0]);
                    }
                }
            },

            ...(props.locat
                ? {
                    StandaloneSearch: new SelfSearch({
                        id: 'standalone',
                        type: 'text',
                        label: 'Your location',
                        placeholder: 'Find a city or place',
                        required: true,
                        events: {
                            input: (e: Event) => {
                                const request = document.getElementById('standalone').textContent;
                                
                                if (e.target?.textContent === '') {
                                    e.target.innerHTML = '';
                                }
                                if (/\u00A0$| $/.test(request)) {
                                    getLocByQuery(request.trim());
                                }
                            }
                        }
                    }),
                    Cancel: new Button({
                        classTypeOfButton: 'secondary',
                        buttonType: 'button',
                        clientAction: 'Cancel'
                    }),
                    Confirm: new Button({
                        classTypeOfButton: 'primary',
                        buttonType: 'submit',
                        clientAction: 'Confirm'
                    })
                }
                : {
                    Input: new Input({
                        id: props.id,
                        name: props.name,
                        class: props.class,
                        type: props.type,
                        label: props.label,
                        placeholder: props.placeholder,
                        value: props.recipientLogin,
                        accept: props.inputAccept,
                        events: props.inputEvent
                    }),
                    Commit: new Button({
                        classTypeOfButton: 'primary',
                        buttonType: 'submit',
                        clientAction: props.executiveAction,
                        events: props.executiveEvent
                    })
                }
            )
        })
    }
    public render(): string {
        return `
            <div class="dialog {{#if locat}}d-locat{{/if}}">
                <h2>{{title}}</h2>
                {{#if locat}}
                    <div id="map-wrapper">
                        <div id="map"></div>
                    </div>
                    <form class="dialog-locat-form">
                       {{{ StandaloneSearch }}}
                        <div class="dialog-actions">
                            {{{ Cancel }}}
                            {{{ Confirm }}}
                        </div>
                    </form>
                {{else}}
                    {{#if (deq type "text")}}
                        <img id="dialog-preview" src="">
                    {{/if}}
                    {{{ Input }}}
                    {{#if builtInSearch}}
                        <div class="dw-fu">
                            <h5>Found users:</h5>
                            <h4 id="dwFu"></h4>
                            <h4 id="dwFu"></h4>
                            <h4 id="dwFu"></h4>
                        </div>
                    {{/if}}
                    {{{ Commit }}}
                {{/if}}
            </div>
        `
    }
}
