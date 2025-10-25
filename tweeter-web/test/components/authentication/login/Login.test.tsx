import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { UserEvent, userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("LoginComponent", () => {
  async function typeCredentialsAndVerifyEnabled(
    user: UserEvent,
    aliasField: HTMLElement,
    passwordField: HTMLElement,
    signInButton: HTMLElement,
    alias: string = "bingus",
    password: string = "bongus"
  ) {
    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    expect(signInButton).toBeEnabled();
  }

  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables sign in button if both alias and password fields have text", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/");

    await typeCredentialsAndVerifyEnabled(
      user,
      aliasField,
      passwordField,
      signInButton
    );
  });

  it("disables the sign in button if either the alias or password field is cleared", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/");

    await typeCredentialsAndVerifyEnabled(
      user,
      aliasField,
      passwordField,
      signInButton
    );

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "a");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with the correct parameters when the sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const originalUrl = "http://bingus.com";
    const alias = "@alias";
    const password = "password";

    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
