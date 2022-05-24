import axios from 'axios';

const BASE_URL = "http://ec2-54-145-239-81.compute-1.amazonaws.com/api/config";

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