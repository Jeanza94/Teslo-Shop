import { FC, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { CartContext } from '../../context';
import { currency } from '../../utils';
import { IOrder } from '../../interfaces';


interface Props {
    product?: IOrder
}

export const OrderSummary: FC<Props> = ({ product }) => {

    const { numberOfItems, subTotal, taxRate, total } = useContext(CartContext)

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{product ? product.numberOfItems : numberOfItems} {
                    product
                        ? product.numberOfItems > 1
                            ? 'Productos'
                            : 'Producto'
                        : numberOfItems > 1
                            ? 'productos'
                            : 'producto'
                }
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{product ? currency.format(product.subTotal) : currency.format(subTotal)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{product ? currency.format(product.taxRate) : currency.format(taxRate)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>{product ? currency.format(product.total) : currency.format(total)}</Typography>
            </Grid>
        </Grid>
    )
}
