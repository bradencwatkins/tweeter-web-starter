import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserService } from "../../model.service/UserService";
import {
  UserNavigationHooksPresenter,
  UserNavigationHooksView,
} from "../../presenter/UserNavigationHooksPresenter";
import { User } from "tweeter-shared";

// ACTUAL HOOK no cap
export const useUserNavigation = () => {
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const listener: UserNavigationHooksView = {
    setDisplayedUser: (value: User) => setDisplayedUser(value),
    navigate: (value: string) => navigate(value),
    displayErrorMessage: (message: string) => displayErrorMessage(message),
  };

  const presenter = new UserNavigationHooksPresenter(listener);

  const navigateToUser = async (
    event: React.MouseEvent,
    featureUrl: string
  ) => {
    event.preventDefault();
    const alias = extractAlias(event.target.toString());

    await presenter.navigateToUser(
      featureUrl,
      authToken!,
      displayedUser,
      alias
    );
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  return {
    navigateToUser,
  };
};
