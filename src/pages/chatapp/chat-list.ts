import Block from '../../core/block';
import ChatCard from '../../components/chat-card/chat-card';

export default class ChatList extends Block {
    constructor() {
        super('div', {
            className: 'chat-list',
            PublicChat: new ChatCard({
                recipientName: 'Source Dev',
                lastMessage: '',
                src: 'profile/example.png',
                time: '',
            }),
            CC1: new ChatCard({
                src: 'profile/example.png',
                recipientName: 'Recipient Name',
                lastMessage: 'Last message.',
                unread: 4,
                time: '2:00'
            }),
        })
    }
    public render(): string {
        const children_names = Object.keys(this.children);
        const line = [];

        for(const name of children_names) {
            line.push(`{{{ ${name} }}}`)
        }

        return line.join(' ')
    }
}
