import Block from 'core/Block';
import './chatapp.css';

export default class FoundUsersList extends Block {
    constructor() {
        super('div', { className: 'found-users-list' })
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
                <img src="/assets/star.png"/>
                <h5>Results will display here</h5>
            `
        }
    }
}
