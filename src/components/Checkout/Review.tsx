import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { TAddress } from './Checkout';


const PRODUCT_PRICE = 3090.99;

export default function Review({
  shippingCost = 0,
  formData
}: { shippingCost?: number, formData: TAddress }) {
  const products = [
    {
      name: 'Notebook',
      desc: 'Notebook dell',
      price: `R$${PRODUCT_PRICE}`,
    },
    { name: 'Frete', desc: '', price: `R$${shippingCost}` },
  ];

  const addresses = [formData.street, formData.city, formData.district, formData.number, formData.cep];
  
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Resumo
      </Typography>
      <List disablePadding>
        {products.map((product) => (
          <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
            {
              product.name !== 'Frete' && (
                <img src={"src/assets/images/notebook.jpeg"} style={{ width: 80, marginRight: 10 }} />
              )
            }
            <ListItemText primary={product.name} secondary={product.desc} />
            <Typography variant="body2">{product.price}</Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            R${(shippingCost + PRODUCT_PRICE).toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={10}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Entrega
          </Typography>
          <Typography gutterBottom>Bruno</Typography>
          <Typography gutterBottom>{addresses.join(', ')}</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}