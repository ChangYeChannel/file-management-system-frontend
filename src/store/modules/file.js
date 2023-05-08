export default {
  namespaced: true,
  state: {
    id: "",
    name: "",
    idCard: "",
    joinTime: "",
    sex: "",
    birthday: "",
    joinPartyBranchesName: "",
    positiveTime: "",
    referencesOne: "",
    referencesTwo: "",
    positivePartyBranchesName: "",
    volunteerBookId: "",
    createTime: "",
    imgPath: "",
  },
  mutations: {
    updateId(state, id) {
      state.id = id;
    },
    updateName(state, name) {
      state.name = name;
    },
    updateIdCard(state, idCard) {
      state.idCard = idCard;
    },
    updateJoinTime(state, joinTime) {
      state.joinTime = joinTime;
    },
    updateSex(state, sex) {
      state.sex = sex;
    },
    updateBirthday(state, birthday) {
      state.birthday = birthday;
    },
    updateJoinPartyBranchesName(state, joinPartyBranchesName) {
      state.joinPartyBranchesName = joinPartyBranchesName;
    },
    updatePositiveTime(state, positiveTime) {
      state.positiveTime = positiveTime;
    },
    updateReferencesOne(state, referencesOne) {
      state.referencesOne = referencesOne;
    },
    updateReferencesTwo(state, referencesTwo) {
      state.referencesTwo = referencesTwo;
    },
    updatePositivePartyBranchesName(state, positivePartyBranchesName) {
      state.positivePartyBranchesName = positivePartyBranchesName;
    },
    updateVolunteerBookId(state, volunteerBookId) {
      state.volunteerBookId = volunteerBookId;
    },
    updateInboundTime(state, inboundTime) {
      state.inboundTime = inboundTime;
    },
    updateImgPath() {
      state.imgPath = imgPath;
    },
  },
};
