export const SERVER = {
  auth: {
    host: "http://localhost",
    port: 7071,
    get url() {
      return `${this.host}:${this.port}/api/auth`;
    },
  },
  user: {
    host: "http://localhost",
    port: 6066,
    get url() {
      return `${this.host}:${this.port}/api/info`;
    },
  },
  product: {
    host: "http://localhost",
    port: 7081,
    get url() {
      return `${this.host}:${this.port}/api`;
    },
  },
  payment: {
    host: "http://localhost",
    port: 9898,
    get url() {
      return `${this.host}:${this.port}/api`;
    },
  },
  chat: {
    host: "http://localhost",
    port: 7081,
    get url() {
      return `${this.host}:${this.port}/api`;
    },
  },
  noti: {
    host: "http://localhost",
    port: 8888,
    get url() {
      return `${this.host}:${this.port}/api/notifications`;
    },
  },
};
export const key={
  amountKey:"toilamotchillguysieucapcutedethuongsieucap"
}
