import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserInfoView {
  setIsFollower(value: boolean): void;
  setFolloweeCount(value: number): void;
  setFollowerCount(value: number): void;
  displayError(message: string): void;
}

export class UserInfoPresenter {
  private service: UserService;
  private view: UserInfoView;


  constructor(view: UserInfoView) {
    this.service = new UserService();
    this.view = view;
  }

  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.service.getIsFollowerStatus(authToken, user, selectedUser)
  };

  public async determineFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        
        const isFollower = await this.service.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser
        );
        this.view.setIsFollower(isFollower);
      }
    } catch (error) {
      this.view.displayError(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.service.getFolloweeCount(authToken, user);
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFolloweeCount(await this.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayError(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.service.getFollowerCount(authToken, user)
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFollowerCount(await this.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayError(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

}