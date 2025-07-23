"use client";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useBoardStore } from "../../../store/BoardStore";
import Column from "@/components/column/Column";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

function Board() {
  const [loading, setLoading] = useState(true);
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );
  useEffect(() => {
    try {
      getBoard();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [getBoard]);
  console.log(board.columns);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // console.log(source,destination,type)
    if(!destination) return;
    // if (!result.destination) return;

    // handle column drag
    if (type == "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    // handle individual cards drop, indexes are stored as 0,1,2,3 so we need to change them to numbers to make array manipulations
    const columns = Array.from(board.columns.entries());
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination?.droppableId)];
    debugger;
    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    console.log(startCol, finishCol);

    if (!startCol || !finishCol) return;
    if (source.index === destination.index && startCol === finishCol) return;
    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);
    if (startCol.id === finishCol.id) {
      // dragging to same column
      newTodos.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      setBoardState({ ...board, columns: newColumns });
      updateTodoInDB(todoMoved,finishCol.id)
    } else {
      // dragging to other column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      // update DB
      setBoardState({ ...board, columns: newColumns });
      updateTodoInDB(todoMoved, finishCol.id);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      {loading ? (
        <ArrowPathIcon className="w-20 animate-spin mx-auto mt-36 text-blue-900"/>
      ) : (
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided, snapshot) => (
            <div
              className={`grid grid-cols-1  md:grid-cols-3 gap-5 max-w-5xl px-2  md:px-5 md:mx-auto mb-5 `}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {Array.from(board.columns.entries()).map(
                ([id, column], index) => (
                  <Column key={id} id={id} todos={column.todos} index={index} />
                )
              )}
            </div> 
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
}

export default Board;
