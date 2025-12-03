import Block from "core/Block";
import './image.css';

interface ImageProps {
    class: string
    src: string | null
    alt: string
    directLink?: boolean
}
type P = ImageProps & BlockBaseProps

export default class Image extends Block<P> {
    constructor(props: ImageProps) {
        super('img', {
            ...props,
            className: `app-img u-${props.class}`,
            attrs: {
                src: (props.directLink ? props.src : (props.src ? `/assets/${props.src}` : '/assets/profile/default.png')) || '',
                alt: props.alt
            }
        })
    }
    componentDidUpdate(oldProps: Record<string, unknown>, newProps: Record<string, unknown>): boolean {
        const oldImageProps = oldProps as unknown as ImageProps;
        const newImageProps = newProps as unknown as ImageProps;

        if (oldImageProps.src !== newImageProps.src) {
            this.element?.setAttribute('src', newImageProps.src || '/profile/default.png');
        }
        if (oldImageProps.alt !== newImageProps.alt) {
            this.element?.setAttribute('alt', newImageProps.alt);
        }
        return true;
    }
    public render(): string {
        return ``
    }
}
