import { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import Styles from "./index.module.scss";
import Divider from "../../components/design/Divider";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
type PropsType = {
  positions: google.maps.LatLngLiteral[];
  setPositions: (newPositions: google.maps.LatLngLiteral[]) => void;
};

const DnD = (props: PropsType) => {
  useEffect(() => {
    console.log(props.positions);
  });
  const reorder = (
    list: Array<google.maps.LatLngLiteral>,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(props.positions);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      props.positions,
      result.source.index,
      result.destination.index
    );
    props.setPositions(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={Styles.dnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={Styles.droppableDiv}
            >
              {props.positions.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={index.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Divider
                        icon={faCompass}
                        bgColor="#ffbf00"
                        primary="経路"
                        secondary={item.lat}
                        width="80%"
                      ></Divider>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default DnD;
