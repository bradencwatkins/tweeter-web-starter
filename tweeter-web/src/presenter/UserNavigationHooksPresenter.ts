import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationHooksView extends View {
  setDisplayedUser(value: User): void;
  navigate(value: string): void;
}

export class UserNavigationHooksPresenter extends Presenter<UserNavigationHooksView> {
  private service: UserService;

  constructor(view: UserNavigationHooksView) {
    super(view);
    this.service = new UserService();
  }

  public async navigateToUser(
    featureUrl: string,
    authToken: AuthToken,
    displayedUser: User | null,
    alias: string
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const toUser = await this.service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featureUrl}/${toUser.alias}`);
        }
      }
    }, "get user");
  }
}
