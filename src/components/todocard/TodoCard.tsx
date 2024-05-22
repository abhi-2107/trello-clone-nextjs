"use client";
import { XCircleIcon } from "@heroicons/react/20/solid";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { useBoardStore } from "../../../store/BoardStore";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask);

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className="bg-white space-y-2 drop-shadow-sm hover:shadow-red-900 p-3 rounded-xl border-4 hover:border-blue-500 "
    >
      <div className="flex justify-between items-center text-lg  text-slate-950 ">
        <p>{todo.title}</p>
        <button onClick={() => deleteTask(index, todo, id)}>
          <XCircleIcon className="w-8 text-red-700 hover:text-red-600" />
        </button>
      </div>
      {/* add image here  */}
    </div>
  );
}

export default TodoCard;
