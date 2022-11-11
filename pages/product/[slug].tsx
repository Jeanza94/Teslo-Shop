
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { ShopLayout } from "../../components/layouts"
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { dbProducts } from "../../database";
import { CartContext } from '../../context';



interface Props {
    product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {

    const router = useRouter();
    const { addProductAtCart } = useContext(CartContext);

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        inStock: product.inStock,
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
    })

    const onSelectSize = (size: ISize) => {
        setTempCartProduct({
            ...tempCartProduct,
            size
        })
    }

    const onUpdatedQuantity = (count: number) => {
        setTempCartProduct({
            ...tempCartProduct,
            quantity: count
        })
    }


    const onAddProduct = () => {

        addProductAtCart(tempCartProduct);
        router.push('/cart');

    }



    return (
        <ShopLayout title={product.title} pageDescription={product.description}>

            <Grid container spacing={3}>

                <Grid item xs={12} sm={7}>
                    <ProductSlideShow
                        images={product.images}
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display='flex' flexDirection='column'>
                        {/* titulos */}
                        <Typography variant='h1' component='h1'>{product.title}</Typography>
                        <Typography variant='subtitle1' component='h2'>${product.price}</Typography>

                        {/* cantidad */}
                        <Box sx={{ my: 2 }}>
                            <Typography variant='subtitle2'>Cantidad</Typography>
                            <ItemCounter
                                currentValue={tempCartProduct.quantity}
                                maxValue={tempCartProduct.inStock}
                                onUpdatedQuantity={onUpdatedQuantity}
                            />
                            <SizeSelector
                                selectedSize={tempCartProduct.size}
                                sizes={product.sizes}
                                onSelectSize={onSelectSize}
                            />
                        </Box>

                        {/* agregar al carrito */}

                        {
                            product.inStock === 0
                                ? <Chip label='No hay disponibles' color='error' variant='outlined' />
                                : (
                                    <Button
                                        color='secondary' className='circular-btn'
                                        disabled={!tempCartProduct.size}
                                        onClick={onAddProduct}
                                    >
                                        {
                                            tempCartProduct.size
                                                ? 'Agregar al carrito'
                                                : 'Seleccione una talla'
                                        }

                                    </Button>
                                )
                        }

                        {/* descripcion */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant='subtitle2' >Descripción</Typography>
                            <Typography variant='body2' >{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// para generarlo por server side rendering
// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//     const { slug } = ctx.params as { slug: string };

//     const product = await dbProducts.getProductBySlug(slug)

//     if (!product) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {
//             product
//         }
//     }
// }


// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const slugs = await dbProducts.getAllProductSlugs();

    return {
        paths: slugs.map(({ slug }) => ({
            params: { slug }
        })),
        fallback: "blocking"
    }
}


export const getStaticProps: GetStaticProps = async (ctx) => {

    const { slug = '' } = ctx.params as { slug: string };

    const product = await dbProducts.getProductBySlug(slug);

    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24
    }
}

export default ProductPage