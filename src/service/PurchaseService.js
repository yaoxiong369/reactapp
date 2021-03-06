import axios from 'axios';

const PURCHASE_API_BASE_URL = "/api/purchase";

class PurchaseService {

    getPurchaseList(condition) {
        return axios.get(PURCHASE_API_BASE_URL,{params:condition});
    }

    createPurchase(purchase) {
        return axios.post(PURCHASE_API_BASE_URL, purchase);
    }

    getPurchaseById(purchaseId) {
        return axios.get(PURCHASE_API_BASE_URL + '/' + purchaseId);
    }

    updatePurchase(purchase) {
        return axios.put(PURCHASE_API_BASE_URL , purchase);
    }

    deletePurchase(purchaseId) {
        return axios.delete(PURCHASE_API_BASE_URL + "/" + purchaseId);
    }

}

export default new PurchaseService();