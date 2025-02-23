import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi{
    getProductsList() : Promise<ApiListResponse<ProductItem>>,
    getProduct(productId: string) : Promise<ProductItem>,
    sendOrder(order: Order) : Promise<SuccessOrder>,
}

export class LarekApi implements ILarekApi{
    private _client: Api
    constructor(baseUrl: string){
        this._client = new Api(baseUrl)
    }

    getProductsList() : Promise<ApiListResponse<ProductItem>>{
        return this._client.get("/product/") as Promise<ApiListResponse<ProductItem>>
    }

    getProduct(productId: string) : Promise<ProductItem>{
        return this._client.get(`/product/${productId}`) as Promise<ProductItem>;
    }

    sendOrder(order: Order) : Promise<SuccessOrder> {
        return this._client.post("/order", order) as Promise<SuccessOrder> 
    }

}