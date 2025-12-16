import { Media } from '@/types';

export class MediaModel {
    _id: string;
    fileName: string;
    title: string;
    altText?: string;

    constructor(data: Media) {
        this._id = data._id;
        this.fileName = data.fileName;
        this.title = data.title;
        this.altText = data.altText;
    }

    static fromDocument(doc: any): MediaModel {
        return new MediaModel({
            _id: doc._id as string,
            fileName: doc.fileName as string,
            title: (doc.title as string) ?? '',
            altText: doc.altText as string | undefined,
        });
    }

    toJSON(): Media {
        return {
            _id: this._id,
            fileName: this.fileName,
            title: this.title,
            altText: this.altText,
        };
    }
}
