import { ShopLayout } from "../../components/layouts";
import { Box, Typography } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import Link from "next/link";





const EmptyPage = () => {
    return (
        <ShopLayout title='Carrito vacio' pageDescription='No hay nada en el carrito'>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 200px)'
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
            >
                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />

                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography>Su carrito esta vacio</Typography>
                    <Link href='/' className="link">
                        <Typography variant='h4' component='h4' color='secondary' >Regresar</Typography>
                    </Link>
                </Box>
            </Box>
        </ShopLayout>
    )
}

export default EmptyPage