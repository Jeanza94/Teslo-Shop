import { FC, useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'

interface Props {
    currentValue: number;
    maxValue: number;
    onUpdatedQuantity: (count: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, onUpdatedQuantity }) => {

    const [count, setCount] = useState(currentValue);

    useEffect(() => {
        if (count) {

            onUpdatedQuantity(count);
        }
    }, [count])


    const onIncrement = () => {
        if (count === maxValue) return;
        setCount(prev => prev + 1);
    }

    const onDecrement = () => {

        if (count === 1) return;
        setCount(prev => prev - 1);
    }



    return (
        <Box display='flex' alignItems='center'>
            <IconButton onClick={onDecrement} disabled={count === 1} >
                <RemoveCircleOutline />
            </IconButton>

            <Typography sx={{ width: 40, textAlign: 'center' }}>{count}</Typography>

            <IconButton onClick={onIncrement} disabled={count === maxValue}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
