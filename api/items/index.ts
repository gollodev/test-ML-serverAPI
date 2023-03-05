import express, { NextFunction } from 'express';
import { 
    getProductById, 
    getProductCategoryById, 
    getProductDescriptionById, 
    getProductsByQuery 
} from '../../services/index';
import { authorMiddleware } from '../../middlewares';

const router = express.Router();

function apiCall(req: any, res: any, next: NextFunction) {
    if (req.query && req.query.q) {
        getProductsByQuery(req.query.q).then((result: any) => {
            res.data = result.data;
            next();
        });
    } else if (req.params && req.params.id) {
        const productPromise = getProductById(req.params.id);
        const productDescriptionPromise = getProductDescriptionById(req.params.id);

        Promise.all([productPromise, productDescriptionPromise]).then(
            (result: any) => {
                const categoryId = result[0].data.category_id;
                getProductCategoryById(categoryId).then(
                    (categories: any) => {
                        res.data = Object.assign(
                            {},
                            result[0].data,
                            result[1].data,
                            { categories: categories && categories.data.path_from_root }
                        );
                        next();
                    }
                );
            }
        );
    }
}

function responseMiddleware(req: any, res: any, next: NextFunction) {
    const mapping: any = {
        author: res.author,
    };
    if (req.query && req.query.q) {
        mapping.items = res.data.results;
        mapping.categories = {};
    } else if (req.params && req.params.id) {
        const itemCondition = res.data.attributes.find((item: any) => item.id === 'ITEM_CONDITION');

        mapping.item = {
            id: res.data.id,
            title: res.data.title,
            price: {
                currency: res.data.currency_id,
                amount: res.data.price.toFixed(0),
                decimals: res.data.price % 1
            },
            picture: res.data.pictures.length && res.data.pictures[0],
            condition: itemCondition,
            free_shipping: res.data.shipping && res.data.shipping.free_shipping,
            sold_quantity: res.data.sold_quantity,
            description: res.data.plain_text
        }
        mapping.categories = res.data.categories;
    }
    res.json(mapping);
}

export default router.get(
  '/:id?',
  authorMiddleware,
  apiCall,
  responseMiddleware
)