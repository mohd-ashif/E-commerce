import express from 'express';
import Product from '../model/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth } from '../utils.js';
import multer from 'multer';
import path from 'path'; 

const app = express();  
const productRouter = express.Router(); 

productRouter.use('/uploads', express.static('uploads'));


// Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => { 
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  },
});
             
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6, // 6 MB limit
  },
});
    

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

//get product:id
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});



productRouter.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    const product = await Product.find({ name: { $regex: search, $options: "i" } });

    res.status(200).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


// Admin products
productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
  
    const products = await Product.find()
    
    res.send(products);
  })
);

//review
productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({ message: "product deleted successfully", product });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}));


productRouter.post(
  '/create',
  upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    try {
     
      if (!req.file) {
        throw new Error('No file uploaded');
      }
      const imagePath = req.file ? req.file.filename : null;

      const newProduct = new Product({
        name: req.body.name,
        slug: req.body.slug,
        image: imagePath, 
        price: req.body.price,
        category: req.body.category,
        brand: req.body.brand,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        description: req.body.description,
      });

      const product = await newProduct.save();
      res.status(201).send({ message: 'Product Created', product });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).send({ message: error.message || 'Invalid request' }); 
    }
  })
);




export default productRouter