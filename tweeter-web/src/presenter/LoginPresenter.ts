import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
  setIsLoading(value: boolean): void;
  updateUserInfo(
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
  navigate(url: string): void;
  displayErrorMessage(message: string): void;
}

export class LoginPresenter {
  private view: LoginView;
  private service: UserService;

  constructor(view: LoginView) {
    this.view = view;
    this.service = new UserService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
