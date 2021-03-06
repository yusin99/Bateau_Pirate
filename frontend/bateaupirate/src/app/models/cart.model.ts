import { ProductModelServer } from './product.model';

export interface CartModelServer {
  total: number;
  data: [
    {
      product: any;
      numInCart: number;
    }
  ];
}

export interface CartModelPublic {
  total: number;
  prodData: [
    {
      nomVinyl: string;
      photo: string;
      id: number;
      incart: number;
    }
  ];
}
