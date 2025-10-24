import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const createStatusItemFactory = (featurePath: string) => (item: Status) =>
  <StatusItem user={item.user} status={item} featurePath={featurePath} />;

const createUserItemFactory = (featurePath: string) => (item: User) =>
  <UserItem user={item} featurePath={featurePath} />;

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <ItemScroller
              key={`feed-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentFactory={createStatusItemFactory("/feed")}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <ItemScroller
              key={`story-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentFactory={createStatusItemFactory("/story")}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <ItemScroller
              key={`followees-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentFactory={createUserItemFactory("/followees")}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <ItemScroller
              key={`followers-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentFactory={createUserItemFactory("/followers")}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
