export interface Budget {
    id?: string;
    categoryID?: string;
    categoryName: string;
    month: string;
    amount: number;
    userID?: string;
} //Ids set to optional, will worry later