import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function AddressForm({
  formData,
  setFormData
}: {formData: any, setFormData: any}) {

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Endereço de entrega
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="rua"
            name="rua"
            label="Rua"
            fullWidth
            value={formData.street}
            variant="standard"
            onChange={(e) => setFormData({...formData, street: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="number"
            name="number"
            label="Número"
            value={formData.number}
            fullWidth
            variant="standard"
            onChange={(e) => setFormData({...formData, number: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="bairro"
            name="bairro"
            value={formData.district}
            label="Bairro"
            fullWidth
            variant="standard"
            onChange={(e) => setFormData({...formData, district: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="complement"
            name="complement"
            value={formData.complement}
            label="Complemento"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
            onChange={(e) => setFormData({...formData, complement: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="cidade"
            label="Cidade"
            value={formData.city}
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="estado"
            label="Estado"
            value={formData.state}
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="cep"
            label="CEP"
            value={formData.cep}
            fullWidth
            variant="standard"
            onChange={(e) => setFormData({...formData, cep: e.target.value})}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}