import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export interface UserNavigationHooksView {
  setDisplayedUser(value: User): void;
  navigate(value: string): void;
  displayErrorMessage(message: string): void;
}

export class UserNavigationHooksPresenter {
  private view: UserNavigationHooksView;
  private service: UserService;
  
  constructor(view: UserNavigationHooksView) {
    this.view = view;
    this.service = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    featureUrl: string,
    authToken: AuthToken,
    displayedUser: User | null,
  ): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const toUser = await this.service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featureUrl}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  private extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

}