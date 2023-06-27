import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { TShippingInfo } from './types';
import { Alert, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, Snackbar, Tooltip } from '@mui/material';

const steps = ['Endereço', 'Pagamento', 'Revisão do pedido'];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export type TAddress = {
  cep: string;
  street: string;
  number: number;
  district: string;
  complement?: string;
  city: string;
  state: string;
}

const RadioLabel = ({
  service,
  expectedDays,
  shippingCost
}: TShippingInfo) => {
  return (
    <div>
      <Typography variant='subtitle1'>
        {service}
      </Typography>
      <Typography variant='subtitle2'>
        {`R$ ${shippingCost}`} - {`${expectedDays} dias úteis`}
      </Typography>
    </div>
  )
}

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState<TAddress>({
    cep: '13100-183',
    street: 'Viela',
    number: 33,
    district: 'Núcleo Residencial Paranapanema',
    city: 'Campinas',
    state: 'SP'
  } as TAddress)
  const [shippingInfo, setShippingInfo] = React.useState<TShippingInfo | null>(null);
  const [showFreightModal, setShowFreightModal] = React.useState<boolean>(false);
  const [freightType, setFreightType] = React.useState<'sedex' | 'pac' | null>(null);
  const [trackingCode, setTrackingCode] = React.useState<string>('');
  const [orderId, setOrderId] = React.useState<string>('');
  const [openSuccessModal, setOpenSuccessModal] = React.useState<boolean>(false);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleGetShipping = async () => {
    const { cep, city, district, number, state, street, complement } = formData;

    const url = `
      http://localhost:3000/order/details?cep=${cep}&city=${city}&district=${district}&number=${number}&state=${state}&street=${street}&complement=${complement}
    `

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await res.json();

    setShippingInfo(data);
    setShowFreightModal(true);
  }

  const handleFinishOrder = async () => {
    const data = {
      customer: "bruno@gmail.com",
      items: [
        {
          id: 1,
          name: "Notebook",
          quantity: 1,
          unitPrice: 3090.99
        }
      ],
      totalPrice: 3090.99,
      address: {
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        district: formData.district,
        city: formData.city,
        complement: formData.complement
      }
    };

    const response = await fetch('http://localhost:3000/order/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const res = await response.json();

    setOrderId(res.id);
    setTrackingCode(res.trackingCode);
    setActiveStep(activeStep + 1);
  }

  const handleCancelOrder = async () => {
    const response = await fetch(`http://localhost:3000/order/cancel?orderId=${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 204){
      setOpenSuccessModal(true);
    } else {
      console.log('error');
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AddressForm formData={formData} setFormData={setFormData} />;
      case 1:
        return <PaymentForm />;
      case 2:
        return <Review shippingCost={shippingInfo?.shippingCost} formData={formData} />;
      default:
        throw new Error('Unknown step');
    }
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            EDI
          </Typography>
        </Toolbar>
      </AppBar>
      <Snackbar 
        open={openSuccessModal}
        autoHideDuration={2000}
        onClose={() => setOpenSuccessModal(false)}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert severity='success' onClose={() => setOpenSuccessModal(false)} sx={{ width: '100%' }}>
          Pedido cancelado com sucesso!
        </Alert>
      </Snackbar>
      {
        showFreightModal && (
          <Modal
            open={showFreightModal}
            onClose={() => setShowFreightModal(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper variant='elevation' sx={{ p: { xs: 2, md: 6 }, borderRadius: { sx: 2, md: 5 } }} >
              <FormControl>
                <FormLabel sx={{ mb: 3 }}>Selecione o tipo de frete</FormLabel>
                <RadioGroup value={freightType}>
                  <FormControlLabel
                    value='sedex'
                    control={<Radio />}
                    sx={{ mb: 2 }}
                    onChange={() => setFreightType('sedex')}
                    label={<RadioLabel service='SEDEX' expectedDays={5} shippingCost={10} />}
                  />
                  <FormControlLabel
                    value='pac'
                    control={<Radio />}
                    onChange={() => setFreightType('pac')}
                    label={<RadioLabel service='PAC' expectedDays={5} shippingCost={15} />}
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          </Modal>
        )
      }
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Obrigado pela sua compra.
              </Typography>
              <Typography variant="subtitle1">
                Seu código de rastreio é <strong>{trackingCode}</strong>. Você pode acompanhar o status do seu pedido na página de rastreio.
                Caso queira cancelar o pedido, clique no botão abaixo.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant='contained' color='error'  onClick={() => handleCancelOrder()} sx={{ mt: 3, ml: 0 }}>
                  Cancelar
                </Button>
              </Box>
            </React.Fragment>

          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {
                  activeStep === 0 ? (
                    <div style={{ display: 'flex' }}>
                      <Button variant='outlined' sx={{ mt: 3, ml: 1 }} onClick={() => handleGetShipping()}>
                        Calcular Frete
                      </Button>
                    </div>
                  ) : (<></>)
                }
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Voltar
                  </Button>
                )}
                <Tooltip title={activeStep === 0 ? 'Selecione um tipo de frete' : ''}>
                  <span>
                    <Button
                      variant="contained"
                      onClick={activeStep !== steps.length - 1 ? handleNext : handleFinishOrder}
                      sx={{ mt: 3, ml: 1 }}
                      disabled={!freightType}
                    >
                      {activeStep === steps.length - 1 ? 'Comprar' : 'Próximo'}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}