import { mock, instance, verify, anything, spy, when, capture } from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const authToken = new AuthToken("bingus", Date.now());
  const post = "Hi this is a post";
  const currentUser = new User("FirstName", "LastName", "Alias", "imageUrl");

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);
    when(mockPostStatusPresenterView.displayInfoMessage("Posting Status...", 0)).thenReturn("messageId321");

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();

    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);

    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);
    verify(mockService.postStatus(authToken, anything())).once();
  });

  it("tells the view to clear the info message that was displayed previously, clears the post, and displays a status posted message when successful", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);

    verify(mockPostStatusPresenterView.deleteMessage("messageId321"));
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();

    verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    let error = new Error("An error occurred");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);
    await postStatusPresenter.submitPost(post, currentUser, authToken);

    verify(mockPostStatusPresenterView.displayErrorMessage(`Failed to post the status because of exception: An error occurred`)).once();
    verify(mockPostStatusPresenterView.deleteMessage("messageId321")).once();

    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
