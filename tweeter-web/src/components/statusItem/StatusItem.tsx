/* imports */
import { Link, useNavigate, useParams } from "react-router-dom";
import Post from "./Post";
import { Status, User } from "tweeter-shared";
import { useUserNavigation } from "../userNavigation/UserNavigationHooks";

/* interface to pass items prop */
interface Props {
  user: User;
  status: Status;
  featurePath: string;
}

const statusItem = (props: Props) => {
  const { navigateToUser } = useUserNavigation();

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
                to={`${props.featurePath}/${props.user.alias}`}
                onClick={(event) => navigateToUser(event, props.featurePath)}
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

export default statusItem;
