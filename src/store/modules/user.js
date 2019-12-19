export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    type:"",
    orderMsgCountNumber:0,
    modelMsgCountNumber:0,
    simpleName:"",
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateType (state, type) {
      state.type = type
    },
    updateOrderMsgCountNumber (state, orderMsgCountNumber) {
      state.orderMsgCountNumber = orderMsgCountNumber
    },
    updateModelMsgCountNumber (state, modelMsgCountNumber) {
      state.modelMsgCountNumber = modelMsgCountNumber
    },
    updateSimpleName (state, simpleName) {
      state.simpleName = simpleName
    },
  }
}
