import { useContext } from 'react';
import NextLink from 'next/link';

import { UiContext } from '../../context';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';



export const AdminNavBar = () => {

    const { toggleSideMenu } = useContext(UiContext)


    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' className='link link-material' >
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </NextLink>

                <Box flex={1} />

                <Button onClick={toggleSideMenu}>
                    Menú
                </Button>
            </Toolbar>
        </AppBar>
    )
}