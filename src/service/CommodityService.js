import axios from 'axios';

const COMMODITY_API_BASE_URL = "/api/commodity";

class CommodityService {

    getCommodityList(page, limit, condition) {
        return axios.get(COMMODITY_API_BASE_URL + '/' + page + "/" + limit, {params: condition});
    }

    getCommodtiyWithPurchases(page, pageSize, orderNumber, keyword) {
        return axios.get(COMMODITY_API_BASE_URL + '/withorder' + '/' + page + '/' + pageSize + '?orderNumber=' + orderNumber + '&keyword=' + keyword);
    }

    createCommodity(employee) {
        return axios.post(COMMODITY_API_BASE_URL, employee);
    }

    getCommodityById(id) {
        return axios.get(COMMODITY_API_BASE_URL + '/' + id);
    }

    updateCommodity(employee) {
        return axios.put(COMMODITY_API_BASE_URL, employee);
    }

    deleteCommodity(employeeId) {
        return axios.delete(COMMODITY_API_BASE_URL + "/" + employeeId);
    }

}

export default new CommodityService();