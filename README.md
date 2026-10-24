# AYLA

Tienda de ropa estática (HTML + CSS + JavaScript, sin dependencias ni build).

## Estructura

```
index.html
css/styles.css
js/products.js   # catálogo (precios COP, variantes/imágenes), colores, tallas, código de descuento
js/app.js        # sliders, carrito, buscador, checkout
js/effects.js    # animaciones y efectos
assets/
  products/      # PNG sin fondo (lienzo 4:5) de cada prenda
  hero/          # imagen principal
  categories/    # fotos de modelo: buzos, pantalones, camisetas, chaquetas
  lookbook/  banner/
```

Para cambiar una foto: reemplaza el archivo de `assets/` y, si es un producto nuevo, agrégalo en `js/products.js`.

## Funciones

- Sliders: Nueva Merch y General, con selector de color. Precios en COP.
- Ficha de producto con color, talla y cantidad.
- Carrito persistente (localStorage) con código `AYLA10` (-10%).
- Buscador y menú móvil.
- Efectos: intro, hero con parallax, cursor personalizado, inclinación 3D de tarjetas, sliders arrastrables, revelado al hacer scroll y animación al agregar al carrito. Se desactivan si el sistema pide reducir movimiento (`index.html?motion=1` los fuerza).
- Checkout con validación; al pagar muestra que la pasarela aún no está conectada.

## Uso

Abrir `index.html` o servir la carpeta (`npx serve .`). Compatible con GitHub Pages.

## Pendiente

- Pasarela de pago, cuentas de cliente y correo de contacto (`hello@ayla.store` es un valor de ejemplo en `js/app.js`).
