import { Presenter, View } from "./Presenter";

export interface FollowView extends View {
  setIsFollower(value: boolean): void;
  setFolloweeCount(value: number): void;
  setFollowerCount(value: number): void;
}

export abstract class FollowPresenter<
  V extends FollowView
> extends Presenter<V> {
  protected async doFollowOperation(
    followOperation: () => Promise<
      [followerCount: number, followeeCount: number]
    >,
    isFollowerValue: boolean,
    operationDescription: string
  ) {
    await this.doFailureReportingOperation(async () => {
      const [followerCount, followeeCount] = await followOperation();

      this.view.setIsFollower(isFollowerValue);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, operationDescription);
  }
}
