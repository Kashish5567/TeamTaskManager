import API from "./axios";

export async function getMembers() {
  const res = await API.get("/members");
  return res.data;
}

export async function createMember(payload) {
  const res = await API.post("/members", payload);
  return res.data.member;
}

export async function updateMember(memberId, payload) {
  const res = await API.put(`/members/${memberId}`, payload);
  return res.data.member;
}

export async function deleteMember(memberId) {
  const res = await API.delete(`/members/${memberId}`);
  return res.data;
}

