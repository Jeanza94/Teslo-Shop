

import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
    | { message: string }
    | IProduct[]
    | IProduct


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProduct(req, res);

        case 'POST':
            return createProduct(req, res)

        default:
            return res.status(400).json({
                message: 'bad request'
            })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {

    const { gender = 'all' } = req.query;

    let condition = {};


    if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
        condition = { gender }
    }


    db.connect();
    const products = await Product.find(condition).select('title images price inStock slug -_id').lean();
    db.disconnect();

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })
        return product;
    })
    return res.status(200).json(updatedProducts)

}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body as IProduct;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El id del producto no es valido' });
    }

    if (images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos dos imagenes' });
    }

    //todo posiblemente tendremos un localhost:3000/products/asdada.jpg

    try {
        await db.connect();

        const product = await Product.findById(_id);

        if (!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'No esxiste un producto con ese id' });
        }

        //todo eliminar fotos en cloudinary
        product.images.forEach(async (image) => {
            if (!images.includes(image)) {
                //borrar de cloudinary
                //url = https://cloudimary/uedm/adasdad/asdad/id12345123.jpg
                //lastIndexOf busca el ultimo indice de la condicion en este caso el /. y se le suma 1 para que borre el slash. luego lo vuelve un array con el split que se separe por  el punto
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.')
                await cloudinary.uploader.destroy(fileId);
            }
        })

        await product.update(req.body);
        await db.disconnect();
        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}
const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {
        return res.status(400).json({ message: 'El Producto necesita la menos dos imagenes' })
    }

    //todo posiblemente tendremos un localhost:3000/products/asdada.jpg

    try {
        await db.connect();
        const productInDb = await Product.findOne({ slug: req.body.slug })
        if (productInDb) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' })

        }
        const product = new Product(req.body);
        await product.save();
        await db.disconnect();


        return res.status(201).json(product)
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(400).json({ message: 'Revisar logs del servidor' })
    }
}

