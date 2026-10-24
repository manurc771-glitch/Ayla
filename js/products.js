/*
  Catálogo AYLA. Precios en pesos colombianos (COP).
  Cada variante apunta a una imagen en assets/products/ (PNG sin fondo, lienzo 4:5).
  `alt` (opcional): segunda imagen que aparece al pasar el mouse.
*/
window.AYLA_PRODUCTS = [
  /* New Merch */
  { id: 'zero-zip',          name: 'Zero Zip',          price: 490000, tags: ['new', 'men'],   variants: [{ color: 'black',    img: 'zero-zip.png' }] },
  { id: 'raw-tee',           name: 'Raw Tee',           price: 160000, tags: ['new', 'men'],   variants: [{ color: 'black',    img: 'raw-tee.png' }] },
  { id: 'initial-sweatpant', name: 'Initial Sweatpant', price: 500000, tags: ['new', 'men'],   variants: [{ color: 'olive',    img: 'initial-sweatpant.png' }] },
  { id: 'block-jacket',      name: 'Block Jacket',      price: 740000, tags: ['new', 'men'],   variants: [{ color: 'ivory',    img: 'block-jacket.png' }] },
  { id: 'core-hoodie',       name: 'Core Hoodie',       price: 380000, tags: ['new', 'men'],   variants: [{ color: 'charcoal', img: 'core-hoodie.png' }] },
  { id: 'rider-jacket',      name: 'Rider Jacket',      price: 700000, tags: ['new', 'men'],   variants: [{ color: 'sand',     img: 'rider-jacket.png' }] },
  { id: 'sky-crop-hoodie',   name: 'Sky Crop Hoodie',   price: 390000, tags: ['new', 'women'], variants: [{ color: 'sky',      img: 'sky-crop-hoodie.png' }] },
  { id: 'camo-parka',        name: 'Camo Parka',        price: 570000, tags: ['new', 'women'], variants: [{ color: 'camo',     img: 'camo-parka.png' }] },
  /* Men */
  { id: 'flame-shell',       name: 'Flame Shell',       price: 530000, tags: ['men'],          variants: [{ color: 'orange',   img: 'flame-shell.png' }] },
  { id: 'leather-jacket',    name: 'Leather Jacket',    price: 930000, tags: ['men'],          variants: [{ color: 'black',    img: 'leather-jacket.png', alt: 'leather-jacket-2.png' }] },
  { id: 'wind-jacket',       name: 'Wind Jacket',       price: 460000, tags: ['men'],          variants: [{ color: 'charcoal', img: 'wind-jacket.png' }] },
  { id: 'timber-zip',        name: 'Timber Zip',        price: 490000, tags: ['men'],          variants: [{ color: 'camo',     img: 'timber-zip.png' }] },
  { id: 'night-hoodie',      name: 'Night Hoodie',      price: 360000, tags: ['men'],          variants: [{ color: 'forest',   img: 'night-hoodie.png' }] },
  { id: 'pine-hoodie',       name: 'Pine Hoodie',       price: 380000, tags: ['men'],          variants: [{ color: 'green',    img: 'pine-hoodie.png' }] },
  { id: 'serpent-hoodie',    name: 'Serpent Hoodie',    price: 430000, tags: ['men'],          variants: [{ color: 'charcoal', img: 'serpent-hoodie.png' }] },
  { id: 'dragon-tee',        name: 'Dragon Tee',        price: 200000, tags: ['men'],          variants: [{ color: 'black',    img: 'dragon-tee.png' }] },
  { id: 'decide-tee',        name: 'Decide Tee',        price: 180000, tags: ['men'],          variants: [{ color: 'black',    img: 'decide-tee.png' }] },
  { id: 'script-tee',        name: 'Script Tee',        price: 190000, tags: ['men'],          variants: [{ color: 'black',    img: 'script-tee.png' }] },
  { id: 'wave-tee',          name: 'Wave Tee',          price: 180000, tags: ['men'],          variants: [{ color: 'black',    img: 'wave-tee.png' }] },
  { id: 'plain-tee',         name: 'Plain Tee',         price: 150000, tags: ['men'],          variants: [{ color: 'black',    img: 'plain-tee.png' }] },
  { id: 'quiet-tee',         name: 'Quiet Tee',         price: 160000, tags: ['men'],          variants: [{ color: 'black',    img: 'quiet-tee.png' }] },
  { id: 'wide-denim',        name: 'Wide Denim',        price: 350000, tags: ['men'],          variants: [{ color: 'black',    img: 'wide-denim.png' }] },
  { id: 'tribal-denim',      name: 'Tribal Denim',      price: 390000, tags: ['men'],          variants: [{ color: 'black',    img: 'tribal-denim.png' }] },
  { id: 'sand-denim',        name: 'Sand Denim',        price: 400000, tags: ['men'],          variants: [{ color: 'sand',     img: 'sand-denim.png' }] },
  { id: 'grey-utility',      name: 'Grey Utility',      price: 340000, tags: ['men'],          variants: [{ color: 'grey',     img: 'grey-utility.png' }] },
  /* Women */
  { id: 'teal-puffer',       name: 'Teal Puffer',       price: 610000, tags: ['women'],        variants: [{ color: 'teal',     img: 'teal-puffer.png' }] },
  { id: 'ash-hoodie',        name: 'Ash Hoodie',        price: 360000, tags: ['women'],        variants: [{ color: 'grey',     img: 'ash-hoodie.png' }] },
  { id: 'ash-tee',           name: 'Ash Tee',           price: 180000, tags: ['women'],        variants: [{ color: 'grey',     img: 'ash-tee.png' }] },
  { id: 'cocoa-tee',         name: 'Cocoa Tee',         price: 150000, tags: ['women'],        variants: [{ color: 'brown',    img: 'cocoa-tee.png' }] },
  { id: 'cloud-tee',         name: 'Cloud Tee',         price: 160000, tags: ['women'],        variants: [{ color: 'white',    img: 'cloud-tee.png' }] },
  { id: 'signal-tee',        name: 'Signal Tee',        price: 150000, tags: ['women'],        variants: [{ color: 'red',      img: 'signal-tee.png' }] },
  { id: 'parachute-pant',    name: 'Parachute Pant',    price: 350000, tags: ['women'],        variants: [{ color: 'cream',    img: 'parachute-pant.png' }] }
];

window.AYLA_COLORS = {
  black: '#111111', white: '#f2f2f2', charcoal: '#3b3b3d', olive: '#5b5e40', forest: '#1f3a2f', sky: '#9db7d3', sage: '#9aa58a',
  navy: '#1e2a4a', denim: '#6f94c6', camo: '#6b6a45', ivory: '#efe9dc', green: '#2f5e3a', red: '#d4163c', cream: '#e8dcbc',
  grey: '#9a9a9c', sand: '#cdb88f', brown: '#5a2e24', teal: '#2f5a66', orange: '#f2784b'
};

window.AYLA_COLOR_NAMES = {
  black: 'Negro', white: 'Blanco', charcoal: 'Carbón', olive: 'Oliva', forest: 'Verde bosque', sky: 'Celeste', sage: 'Salvia',
  navy: 'Azul marino', denim: 'Denim', camo: 'Camuflado', ivory: 'Marfil', green: 'Verde', red: 'Rojo', cream: 'Crema',
  grey: 'Gris', sand: 'Arena', brown: 'Café', teal: 'Verde azulado', orange: 'Naranja'
};

window.AYLA_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
window.AYLA_DISCOUNT = { code: 'AYLA10', rate: 0.10 };

/* HOODIES / SWEATPANTS / T-SHIRTS / JACKETS — imagen en assets/categories/ */
window.AYLA_CATEGORIES = [
  { label: 'Buzos',    img: 'hoodies.jpg',    product: 'core-hoodie' },
  { label: 'Pantalones', img: 'sweatpants.jpg', product: 'initial-sweatpant' },
  { label: 'Camisetas',   img: 'tshirts.jpg',    product: 'raw-tee' },
  { label: 'Chaquetas',    img: 'jackets.jpg',    product: 'block-jacket' }
];
