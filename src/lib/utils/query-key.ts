export const queryKeyFactory = {
  base: (key: string) => [key],
  signIn: () => queryKeyFactory.base("signIn"),
  signUp: () => queryKeyFactory.base("signUp"),
  verify: () => queryKeyFactory.base("verify"),
  users: () => queryKeyFactory.base("users"),
  roles: () => queryKeyFactory.base("roles"),
  driversPositions: () => queryKeyFactory.base("driversPositions"),
  products: () => queryKeyFactory.base("products"),
  orders: () => queryKeyFactory.base("orders"),
  routes: () => queryKeyFactory.base("routes"),
  roleByUserId: () => queryKeyFactory.base("roleByUserId"),
  permissions: () => queryKeyFactory.base("permissions"),
  shipments: () => queryKeyFactory.base("shipments"),
  seamstress: () => queryKeyFactory.base("seamstress"),
  chats: () => queryKeyFactory.base("chats"),
  chatRooms: () => queryKeyFactory.base("chatRooms"),
  chatRoomMessages: () => queryKeyFactory.base("chatRoomMessages"),
  shipmentsImports: () => queryKeyFactory.base("shipmentsImports"),
};

export default queryKeyFactory;
