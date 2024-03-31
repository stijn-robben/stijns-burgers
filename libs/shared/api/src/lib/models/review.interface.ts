import { Id } from './id.type';

export interface IReview {
    _id: Id;
    score: number;
    description: string;
    _id_user: Id;

}

export class Review implements IReview {
    _id: Id;
    score: number;
    description: string;
    _id_user: Id;
    constructor(_id: Id, score: number, description: string, _id_user: Id) {
        this._id = _id;
        this.score = score;
        this.description = description;
        this._id_user = _id_user;
    }
}

export type ICreateReview = Pick<
IReview,
    'score' | 'description' | '_id_user'
>;


export type IUpdateReview = Partial<Omit<IReview, 'id'>>;
export type IUpsertReview = IReview;