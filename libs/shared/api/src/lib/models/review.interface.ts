import { Id } from './id.type';

export interface IReview {
    _id: Id;
    score: number;
    description: string;
}

export type ICreateReview = Pick<
IReview,
    'score' | 'description'
>;
export type IUpdateReview = Partial<Omit<IReview, 'id'>>;
export type IUpsertReview = IReview;