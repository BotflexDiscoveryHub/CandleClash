import axios, { AxiosInstance } from "axios";
import { User } from "../types/User";
import { RewardProgress, RewardType } from '../routes/_auth/rewards/~types';

const baseURL = import.meta.env.VITE_BACKEND_URL;

export class API {
  client: AxiosInstance;
  url: string;
  currentUserId: number;
  initDataWasSet: boolean = false;

  constructor() {
    this.url = `${baseURL}/api/`;

    this.currentUserId =
      window.Telegram.WebApp.initDataUnsafe.user?.id ??
      import.meta.env.VITE_DEFAULT_TELEGRAM_ID;

    this.client = axios.create({
      baseURL: this.url,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    this.setInitData();
  }

  async setInitData(): Promise<void> {
    const initData = window.Telegram.WebApp.initData;

    this.client.defaults.headers.common["X-Init-Data"] = initData;
    this.initDataWasSet = true;
  }

  async getUser(userId: number) {
    return this.client.get<User>(`/${userId}`).then((res) => res.data);
  }

  async loadCurrentUser() {
    return this.getUser(this.currentUserId);
  }

  async createUser() {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;

    const data: Partial<User> = {
      telegramId: String(telegramUser!.id) ?? "",
      firstName: telegramUser!.first_name ?? "",
      lastName: telegramUser?.last_name ?? "",
      username: telegramUser?.username ?? "",
      languageCode: telegramUser!.language_code ?? "",
      rewards: []
    };

    return this.client.post<User>("/", data).then((res) => res.data);
  }

  async updateUser(user: Partial<User>) {
    return this.client
      .patch<User>(`/${this.currentUserId}`, user)
      .then((res) => res.data);
  }

  async getRewards() {
    return this.client
    .get<RewardProgress[]>(`/rewards/check-progress/${this.currentUserId}`)
    .then((res) => res.data);
  }

  async setReward(rewardId: string, rewardType: RewardType) {
    return this.client
    .post<RewardProgress[]>(`/rewards/set-reward/${this.currentUserId}`, {
      rewardId,
      rewardType,
    })
    .then((res) => res.data);
  }

  async setSessionGame(startedAt: Date, finalLiquidity: number) {
    return this.client
    .post<User>(`/game-session/${this.currentUserId}`, { startedAt, finalLiquidity })
    .then((res) => res.data);
  }
}

const api = new API();
export default api;
