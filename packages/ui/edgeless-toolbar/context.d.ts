import type { ColorScheme } from '@linvo-core/content';
import type { Subject } from 'rxjs';
import type { EdgelessToolbarWidget } from './edgeless-toolbar';
export interface EdgelessToolbarSlots {
    resize: Subject<{
        w: number;
        h: number;
    }>;
}
export declare const edgelessToolbarSlotsContext: {
    __context__: EdgelessToolbarSlots;
};
export declare const edgelessToolbarThemeContext: {
    __context__: ColorScheme;
};
export declare const edgelessToolbarContext: {
    __context__: EdgelessToolbarWidget;
};
