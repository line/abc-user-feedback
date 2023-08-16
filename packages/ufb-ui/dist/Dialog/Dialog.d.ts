/// <reference types="react" />
import { IIconProps } from '../Icon';
export interface IDialogProps extends React.PropsWithChildren {
    title: string;
    description?: string;
    open: boolean;
    close: () => void;
    icon?: IIconProps;
    bottomButtons: React.ButtonHTMLAttributes<HTMLButtonElement>[];
}
export declare const Dialog: React.FC<IDialogProps>;
//# sourceMappingURL=Dialog.d.ts.map