import { IRawStyle } from '@uifabric/merge-styles';

export type IRawStyleObject = IRawStyle | null | undefined;

/** Subset of IStyle that limits styles to spreadable types */
export type IStyleObject = IRawStyleObject | Array<IRawStyleObject>;
