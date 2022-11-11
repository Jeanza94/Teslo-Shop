import Link from "next/link";
import { Grid, Typography, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import { ItemCounter } from "../ui";
import { FC, useContext } from "react";
import { CartContext } from "../../context";
import { ICartProduct, IOrderItem } from "../../interfaces";

interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart, updateCartQuantity, removeProductCart } = useContext(CartContext)

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product);
    }

    const productsToShow = products ? products : cart;

    return (
        <>
            {
                productsToShow.map(product => (
                    <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            {/* todo llevar a la pagina del producto */}
                            <Link href={`/product/${product.slug}`}>
                                <CardActionArea>
                                    <CardMedia
                                        image={product.image}
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </Grid>

                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{product.title}</Typography>
                                <Typography variant='body1'>Talla <strong>{product.size}</strong></Typography>


                                {
                                    editable
                                        ? (
                                            <ItemCounter
                                                currentValue={product.quantity}
                                                maxValue={10}
                                                onUpdatedQuantity={(value) => onNewCartQuantityValue(product as ICartProduct, value)} />
                                        )
                                        : <Typography variant='h5'>{product.quantity} producto{product.quantity > 1 ? 's' : ''}</Typography>
                                }

                            </Box>
                        </Grid>

                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'>${product.price}</Typography>

                            {
                                editable && (
                                    <Button
                                        variant='text'
                                        color='secondary'
                                        onClick={() => removeProductCart(product as ICartProduct)}
                                    >
                                        Remover
                                    </Button>
                                )

                            }

                        </Grid>


                    </Grid>
                ))
            }
        </>
    )
}
