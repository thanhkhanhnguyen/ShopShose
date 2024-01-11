export function parseOrderStatus(statusId) {
    switch (statusId) {
        case 0:
            return "Pending";
        case 1:
            return "Confirmed";
        case 2:
            return "Shipped";
        case 3:
            return "Cancelled";
        case 4:
            return "Completed";
        default:
            return "Pending";
    }
}