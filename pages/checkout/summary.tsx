import { ShopLayout } from "../../components/layouts"
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary } from "../../components/cart";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { countries, jwt } from "../../utils";
import { useContext, useMemo, useEffect, useState } from 'react';
import { CartContext } from "../../context";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';

const SummaryPage = () => {

    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
    const router = useRouter();
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



    useEffect(() => {

        if (!Cookies.get('firstName')) {
            router.push('/checkout/address');
        }

    }, [router]);

    const onCreateOrder = async () => {
        setIsPosting(true);

        const { hasError, message } = await createOrder();

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return
        }

        router.replace(`/orders/${message}`);
    }

    if (!shippingAddress) {
        return <></>
    }

    return (
        <ShopLayout title='Resumen de compra' pageDescription='Resumen de la orden'>
            <>
                <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

                <Grid container>
                    <Grid item xs={12} sm={7}>
                        <CartList />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <Card className='summary-card'>
                            <CardContent>
                                <Typography variant='h2' >Resumen {numberOfItems} {numberOfItems > 1 ? 'Productos' : 'Producto'}</Typography>
                                <Divider sx={{ my: 1 }} />

                                <Box display='flex' justifyContent='space-between'>
                                    <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                    <Link href='/checkout/address' >
                                        Editar
                                    </Link>
                                </Box>

                                <Typography><strong>Nombre:</strong> {shippingAddress?.firstName}</Typography>
                                <Typography><strong>Dirección:</strong> {shippingAddress?.address}</Typography>
                                <Typography><strong>Ciudad:</strong> {shippingAddress?.city} {shippingAddress?.zip}</Typography>
                                <Typography><strong>País: </strong>{shippingAddress?.country}</Typography>
                                <Typography><strong>Teléfono:</strong> {shippingAddress?.phone}</Typography>

                                <Divider sx={{ my: 1 }} />

                                <Box display='flex' justifyContent='end'>
                                    <Link href='/checkout/cart' >
                                        Editar
                                    </Link>
                                </Box>

                                <OrderSummary />

                                <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                    <Button
                                        color='secondary'
                                        className='circular-btn'
                                        fullWidth
                                        onClick={onCreateOrder}
                                        disabled={isPosting}
                                    >
                                        Confirmar Orden
                                    </Button>

                                    <Chip
                                        color='error'
                                        label={errorMessage}
                                        sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                                    />
                                </Box>
                            </CardContent>

                        </Card>
                    </Grid>
                </Grid>
            </>

        </ShopLayout>
    )
}

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

//     const { token = '' } = req.cookies;
//     let userId = '';
//     let isValidToken = false;

//     try {
//         await jwt.isValidToken(token);
//         isValidToken = true;

//     } catch (error) {
//         isValidToken = false
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/summary',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }

export default SummaryPage