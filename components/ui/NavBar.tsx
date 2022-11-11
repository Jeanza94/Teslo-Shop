import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { CartContext, UiContext } from '../../context';
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';



export const NavBar = () => {

    const { toggleSideMenu } = useContext(UiContext)
    const { numberOfItems } = useContext(CartContext)
    const { asPath, push } = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);



    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;

        push(`/search/${searchTerm}`);
    }

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' className='link link-material' >
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </NextLink>

                <Box flex={1} />

                <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className='none'>
                    <NextLink href='/category/men' className='link'  >
                        <Button color={asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
                    </NextLink>

                    <NextLink href='/category/women' className='link'  >
                        <Button color={asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
                    </NextLink>

                    <NextLink href='/category/kid' className='link'  >
                        <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
                    </NextLink>
                </Box>


                <Box flex={1} />


                {/* Pantallas grandes */}

                {
                    isSearchVisible
                        ? (
                            <Input
                                className='fadeIn'
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                autoFocus
                                type='text'
                                placeholder="Buscar..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setIsSearchVisible(false)}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                className='fadeIn'
                                onClick={() => setIsSearchVisible(true)}
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }



                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href='/cart' className='link'  >
                    <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary'>
                        <IconButton>
                            <ShoppingCartOutlined />
                        </IconButton>
                    </Badge>
                </NextLink>

                <Button onClick={toggleSideMenu}>
                    Menú
                </Button>
            </Toolbar>
        </AppBar>
    )
}
