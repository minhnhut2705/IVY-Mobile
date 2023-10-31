import createApiClient from "./api.service";
class userService {
    constructor(baseUrl = "/api/users") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/"));
    }
    async login(data) {
        return (await this.api.post("/login", data));
    }
    async fakeLogin(data) {
        return (await this.api.post("/fakelogin", data));
    }
    async register(data) {
        return (await this.api.post("/register", data));
    }
    async getUserData(data) {
        return (await this.api.post("/getUserData", data));
    }
    async updateFavorites(id, data) {
        return (await this.api.patch(`/updateFavorites/${id}`, data));
    }
    async updatePlaylists(id, data) {
        return (await this.api.patch(`/updatePlaylists/${id}`, data));
    }
    async updateUserInfo(id, data) {
        return (await this.api.patch(`/updateUserInfo/${id}`, data));
    }
    async updateUserInfoPassword(id, data) {
        return (await this.api.patch(`/updateUserInfoPassword/${id}`, data));
    }
    async updateSongs(id, data) {
        return (await this.api.patch(`/updateSongs/${id}`, data));
    }
    async updateUserAvatar(id, data) {
        return (await this.api.patch(`/updateUserAvatar/${id}`, data));
    }
    async deleteOne(id) {
        return (await this.api.delete(`/delete/${id}`));
    }
    async checkExistEmail(data) {
        return (await this.api.post("/checkExistEmail", data));
    }

}
export default new userService();
