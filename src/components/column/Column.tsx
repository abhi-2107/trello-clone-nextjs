"use client";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "../todocard/TodoCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useBoardStore } from "../../../store/BoardStore";
import { Button, Textarea } from "@headlessui/react";
import { useEffect, useState } from "react";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

function Column({ id, todos, index }: Props) {
  const [showAddTitle, setShowAddTitle] = useState(false);
  const [addTitleValue, setAddTitleValue] = useState("");
  const [addTitleLoading, setAddTitleLoading] = useState(false);
  const [searchString, addTask, getBoard] = useBoardStore((state) => [
    state.searchString,
    state.addTask,
    state.getBoard,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleSubmit = async (columnId: TypedColumn) => {
    setAddTitleLoading(true);
    const todoObj: Partial<Todo> = {
      title: addTitleValue,
      status: columnId,
    };
    console.log(columnId);
    await addTask(todoObj, columnId);
    setAddTitleValue("");
    setAddTitleLoading(false);
    setShowAddTitle(false);
  };
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* render droppable todos columns   */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 py-3  rounded-2xl shadow-sm border border-stone-400  ${
                  snapshot.isDraggingOver ? "bg-blue-100 shadow-lg shadow-blue-400" : "bg-white/55"
                }`}
              >
                <h2 className="flex justify-between p-2 text-xl font-bold">
                  {idToColumnText[id]}{" "}
                  <span className="p-1 mb-2 w-5 h-5 inline-flex justify-center items-center text-gray-500 rounded-full text-sm font-normal bg-gray-200">
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>

                <div className="space-y-1 max-h-[calc(60vh)] overflow-y-auto [scrollbar-width:thin]  ">
                  {todos.map((todo, index) => {
                    if (
                      !searchString ||
                      todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    ) {
                      return (
                        <Draggable
                          key={todo.$id}
                          draggableId={todo.$id}
                          index={index}
                        >
                          {(provided) => (
                            <TodoCard
                              todo={todo}
                              index={index}
                              id={id}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      );
                    }
                    return null;
                  })}
                  {provided.placeholder}
                  <div>
                    {showAddTitle ? (
                      <div className="flex flex-col  mx-1">
                        <Textarea
                          name="descripton"
                          value={addTitleValue}
                          onChange={(e) => setAddTitleValue(e.target.value)}
                          placeholder="Enter a title for this card..."
                          className="  p-2 text-lg rounded-xl focus:outline-none resize-none border border-slate-300 shadow-md"
                        ></Textarea>
                        <div className="my-3 flex">
                          <Button
                            type="submit"
                            onClick={() => handleSubmit(id)}
                            disabled={!addTitleValue || addTitleLoading}
                            className="rounded bg-[#0055D1] py-2 px-4 text-lg font-medium text-white data-[hover]:bg-blue-800 shadow-sm disabled:bg-slate-500"
                          >
                            {addTitleLoading ? "Adding..." : "Add card"}
                          </Button>
                          <XMarkIcon
                            className="w-11  hover:bg-zinc-200 ms-2 p-2"
                            onClick={() => {
                              setShowAddTitle(false);
                              setAddTitleValue("");
                            }}
                          ></XMarkIcon>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="w-full text-xl font-bold flex items-center justify-center p-2 rounded-xl hover:text-emerald-700  hover:bg-zinc-200"
                        onClick={() => setShowAddTitle(true)}
                      >
                        <PlusIcon className=" w-7 me-3" />
                        <span>Add a card</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
