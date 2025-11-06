import Block from 'core/Block';
import './message.css';

interface MessageProps {
    messageType: 'text' | 'image' | 'location'
    fromYou?: boolean
    textContent?: string
    src?: string
    LAT?: number
    LON?: number
    time?: string
}

export default class Message extends Block {
    constructor(props: MessageProps) {
        super('div', {
            ...props,
            className: 'meswrap'
        })
    }
    public render(): string {
        return `
            <div class="mbody u-{{messageType}} {{#if fromYou}}u-self{{else}}u-toself{{/if}}">
                {{#if (eq messageType 'text')}}
                    <p>{{textContent}}</p>
                {{/if}}
                {{#if (eq messageType 'image')}}
                    <img src="{{src}}">
                {{/if}}
                {{#if (eq messageType 'location')}}
                    <iframe
                        loading="lazy"
                        allowfullscreen
                        referrerpolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps?q={{LAT}},{{LON}}&z=14&output=embed">
                    </iframe>
                {{/if}}
                {{#if time}} <h6>{{time}}</h6> {{/if}}
            </div>
        `
    }
}
