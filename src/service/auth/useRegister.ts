import { API } from "../api.ts";
import { SERVER } from "../../environment.ts";
import { IUser } from "../../common/models/User.ts";
export interface IRegisterForm {
  username: string;
  password: string;
  email: string;
  confirm_password?: string;
}
const register = async (formData: IRegisterForm) => {
  return await API.post<{ user: IUser; token: string }>(
    SERVER.auth.url,
    "/registry",
    formData
  );
};
export default register;
