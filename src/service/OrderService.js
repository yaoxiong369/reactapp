import axios from 'axios';

const ORDER_API_BASE_URL = "http://ec2-54-145-239-81.compute-1.amazonaws.com/api/order";

class OrderService {

    getOrderList(page, limit, condition) {
        return axios.get(ORDER_API_BASE_URL + '/' + page + "/" + limit, {params: condition});
    }

    createOrder(order) {
        return axios.post(ORDER_API_BASE_URL+'/detail', order);
    }

    getOrderById(id) {
        return axios.get(ORDER_API_BASE_URL + '/' + id);
    }



    deleteOrder(orderNumber) {
        return axios.delete(ORDER_API_BASE_URL + "/delete/" + orderNumber);
    }

    finishOrder(orderNumber) {
        return axios.post(ORDER_API_BASE_URL + "/finish/" + orderNumber);
    }

    getOrderDetailByOrderNumber(orderNumber) {
        return axios.get(ORDER_API_BASE_URL + "/place/" + orderNumber);
    }

    placeOrder(customerOrder) {
        return axios.post(ORDER_API_BASE_URL + "/place" ,  customerOrder);
    }

    getOrderDayAggregation() {
        return axios.get(ORDER_API_BASE_URL + "/aggregation/" + 30);
    }

    getRevenueDayAggregation() {
        return axios.get(ORDER_API_BASE_URL + "/revenue/aggregation/" + 30);
    }

    getOrderTimeLine(){
        return axios.get(ORDER_API_BASE_URL + "/timeline");
    }

}

export default new OrderService();