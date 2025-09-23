/* imports */
import { Link, useNavigate, useParams } from "react-router-dom";
import Post from "./Post";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import { useContext, useEffect, useState } from "react";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { PAGE_SIZE } from "../mainLayout/FolloweesScroller";
import { UserInfoActionsContext, UserInfoContext } from "../userInfo/UserInfoContexts";

/* interface to pass items prop */
interface Props {
    user: User;
    status: Status
    featurePath: string;
}




const statusItem = (props: Props) => {
    const { displayToast } = useContext(ToastActionsContext);

    const [items, setItems] = useState<Status[]>([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [lastItem, setLastItem] = useState<Status | null>(null);

    const { displayedUser, authToken } = useContext(UserInfoContext);
    const { setDisplayedUser } = useContext(UserInfoActionsContext);
    const { displayedUser: displayedUserAliasParam } = useParams(); 
    
    const addItems = (newItems: Status[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

    const navigate = useNavigate();

    // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
    useEffect(() => {
      if (
        authToken &&
        displayedUserAliasParam &&
        displayedUserAliasParam != displayedUser!.alias
      ) {
        getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
          if (toUser) {
            setDisplayedUser(toUser);
          }
        });
      }
    }, [displayedUserAliasParam]);


    // Initialize the component whenever the displayed user changes
    useEffect(() => {
      reset();
      loadMoreItems(null);
    }, [displayedUser]);

    const reset = async () => {
      setItems(() => []);
      setLastItem(() => null);
      setHasMoreItems(() => true);
    };

    const loadMoreItems = async (lastItem: Status | null) => {
      try {
        const [newItems, hasMore] = await loadMoreFeedItems(
          authToken!,
          displayedUser!.alias,
          PAGE_SIZE,
          lastItem
        );
  
        setHasMoreItems(() => hasMore);
        setLastItem(() => newItems[newItems.length - 1]);
        addItems(newItems);
      } catch (error) {
        displayToast(
          ToastType.Error,
          `Failed to load feed items because of exception: ${error}`,
          0
        );
      }
    };

  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };




    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        try {
        const alias = extractAlias(event.target.toString());

        const toUser = await getUser(authToken!, alias);

        if (toUser) {
            if (!toUser.equals(displayedUser!)) {
            setDisplayedUser(toUser);
            navigate(`${props.featurePath}/${toUser.alias}`);
            }
        }
        } catch (error) {
        displayToast(
            ToastType.Error,
            `Failed to get user because of exception: ${error}`,
            0
        );
        }
    }; 
    
    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    const getUser = async (
      authToken: AuthToken,
      alias: string
    ): Promise<User | null> => {
      // TODO: Replace with the result of calling server
      return FakeData.instance.findUserByAlias(alias);
    };

    return (
        <div className="col bg-light mx-0 px-0">
            <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={props.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {props.user.firstName} {props.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={`/story/${props.user.alias}`}
                        onClick={navigateToUser}
                      >
                        {props.user.alias}
                      </Link>
                    </h2>
                    {props.status.formattedDate}
                    <br />
                    <Post status={props.status} featurePath={props.featurePath} />
                  </div>
                </div>
            </div>
        </div>
    );
};

export default statusItem