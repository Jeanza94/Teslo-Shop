

import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';


type Data =
    | { message: string }
    | { product: IProduct }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);

        default:
            return res.status(400).json({ message: 'bad request' })
    }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse) => {

    const { slug } = req.query;

    try {
        db.connect();
        const product = await Product.findOne({ slug }).select('title images slug inStock price -_id').lean();
        db.disconnect();

        if (!product) {
            return res.status(404).json({ message: 'El producto no fue encontrado' })
        }

        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'No se realizo con exito' })
    }


}