import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../../src/presenter/PostStatusPresenter";
import { render, screen } from "@testing-library/react";
import { UserEvent, userEvent } from "@testing-library/user-event";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "../../../../src/components/userInfo/UserInfoHooks";
import "@testing-library/jest-dom";
import { useUserInfo } from "../../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";

library.add(fab);

jest.mock("../../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatusComponent", () => {
  const mockUser = new User("FirstName", "LastName", "alias", "imageUrl");
  const mockAuthToken = new AuthToken("bingus", 123);
  const mockUserInstance = instance(mockUser);
  const mockAuthTokenInstance = instance(mockAuthToken);

  async function typePostAndVerifyEnabled(
    user: UserEvent,
    postField: HTMLElement,
    postStatusButton: HTMLElement,
    clearButton: HTMLElement,
    postText: string = "this is a post"
  ) {
    user.type(postField, "this is a post");
    expect(clearButton).toBeEnabled;
    expect(postStatusButton).toBeEnabled;
  }

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("post staus and clear buttons disable on render", async () => {
    const { clearButton, postStatusButton } = renderPostStatusAndGetElement();
    expect(clearButton).toBeDisabled;
    expect(postStatusButton).toBeDisabled;
  });

  it("Both buttons are enabled when the text field has text", () => {
    const { user, clearButton, postStatusButton, postField } =
      renderPostStatusAndGetElement();
    typePostAndVerifyEnabled(user, postField, postStatusButton, clearButton);
  });

  it("Both buttons are disabled when the text field is cleared", async () => {
    const { user, clearButton, postStatusButton, postField } =
      renderPostStatusAndGetElement();
    typePostAndVerifyEnabled(user, postField, postStatusButton, clearButton);

    await user.clear(postField);
    expect(clearButton).toBeDisabled;
    expect(postStatusButton).toBeDisabled;
  });

  it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const post = "this is a post";

    const { user, postStatusButton, postField } =
      renderPostStatusAndGetElement();

    await user.type(postField, post);
    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)
    );
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus();

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByLabelText("post text area");

  return { user, postStatusButton, clearButton, postField };
}
