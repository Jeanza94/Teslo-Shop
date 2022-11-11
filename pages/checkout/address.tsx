import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { countries, jwt } from '../../utils';
import { useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { CartContext } from '../../context';

type FormData = {
    firstName: string,
    lastName: string,
    address: string,
    address2?: string,
    zip: string,
    city: string,
    country: string,
    phone: string,

}

const getAddressFromCookie = (): FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
    }
}

const AddressPage = () => {

    const router = useRouter();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: countries[0].code,
            phone: '',
        }
    });
    const { updateAddress } = useContext(CartContext);

    const onSubmit = (data: FormData) => {

        updateAddress(data);
        router.push('/checkout/summary');

    }

    useEffect(() => {
        reset(getAddressFromCookie());
    }, [reset])



    return (
        <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Typography variant='h1' component='h1'>Dirección</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant='filled'
                            fullWidth
                            {...register('firstName', {
                                required: 'Este campo es obligatorio'
                            })}
                            error={errors.firstName ? true : false}
                            helperText={errors.firstName && errors.firstName.message}


                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellido'
                            variant='filled'
                            fullWidth
                            {...register('lastName', {
                                required: 'Este campo es obligatorio'
                            })}
                            error={errors.lastName ? true : false}
                            helperText={errors.lastName && errors.lastName.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección'
                            variant='filled'
                            fullWidth
                            {...register('address', {
                                required: 'Este campo es obligatorio'
                            })}
                            error={errors.address ? true : false}
                            helperText={errors.address && errors.address.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección 2 (opcional)'
                            variant='filled'
                            fullWidth
                            {...register('address2')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Codigo Postal'
                            variant='filled'
                            fullWidth
                            {...register('zip', {
                                required: 'Este campo es obligatorio'
                            })}
                            error={errors.zip ? true : false}
                            helperText={errors.zip && errors.zip.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant='filled'
                            fullWidth
                            {...register('city', {
                                required: 'Este campo es obligatorio'
                            })}
                            error={errors.city ? true : false}
                            helperText={errors.city && errors.city.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* <FormControl fullWidth> */}
                        <TextField
                            // select
                            variant='filled'
                            label='pais'
                            fullWidth
                            // defaultValue={Cookies.get('country') || countries[0].code}
                            {...register('country', {
                                required: 'Este campo es obligatorio'
                            })}
                            error={errors.country ? true : false}
                            helperText={errors.country?.message}

                        />
                        {/* {
                                    countries.map(country => (
                                        <MenuItem
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))
                                } */}


                        {/* </FormControl> */}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Telefono'
                            variant='filled'
                            fullWidth
                            {...register('phone', {
                                required: 'Este campo es obligatorio'
                            })}
                            error={errors.phone ? true : false}
                            helperText={errors.phone && errors.phone.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center' >
                    <Button
                        color='secondary'
                        className='circular-btn'
                        size='large'
                        type='submit'
                    >
                        Revisar Pedido
                    </Button>
                </Box>
            </form>

        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


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
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }

export default AddressPage