import API from "./axios";

export async function getMyProfile() {
  const res = await API.get("/profile/me");
  return res.data;
}

export async function createProfile(payload) {
  const res = await API.post("/profile", payload);
  return res.data.profile;
}

