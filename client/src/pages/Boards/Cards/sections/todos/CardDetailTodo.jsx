/* eslint-disable indent */

/* MUI components */
import { Box, Grid } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/* API endpoint */

import CardTodoList from './TodoList';

export default function CardDetailTodo({ cardDetail, setCardDetail }) {
  return (
    <Box>
      {cardDetail?.todos && cardDetail?.todos.length
        ? cardDetail?.todos.map((todo, id) => (
            <Grid key={id} container spacing={2} sx={{ px: 3, pt: 3 }}>
              <Grid item xs={1}>
                <CheckCircleOutlineIcon />
              </Grid>
              <Grid
                item
                xs={7}
                sx={{
                  mb: 4,
                }}
              >
                <CardTodoList
                  todo={todo}
                  cardDetail={cardDetail}
                  setCardDetail={setCardDetail}
                />
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          ))
        : ''}
    </Box>
  );
}
