import Block from 'core/block';

interface CardInterface {
    recipientName: string
    lastMessage?: string
    src?: string
    time?: string
    lastTextYou?: boolean
    unread?: number
}

export default class ChatCard extends Block {
    constructor(props: CardInterface) {
        super('div', {
            ...props,
            className: 'on-hover chat-card',
            attrs: {
                'data-recipient': props.recipientName,
                'data-last-message': props.lastMessage,
            }
        })
    }
    public render(): string {
        return `
            {{> component_image
                class="chat-list-recipient"
                src=src}}
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
