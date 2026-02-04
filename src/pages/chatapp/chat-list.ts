import './chatapp.css';
import Block from '../../core/Block.ts';
import { linkStorage } from '../../utils/link-storage.ts';
import { injectRouter } from '../../utils/injectRouter.ts';
import ChatCard from '../../components/chat-card/chat-card.ts';

class ChatList extends Block<{}, Record<string,Block>> {
    constructor() {
        super('div', {
            className: 'chat-list',
        });
    }
    setProps(newProps: {loading: boolean, chats: Record<number, TChatBE>}): void {
        super.setProps(newProps);
        
        Object.keys(this.children).forEach(key => {
            this.removeChildren(key);
        })
        Object.entries(newProps.chats).forEach(([chatId,chat]) => {
            Object.values((chat as TChatBE).users).forEach((user) => {
                if ((user as TUser).id !== window.memory.take().user.id) {
                    this.addChildren(new ChatCard({ recipientName: (user as TUser).login, class: 'on-hover chat-card' }), `chat_${chatId}`);
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

const props = (wm: Partial<MemoryBI>) => {
    return {
        loading: wm.loading,
        chats: wm.chats
    }
}
export default linkStorage(props)(injectRouter(ChatList));
