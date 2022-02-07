import { faBiking, faBurn, faClock } from "@fortawesome/free-solid-svg-icons";
import Divider from "../design/Divider";

type PropsType = {
  distance: number;
  time: number;
  calories: number;
};

const DataView = (props: PropsType): JSX.Element => {
  return (
    <>
      <Divider
        icon={faBiking}
        bgColor="#ff3d00"
        primary="走行距離"
        secondary={props.distance + "km"}
        width="40%"
      />
      <Divider
        icon={faClock}
        bgColor="#ff3d00"
        primary="時間"
        secondary={props.time + "分"}
        width="40%"
      />
      <Divider
        icon={faBurn}
        bgColor="#ff3d00"
        primary="消費カロリー"
        secondary={props.calories + "kcal"}
        width="40%"
      />
    </>
  );
};

export default DataView;
