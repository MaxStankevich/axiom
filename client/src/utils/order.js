export const getOrdersParams = () => {
  const value = localStorage.getItem("ordersParams");
  return value ? JSON.parse(value) : { page: 1, size: 10, filter: {}, order: '[["createdAt", "DESC"]]' };
}

export const setOrdersParams = (data) => {
  localStorage.setItem("ordersParams", JSON.stringify(data))
}