import axios from "axios";

export async function getProductsByQuery(q: string) {
    try {
      return await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${q}&&limit=4`);
    } catch (error) {
      console.error(error);
      return error;
    }
}
  
export async function getProductById(id: string) {
    try {
      return await axios.get(`https://api.mercadolibre.com/items/${id}`);
    } catch (error) {
      console.error(error);
      return error;
    }
}
  
  export async function getProductDescriptionById(id: string) {
    try {
      return await axios.get(
        `https://api.mercadolibre.com/items/${id}/description`
      );
    } catch (error) {
      console.error(error);
      return error;
    }
}
  
export async function getProductCategoryById(id: string) {
    try {
      return await axios.get(`https://api.mercadolibre.com/categories/${id}`);
    } catch (error) {
      return error;
    }
}