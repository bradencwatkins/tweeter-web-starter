import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AppNavbarView {
  displayInfoMessage(message: string, duration: number): string;
  deleteMessage(messageId: string): void;
  clearUserInfo(): void;
  navigate(url: string): void;
  displayErrorMessage(message: string): void;
}

export class AppNavbarPresenter {
  private view: AppNavbarView;
  private service: UserService;

  constructor(view: AppNavbarView) {
    this.view = view;
    this.service = new UserService();
  }

  public async logOut(authToken: AuthToken | null) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
