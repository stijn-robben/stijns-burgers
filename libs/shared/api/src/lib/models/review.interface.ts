import { Id } from './id.type';

export interface IReview {
    _id: Id;
    score: number;
    description: string;
}

export class Review implements IReview {
    _id: Id;
    score: number;
    description: string;

    constructor(_id: Id, score: number, description: string) {
        this._id = _id;
        this.score = score;
        this.description = description;
    }
}

export type ICreateReview = Pick<
IReview,
    'score' | 'description'
>;


export type IUpdateReview = Partial<Omit<IReview, 'id'>>;
export type IUpsertReview = IReview;