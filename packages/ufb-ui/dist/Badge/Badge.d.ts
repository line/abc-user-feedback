import { MouseEventHandler } from 'react';
import { IconNameType } from '../Icon';
type ColorType = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'navy' | 'purple';
interface IProps extends React.PropsWithChildren {
    left?: {
        iconName: IconNameType;
        onClick?: MouseEventHandler<HTMLOrSVGElement>;
    };
    right?: {
        iconName: IconNameType;
        onClick?: MouseEventHandler<HTMLOrSVGElement>;
        disabled?: boolean;
    };
    color?: ColorType | 'black';
    type?: 'primary' | 'secondary' | 'tertiary';
    size?: 'md' | 'sm';
}
export declare const Badge: React.FC<IProps>;
export {};
//# sourceMappingURL=Badge.d.ts.map