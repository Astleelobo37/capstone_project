import { CardContent, CardActions } from "@mui/material";
import { CardMedia } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import { Grid } from "@mui/material";
import { useMasks } from "../contexts/MaskContext";

export function MaskGrid({ masks, manufacturer, filterfunction, handleAddToCart }) {
  const filteredmasks = filterfunction ? filterfunction(masks) : masks;
  const {setManufacturer} = useMasks();
  setManufacturer(manufacturer);
  
  return (
    <Grid container spacing={3}>
      {filteredmasks?.map((mask) => (
        <Grid item key={mask.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardMedia
              component="img"
              height="200"
              image={mask.imageUrl}
              alt={mask.maskType}
              sx={{ objectFit: "contain", p: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {mask.maskType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mask.description}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                ${mask.price}
              </Typography>
              <Typography
                variant="body2"
                color={mask.stock > 0 ? "success.main" : "error.main"}
              >
                {mask.stock > 0 ? `${mask.stock} in stock` : "Out of stock"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => handleAddToCart(mask)}
                disabled={mask.stock <= 0}
              >
                Add to Cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
