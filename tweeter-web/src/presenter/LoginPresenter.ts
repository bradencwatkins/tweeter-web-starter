import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export interface LoginView extends View {
  updateUserInfo(
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
  navigate(url: string): void;
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  private service: UserService;

  constructor(view: LoginView) {
    super(view);
    this.service = new UserService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    await this.doAuthenticationOperation(
      () => this.service.login(alias, password),
      rememberMe,
      "log user in",
      originalUrl
    );
  }
}
