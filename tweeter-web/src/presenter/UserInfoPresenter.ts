import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { FollowPresenter } from "./FollowPresenter";

export interface UserInfoView extends View {
  setIsFollower(value: boolean): void;
  setFolloweeCount(value: number): void;
  setFollowerCount(value: number): void;
}

export class UserInfoPresenter extends FollowPresenter<UserInfoView> {
  private service: UserService;

  constructor(view: UserInfoView) {
    super(view);
    this.service = new UserService();
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.service.getIsFollowerStatus(authToken, user, selectedUser);
  }

  public async determineFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
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
    }, "determine follower status");
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.service.getFolloweeCount(authToken, user);
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.service.getFollowerCount(authToken, user);
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFollowOperation(
      () => this.service.follow(authToken, displayedUser),
      true,
      "follow user"
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFollowOperation(
      () => this.service.unfollow(authToken, displayedUser),
      false,
      "unfollow user"
    );
  }
}
