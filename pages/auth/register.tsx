import { useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import Link from "next/link"
import { getSession, signIn } from 'next-auth/react';
import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts"
import { AuthContext } from "../../context";
import { validations } from "../../utils";


type FormData = {
    name: string;
    email: string;
    password: string;
}


const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const onRegisterForm = async ({ name, email, password }: FormData) => {

        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password);

        if (hasError) {
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(() => { setShowError(false) }, 3000)
            return;
        }
        // const destination = router.query?.p?.toString() || '/';
        // router.replace(destination)
        await signIn('credentials', { email, password })
    }

    return (
        <AuthLayout title='Registrar'>

            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px', mt: 12 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Crear Cuenta</Typography>
                        </Grid>

                        <Chip
                            label={errorMessage}
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                            sx={{ display: showError ? 'flex' : 'none' }}
                        />


                        <Grid item xs={12}>
                            <TextField
                                label='Nombre'
                                variant='filled'
                                fullWidth
                                {...register('name', {
                                    required: 'Este campo es obligatorio',
                                    minLength: { value: 2, message: 'Minimo 2 caracteres' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                label='Correo'
                                variant='filled'
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es obligatorio',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Contraseña'
                                type='password'
                                variant='filled'
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es obligatorio',
                                    minLength: { value: 6, message: 'Minimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth
                                type='submit'
                                disabled={showError}
                            >
                                Registrar
                            </Button>
                        </Grid>



                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link href={`/auth/login${router.query?.p ? `?p=${router.query.p}` : ''}`}>
                                Ya tengo cuenta
                            </Link>
                        </Grid>


                    </Grid>
                </Box>

            </form>

        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });

    const { p = '/' } = query;

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}

export default RegisterPage