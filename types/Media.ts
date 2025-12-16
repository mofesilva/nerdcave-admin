export interface Media {
    _id: string;
    fileName: string;   // Só o nome - SDK resolve URL
    title: string;
    altText?: string;
}
