import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  displayInfoMessage(message: string, duration: number): string;
  setPost(value: string): void;
  displayErrorMessage(message: string): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _service: StatusService;

  constructor(view: PostStatusView) {
    super(view);
    this._service = new StatusService();
  }

  public get service() {
    return this._service;
  }

  public async submitPost(post: string, currentUser: User | null, authToken: AuthToken | null) {
    const postingStatusToatId = this.view.displayInfoMessage("Posting Status...", 0);
    this.doFailureReportingOperation(async () => {
      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.deleteMessage(postingStatusToatId);
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
    this.view.deleteMessage(postingStatusToatId);
  }
}
