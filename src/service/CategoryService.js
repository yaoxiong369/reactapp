import axios from 'axios';

const BASE_URL = "/api/config";

class CategoryService {

    getCategoryList() {
        return axios.get(BASE_URL+'/category/list');
    }

    getUnitList() {
        return axios.get(BASE_URL+'/unit/list');
    }

    getLocationList() {
        return axios.get(BASE_URL+'/location/list');
    }

}

export default new CategoryService();