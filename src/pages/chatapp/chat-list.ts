// @ts-nocheck
import Block from 'core/Block';
import './chatapp.css';
import { linkStorage } from 'utils/link-storage';
import { injectRouter } from 'utils/injectRouter';
import ChatCard from 'components/chat-card/chat-card';
import { clg } from 'main';

class ChatList extends Block {
    constructor() {
        super('div', {
            className: 'chat-list',
        })
    }
    setProps(newProps): void {
        super.setProps(newProps);
        
        Object.keys(this.children).forEach(key => {
            this.removeChildren(key);
        })
        Object.entries(newProps.chats).forEach(([chatId,chat]) => {
            chat.users.forEach(user => {
                if (user.id !== window.memory.take().user.id) {
                    this.addChildren(new ChatCard({ recipientName: user.login, class: 'on-hover chat-card' }), `chat_${chat.chat.id}`);
                }
            });
        });
    }
    public render(): string {
        if (Object.keys(this.children).length !== 0) {
            const children_names = Object.keys(this.children);
            const line = [];
            
            for(const name of children_names) {
                line.push(`{{{ ${name} }}}`)
            }
            
            return line.join(' ')
        } else {
            return `
                <div class="chatlist-cork">
                    {{#if loading}}
                        <div class="local-loader-wrapper">
                            <div class="local-loader"></div>
                            <h5>Loading chats...</h5>
                        </div>
                    {{else}}
                        <h5>Your chats will appear here</h5>
                    {{/if}}
                </div>
            `
        }
    }
}

const props = (wm) => {
    return {
        loading: wm.loading,
        chats: wm.chats
    }
}
export default linkStorage(props)(injectRouter(ChatList));
