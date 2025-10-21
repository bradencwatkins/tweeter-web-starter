import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  updateUserInfo(
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
  navigate(url: string): void;
}

export abstract class AuthenticationPresenter<
  V extends AuthenticationView
> extends Presenter<V> {
  protected async doAuthenticationOperation(
    operation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    operationDescription: string,
    originalUrl?: string
  ) {
    await this.doFailureReportingOperation(async () => {
      const [user, authToken] = await operation();

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    }, operationDescription);
  }
}
