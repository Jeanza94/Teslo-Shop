import { FC } from "react";
import { Box, Grid, Button } from '@mui/material';

import { ISize } from "../../interfaces";


interface Props {
    selectedSize?: ISize;
    sizes: ISize[];
    onSelectSize: (size: ISize) => void
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectSize }) => {
    return (
        <Grid>
            {
                sizes.map(size => (
                    <Button
                        key={size}
                        size='small'
                        color={selectedSize === size ? 'primary' : 'info'}
                        onClick={() => onSelectSize(size)}
                    >
                        {size}
                    </Button>
                ))
            }
        </Grid>
    )
}
