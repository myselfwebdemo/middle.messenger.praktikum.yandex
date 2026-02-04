import './chat-card.css';
import Block from '../../core/Block.ts';
import Image from '../../components/image/image.ts';

interface CardInterface {
    recipientName: string
    lastMessage?: string
    src?: string
    time?: string
    lastTextYou?: boolean
    unread?: number
    class?: string
}

export default class ChatCard extends Block {
    constructor(props: CardInterface) {
        super('div', {
            ...props,
            className: props.class || 'on-hover chat-card',
            attrs: {
                'data-recipient': props.recipientName,
                'data-last-message': props.lastMessage || '',
            },
            image: new Image({
                class: 'chat-list-recipient',
                src: props.src || 'profile/default.png',
                alt: 'recipient image in chat list'
            })
        })
    }
    public render(): string {
        return `
            {{{ image}}}
            <div class="chat-info">
                <h3>{{recipientName}}</h3>
                {{#if lastMessage}}
                    <p>{{#if lastTextYou}}<mark>You:</mark>{{/if}}
                        {{lastMessage}}</p>
                {{/if}}
            </div>
            {{#if time}}
                <span class="chat-last-text">
                    {{time}}
                    {{#if (isNumber unread)}}<span class="n-of-unread" unread="{{unread}}">{{unread}}</span>{{/if}}
                </span>
            {{/if}}
        `
    }
}
