import * as Validator from 'class-validator';

export class BookSearchDto {
    @Validator.IsOptional()
    @Validator.IsString()
    @Validator.Length(1,128)
    keywords: string;

    @Validator.IsOptional()
    @Validator.IsPositive()
    categoryId: number;

    @Validator.IsOptional()
    @Validator.IsIn(['title' , 'author' , 'category'])
    orderBy: 'title' | 'author' | 'category';

    @Validator.IsOptional()
    @Validator.IsIn(['ASC' , 'DESC'])
    orderDirection: 'ASC' | 'DESC';

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    @Validator.IsPositive()
    page:number;

    @Validator.IsPositive()
    @Validator.IsOptional()
    @Validator.IsIn([5 , 10 , 15 , 20])
    itemsPerPage: 5 | 10 | 15 | 20;
}