import Block from 'core/Block';
import Message from './message';
import './message.css';

export default class MessageList extends Block {
    constructor() {
        super('div', {
            className: 'messages',

            // m1: new Message({
            //     messageType: 'text',
            //     textContent: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt eveniet error perferendis eum maiores alias dolore consequuntur quae provident, modi tempora mollitia eius libero voluptatem nisi delectus, perspiciatis quaerat incidunt?',
            //     time: '2:33'
            // }),
            // m2: new Message({
            //     messageType: 'image',
            //     src: '/main.png',
            //     time: '2:33'
            // }),
            // m3: new Message({
            //     messageType: 'image',
            //     fromYou: true,
            //     src: '/image.png',
            //     time: '2:33'
            // }),
            // m4: new Message({
            //     messageType: 'image',
            //     fromYou: true,
            //     src: '/assets/error.png',
            //     time: '2:33'
            // }),
            // m5: new Message({
            //     messageType: 'location',
            //     LAT: 35.535,
            //     LON: 4.567999
            // }),
            // m6: new Message({
            //     messageType: 'image',
            //     src: '/image.png',
            //     time: '2:33'
            // }),
        })
    }
    public render(): string {
        if (Object.keys(this.children).length !== 0) {
            const children_names = Object.keys(this.children);
            const line = [];
            
            for(const name of children_names) {
                line.push(`{{{ ${name} }}}`);
            }
            
            return line.join(' ');
        } else {
            return `
                <div class="chatlist-cork">
                    <h5>Here your messages will appear</h5>
                </div>
            `
        }
    }
}
